import crypto from 'crypto'
import moment from 'moment'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import {
  serverErrorResponse,
  createSuccessResponse,
  notFoundResponse,
  okResponse,
  unauthorizedResponse,
  badRequestResponse
} from 'generic-response'

import prisma from '../../config/database.config'
import s3 from '../../config/s3.config'

import calculateWalletBalance from '../../utils/calculateWalletBalance'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type JOB_TYPE = 'SOCIAL_MEDIA' | 'MEET_AND_GREET' | 'AUTOGRAPHS' | 'PHOTO_SHOOTS' | 'OTHER'

type TGetAllJobsQuery = {
  sportIds?: number[]
  jobType?: JOB_TYPE[]
  datePosted?: 'ANY_TIME' | 'PAST_24_HOURS' | 'PAST_WEEK' | 'PAST_MONTH'
  minimumCompensation?: 'NONE' | '$50' | '$100' | '$200' | '$400'
}

type TGetAllJobsWhereClause = {
  sportId?: { in: number[] }
  type?: { in: JOB_TYPE[] }
  createdAt?: { gte: Date }
  salary?: { gte: number }
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

const getAllJobs = async (
  req: AuthRequest<unknown, unknown, unknown, TGetAllJobsQuery>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { sportIds, jobType, datePosted, minimumCompensation } = req.query

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const whereClause: TGetAllJobsWhereClause = {}

    if (sportIds !== undefined) {
      whereClause.sportId = { in: sportIds }
    }

    if (jobType !== undefined) {
      whereClause.type = { in: jobType }
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
        UserHiddenJobs: {
          none: {
            userId
          }
        }
      },
      include: { JobRequiredQualifications: true }
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
  const user = req.user
  const { requiredQualification, ...data } = req.body

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
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

    const transactions = await prisma.userWallet.findMany({ where: { userId } })
    const walletBalance = calculateWalletBalance(transactions)

    if (walletBalance >= data.salary) {
      await prisma.userWallet.create({
        data: {
          userId,
          amount: data.salary,
          transactionType: 'DEBIT',
          sourceId: job.id
        }
      })

      await prisma.jobs.update({
        where: { id: job.id },
        data: { hasPaid: true }
      })

      const response = createSuccessResponse(job)
      return res.status(response.status.code).json(response)
    }

    const response = okResponse(
      { job, balance: walletBalance },
      'Job created successfully but cannot be published due to insufficient funds.'
    )
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
  uploadJobBanner,
  createJob
}
