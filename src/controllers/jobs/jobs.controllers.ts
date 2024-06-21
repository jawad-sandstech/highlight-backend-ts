import crypto from 'crypto'
import moment from 'moment'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import {
  serverErrorResponse,
  createSuccessResponse,
  notFoundResponse,
  okResponse,
  unauthorizedResponse,
  badRequestResponse,
  updateSuccessResponse
} from 'generic-response'

import prisma from '../../config/database.config'
import s3 from '../../config/s3.config'

import calculateWalletBalance from '../../utils/calculateWalletBalance'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'
import config from '../../config/config'

type JOB_TYPE = 'SOCIAL_MEDIA' | 'MEET_AND_GREET' | 'AUTOGRAPHS' | 'PHOTO_SHOOTS' | 'OTHER'

type TGetAllJobsQuery = {
  businessId?: string
  sportIds?: string | string[]
  jobType?: JOB_TYPE | JOB_TYPE[]
  datePosted?: 'ANY_TIME' | 'PAST_24_HOURS' | 'PAST_WEEK' | 'PAST_MONTH'
  minimumCompensation?: 'NONE' | '$50' | '$100' | '$200' | '$400'
}

type TGetAllJobsWhereClause = {
  userId?: number
  sportId?: number | { in: number[] }
  type?: JOB_TYPE | { in: JOB_TYPE[] }
  createdAt?: { gte: Date }
  salary?: { gte: number }
}

type TGetSingleJobParams = {
  jobId: string
}

type TCreateJobBody = {
  title: string
  description: string
  bannerImage: string
  requiredQualification: string[]
  salary: number
  sportId: number
  type: JOB_TYPE
}

type TPublishJobBody = {
  jobId: number
}

const insufficientFundsMessage = `Insufficient funds. 💡 Non-Premium businesses pay +${config.PLATFORM_FEE_PERCENTAGE}% salary.`

const getAllJobs = async (
  req: AuthRequest<unknown, unknown, unknown, TGetAllJobsQuery>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { businessId, sportIds, jobType, datePosted, minimumCompensation } = req.query

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const whereClause: TGetAllJobsWhereClause = {}

    if (businessId !== undefined) {
      whereClause.userId = Number(businessId)
    }

    if (sportIds !== undefined) {
      if (Array.isArray(sportIds)) {
        whereClause.sportId = { in: sportIds.map((i) => Number(i)) }
      } else {
        whereClause.sportId = Number(sportIds)
      }
    }

    if (jobType !== undefined) {
      if (Array.isArray(jobType)) {
        whereClause.type = { in: jobType }
      } else {
        whereClause.type = jobType
      }
    }

    if (datePosted !== undefined && datePosted !== 'ANY_TIME') {
      const now = moment()

      if (datePosted === 'PAST_24_HOURS') {
        whereClause.createdAt = {
          gte: now.subtract(24, 'hours').toDate()
        }
      }

      if (datePosted === 'PAST_WEEK') {
        whereClause.createdAt = {
          gte: now.subtract(7, 'days').toDate()
        }
      }

      if (datePosted === 'PAST_MONTH') {
        whereClause.createdAt = {
          gte: now.subtract(1, 'month').toDate()
        }
      }
    }

    if (minimumCompensation !== undefined && minimumCompensation !== 'NONE') {
      whereClause.salary = {
        gte: Number(minimumCompensation.split('$')[1])
      }
    }

    const jobs = await prisma.jobs.findMany({
      where: {
        ...whereClause,
        status: 'OPEN',
        UserHiddenJobs: {
          none: {
            userId
          }
        }
      },
      include: { User: true, UserSavedJobs: { where: { userId } } }
    })

    const response = okResponse(jobs)
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

const getSingleJob = async (
  req: AuthRequest<TGetSingleJobParams>,
  res: Response
): Promise<Response> => {
  const jobId = Number(req.params.jobId)

  try {
    const job = await prisma.jobs.findUnique({
      where: { id: jobId },
      include: {
        User: true,
        Sport: true,
        JobRequiredQualifications: true
      }
    })

    if (job === null) {
      const response = notFoundResponse('job not found')
      return res.status(response.status.code).json(response)
    }

    const response = okResponse({ job })
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

const uploadJobBanner = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { file } = req

  try {
    if (file === undefined) {
      const response = badRequestResponse('No file attached')
      return res.status(response.status.code).json(response)
    }

    const folderName = 'job-banner'

    const randomImageName = crypto.randomBytes(32).toString('hex')

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `${folderName}/${randomImageName}`,
      Body: file.buffer,
      ContentType: file.mimetype
    })

    await s3.send(command)

    const response = createSuccessResponse({ Key: `${folderName}/${randomImageName}` })
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

const createJob = async (
  req: AuthRequest<unknown, unknown, TCreateJobBody>,
  res: Response
): Promise<Response> => {
  const authenticatedUser = req.user
  const { requiredQualification, ...data } = req.body

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

    const existingSportId = await prisma.sports.findUnique({ where: { id: data.sportId } })

    if (existingSportId === null) {
      const response = notFoundResponse(`Sport with id: ${data.sportId} not found.`)
      return res.status(response.status.code).json(response)
    }

    const job = await prisma.jobs.create({
      data: {
        userId,
        ...data,
        JobRequiredQualifications: {
          createMany: {
            data: requiredQualification.map((i) => ({ description: i }))
          }
        }
      }
    })

    const isPremium = user?.BusinessInfo?.isPremium

    if (isPremium === undefined) {
      const response = badRequestResponse('Complete profile first')
      return res.status(response.status.code).json(response)
    }

    const transactions = await prisma.transactions.findMany({ where: { userId } })
    const walletBalance = calculateWalletBalance(transactions, 'BUSINESS')

    const platformFees = (data.salary * config.PLATFORM_FEE_PERCENTAGE) / 100

    if (walletBalance < data.salary || (!isPremium && walletBalance < data.salary + platformFees)) {
      const response = okResponse({ job, balance: walletBalance }, insufficientFundsMessage)
      return res.status(response.status.code).json(response)
    }

    await prisma.transactions.create({
      data: {
        userId,
        amount: data.salary,
        transactionType: 'HOLD',
        source: { event: 'JOB_CREATE', recourseId: job.id }
      }
    })

    if (!isPremium) {
      await prisma.transactions.create({
        data: {
          userId,
          amount: platformFees,
          transactionType: 'FEE',
          source: { event: 'JOB_CREATE', recourseId: job.id }
        }
      })
    }

    await prisma.jobs.update({
      where: { id: job.id },
      data: { hasPaid: true }
    })

    const response = createSuccessResponse(job)
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

const publishJob = async (
  req: AuthRequest<unknown, unknown, TPublishJobBody>,
  res: Response
): Promise<Response> => {
  const authenticatedUser = req.user
  const { jobId } = req.body

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

    const isPremium = user?.BusinessInfo?.isPremium

    if (isPremium === undefined) {
      const response = badRequestResponse('Complete profile first')
      return res.status(response.status.code).json(response)
    }

    const job = await prisma.jobs.findUnique({
      where: { id: jobId }
    })

    if (job === null) {
      const response = notFoundResponse(`job with id: ${jobId} not found`)
      return res.status(response.status.code).json(response)
    }

    if (job.userId !== userId) {
      const response = unauthorizedResponse('not yours')
      return res.status(response.status.code).json(response)
    }

    if (job.hasPaid) {
      const response = badRequestResponse('already published')
      return res.status(response.status.code).json(response)
    }

    const transactions = await prisma.transactions.findMany({ where: { userId } })
    const walletBalance = calculateWalletBalance(transactions, 'BUSINESS')

    const platformFees = (job.salary * config.PLATFORM_FEE_PERCENTAGE) / 100

    if (walletBalance < job.salary || (!isPremium && walletBalance < job.salary + platformFees)) {
      const response = okResponse({ job, balance: walletBalance }, insufficientFundsMessage)
      return res.status(response.status.code).json(response)
    }

    await prisma.transactions.create({
      data: {
        userId,
        amount: job.salary,
        transactionType: 'HOLD',
        source: { event: 'JOB_CREATE', recourseId: job.id }
      }
    })

    if (!isPremium) {
      await prisma.transactions.create({
        data: {
          userId,
          amount: platformFees,
          transactionType: 'FEE',
          source: { event: 'JOB_CREATE', recourseId: job.id }
        }
      })
    }

    await prisma.jobs.update({
      where: { id: job.id },
      data: { hasPaid: true }
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
  getAllJobs,
  getSingleJob,
  uploadJobBanner,
  createJob,
  publishJob
}
