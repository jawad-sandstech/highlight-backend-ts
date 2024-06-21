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

import type { Response } from 'express'
import type { AuthRequest } from '../../interfaces/auth-request'
import config from '../../config/config'

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
  sportId?: number
  year?: number
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
    const user = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (user === null) {
      const response = notFoundResponse('User not found')
      return res.status(response.status.code).json(response)
    }

    if (user.profilePicture !== null) {
      user.profilePicture = `${config.S3_ACCESS_URL}/${user.profilePicture}`
    }

    const response = okResponse(user)
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
      refresh_url: `${process.env.BACKEND_URL}/status`,
      return_url: `${process.env.BACKEND_URL}/api/v1/stripe/onboarding-success?accountId=${user.stripeAccountId}`,
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
      Bucket: process.env.BUCKET_NAME,
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
      data
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

    const existingSport = await prisma.sports.findUnique({ where: { id: data.sportId } })

    if (existingSport == null) {
      const response = notFoundResponse(`Sport with id: ${data.sportId} not found.`)
      return res.status(response.status.code).json(response)
    }

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
