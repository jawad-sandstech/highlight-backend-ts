import crypto from 'crypto'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import {
  okResponse,
  serverErrorResponse,
  notFoundResponse,
  updateSuccessResponse,
  deleteSuccessResponse,
  badRequestResponse,
  unauthorizedResponse
} from 'generic-response'

import prisma from '../../config/database.config'
import stripe from '../../config/stripe.config'
import s3 from '../../config/s3.config'

import type {
  Users,
  AthleteInfo,
  BusinessInfo,
  UserAthleticAchievements,
  UserGallery
} from '@prisma/client'
import type { Response } from 'express'
import type { AuthRequest } from '../../interfaces/auth-request'
import config from '../../config/config'
import calculateAge from '../../utils/calculateAge'

type UserProfileWithAge =
  | (Users & {
      age?: number | null
      AthleteInfo: AthleteInfo | null
      BusinessInfo: BusinessInfo | null
      UserAthleticAchievements: UserAthleticAchievements[]
      UserGallery: UserGallery[]
    })
  | null

type TUpdateProfileBody = {
  fullName?: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  address?: string
  phoneNumber?: string
  zoomId?: string
}

type TUpdateAthleteInfoBody = {
  schoolName?: string
  universityName?: string
  sportId?: number
  experience?:
    | 'BEGINNER'
    | 'INTERMEDIATE'
    | 'ADVANCED'
    | 'EXPERT'
    | 'ELITE'
    | 'RECREATIONAL'
    | 'SEMI_PROFESSIONAL'
    | 'PROFESSIONAL'
  position?: string
  bio?: string
  attachment?: string
  gallery?: Array<{
    path: string
  }>
  athleticAchievements?: Array<{
    gameName: string
    medalCount: number
  }>
}

type TUpdateBusinessInfoBody = {
  organizationName?: string
  industryType?: string
  founded?: string
  overview?: string
  phoneNumber?: string
  email?: string
  website?: string
}

const getMyProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { user } = req

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const user: UserProfileWithAge = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        AthleteInfo: {
          include: {
            Sport: true
          }
        },
        BusinessInfo: true,
        UserAthleticAchievements: true,
        UserGallery: true
      }
    })

    if (user === null) {
      const response = notFoundResponse('User not found')
      return res.status(response.status.code).json(response)
    }

    if (user.dateOfBirth !== null) {
      user.age = calculateAge(user.dateOfBirth)
    }

    user.profilePicture &&= `${config.S3_ACCESS_URL}/${user.profilePicture}`

    if (user.UserGallery.length > 0) {
      user.UserGallery.forEach((i) => {
        i.path = `${config.S3_ACCESS_URL}/${i.path}`
      })
    }

    const {
      _avg: { rating: averageRating }
    } = await prisma.userRating.aggregate({
      _avg: { rating: true },
      where: { athleteId: userId }
    })

    const userWithAverageRating = {
      ...user,
      averageReceivedRating: averageRating ?? 0
    }

    const response = okResponse(userWithAverageRating)
    return res.status(response.status.code).json(response)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      const response = serverErrorResponse(error.message)
      return res.status(response.status.code).json(response)
    } else {
      const response = serverErrorResponse('An unexpected error occurred')
      return res.status(response.status.code).json(response)
    }
  }
}

const stripeOnboard = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { user } = req

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const user = await prisma.users.findUnique({ where: { id: userId } })

    if (user === null) {
      const response = notFoundResponse('User not found')
      return res.status(response.status.code).json(response)
    }

    if (user.isStripeVerified) {
      const response = badRequestResponse('Already verified')
      return res.status(response.status.code).json(response)
    }

    if (user.stripeAccountId === null) {
      const response = badRequestResponse('user "stripe account" id is null')
      return res.status(response.status.code).json(response)
    }

    const accountLink = await stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: `${config.BACKEND_URL}/stripeError.html`,
      return_url: `${config.BACKEND_URL}/stripeSucess.html`,
      type: 'account_onboarding'
    })

    const response = okResponse({ onboardingUrl: accountLink.url })
    return res.status(response.status.code).json(response)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      const response = serverErrorResponse(error.message)
      return res.status(response.status.code).json(response)
    } else {
      const response = serverErrorResponse('An unexpected error occurred')
      return res.status(response.status.code).json(response)
    }
  }
}

const uploadPicture = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { user, file } = req

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    if (file === undefined) {
      const response = badRequestResponse('No file')
      return res.status(response.status.code).json(response)
    }

    const folderName = 'user-profiles'
    const randomImageName = crypto.randomBytes(32).toString('hex')

    const command = new PutObjectCommand({
      Bucket: config.S3_BUCKET_NAME,
      Key: `${folderName}/${randomImageName}`,
      Body: file.buffer,
      ContentType: file.mimetype
    })

    await s3.send(command)

    await prisma.users.update({
      where: { id: userId },
      data: { profilePicture: `${folderName}/${randomImageName}` }
    })

    const response = updateSuccessResponse()
    return res.status(response.status.code).json(response)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      const response = serverErrorResponse(error.message)
      return res.status(response.status.code).json(response)
    } else {
      const response = serverErrorResponse('An unexpected error occurred')
      return res.status(response.status.code).json(response)
    }
  }
}

const uploadAttachment = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { file } = req

  try {
    if (file === undefined) {
      const response = badRequestResponse('No file')
      return res.status(response.status.code).json(response)
    }

    const folderName = 'user-attachments'
    const randomImageName = crypto.randomBytes(32).toString('hex')

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `${folderName}/${randomImageName}`,
      Body: file.buffer,
      ContentType: file.mimetype
    })

    await s3.send(command)

    const response = okResponse(`${folderName}/${randomImageName}`)
    return res.status(response.status.code).json(response)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      const response = serverErrorResponse(error.message)
      return res.status(response.status.code).json(response)
    } else {
      const response = serverErrorResponse('An unexpected error occurred')
      return res.status(response.status.code).json(response)
    }
  }
}

const deleteAccount = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { user } = req

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    await prisma.users.delete({
      where: { id: userId }
    })

    const response = deleteSuccessResponse()
    return res.status(response.status.code).json(response)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      const response = serverErrorResponse(error.message)
      return res.status(response.status.code).json(response)
    } else {
      const response = serverErrorResponse('An unexpected error occurred')
      return res.status(response.status.code).json(response)
    }
  }
}

const updateProfile = async (
  req: AuthRequest<unknown, unknown, TUpdateProfileBody>,
  res: Response
): Promise<Response> => {
  const { user, body: data } = req

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (user === null) {
      const response = notFoundResponse('User not found')
      return res.status(response.status.code).json(response)
    }

    await prisma.users.update({
      where: { id: userId },
      data: {
        ...data,
        isProfileComplete: true
      }
    })

    const response = updateSuccessResponse()
    return res.status(response.status.code).json(response)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      const response = serverErrorResponse(error.message)
      return res.status(response.status.code).json(response)
    } else {
      const response = serverErrorResponse('An unexpected error occurred')
      return res.status(response.status.code).json(response)
    }
  }
}

const updateAthleteInfo = async (
  req: AuthRequest<unknown, unknown, TUpdateAthleteInfoBody>,
  res: Response
): Promise<Response> => {
  const authenticatedUser = req.user
  const { athleticAchievements, gallery, ...data } = req.body

  if (authenticatedUser === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = authenticatedUser

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: { AthleteInfo: true }
    })

    if (user === null) {
      const response = unauthorizedResponse()
      return res.status(response.status.code).json(response)
    }

    if (data.sportId !== undefined) {
      const existingSport = await prisma.sports.findUnique({ where: { id: data.sportId } })

      if (existingSport == null) {
        const response = notFoundResponse('sports not found.')
        return res.status(response.status.code).json(response)
      }
    }

    await prisma.users.update({
      where: { id: user.id },
      data: { hasUpdatedAthleteInfo: true }
    })

    await prisma.athleteInfo.update({
      where: { id: user.AthleteInfo?.id },
      data: {
        userId,
        ...data
      }
    })

    if (athleticAchievements !== undefined) {
      await prisma.userAthleticAchievements.createMany({
        data: athleticAchievements.map((i) => ({ userId, ...i }))
      })
    }

    if (gallery !== undefined) {
      await prisma.userGallery.createMany({
        data: gallery.map((i) => ({ userId, ...i }))
      })
    }

    const response = updateSuccessResponse()
    return res.status(response.status.code).json(response)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      const response = serverErrorResponse(error.message)
      return res.status(response.status.code).json(response)
    } else {
      const response = serverErrorResponse('An unexpected error occurred')
      return res.status(response.status.code).json(response)
    }
  }
}

const updateBusinessInfo = async (
  req: AuthRequest<unknown, unknown, TUpdateBusinessInfoBody>,
  res: Response
): Promise<Response> => {
  const authenticatedUser = req.user
  const data = req.body

  if (authenticatedUser === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = authenticatedUser

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: { BusinessInfo: true }
    })

    if (user === null) {
      const response = unauthorizedResponse()
      return res.status(response.status.code).json(response)
    }

    await prisma.users.update({
      where: { id: user.id },
      data: { hasUpdatedBusinessInfo: true }
    })

    await prisma.businessInfo.update({
      where: { id: user.BusinessInfo?.id },
      data: {
        userId,
        ...data
      }
    })

    const response = updateSuccessResponse()
    return res.status(response.status.code).json(response)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      const response = serverErrorResponse(error.message)
      return res.status(response.status.code).json(response)
    } else {
      const response = serverErrorResponse('An unexpected error occurred')
      return res.status(response.status.code).json(response)
    }
  }
}

export default {
  getMyProfile,
  stripeOnboard,
  uploadPicture,
  uploadAttachment,
  deleteAccount,
  updateProfile,
  updateAthleteInfo,
  updateBusinessInfo
}
