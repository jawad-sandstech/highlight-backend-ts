import {
  badRequestResponse,
  notFoundResponse,
  okResponse,
  serverErrorResponse,
  unauthorizedResponse,
  updateSuccessResponse
} from 'generic-response'

import prisma from '../../config/database.config'

import type { Response } from 'express'
import type { JOB_APPLICATION_STATUS } from '@prisma/client'

import type { AuthRequest } from '../../interfaces/auth-request'

type TGetAllApplicationsQuery = {
  status?: JOB_APPLICATION_STATUS
  jobId?: string
}

type TGetAllApplicationsWhereClause = {
  status?: JOB_APPLICATION_STATUS
  jobId?: number
}

type TUpdateStatusOfApplicationsParams = {
  applicationId?: string
}

type TUpdateStatusOfApplicationsBody = {
  status: Exclude<JOB_APPLICATION_STATUS, 'APPLIED'>
}

const getAllApplications = async (
  req: AuthRequest<unknown, unknown, unknown, TGetAllApplicationsQuery>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { jobId, status } = req.query

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const whereClause: TGetAllApplicationsWhereClause = {}

    if (jobId !== undefined) {
      whereClause.jobId = Number(jobId)
    }

    if (status !== undefined) {
      whereClause.status = status
    }

    const jobApplications = await prisma.jobApplications.findMany({
      where: {
        ...whereClause,
        Job: {
          userId
        }
      },
      include: {
        Job: true,
        User: true
      }
    })

    const response = okResponse(jobApplications)
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

const updateStatusOfApplications = async (
  req: AuthRequest<TUpdateStatusOfApplicationsParams, unknown, TUpdateStatusOfApplicationsBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const applicationId = Number(req.params.applicationId)
  const { status } = req.body

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const application = await prisma.jobApplications.findFirst({
      where: {
        id: applicationId,
        Job: {
          userId
        }
      },
      include: {
        Job: true
      }
    })

    if (application === null) {
      const response = notFoundResponse('application not found')
      return res.status(response.status.code).json(response)
    }

    if (status === 'REJECTED') {
      if (application.status !== 'APPLIED') {
        const response = badRequestResponse('cannot change status')
        return res.status(response.status.code).json(response)
      }

      await prisma.jobApplications.update({
        where: { id: application.id },
        data: { status }
      })
    }

    if (status === 'WAIT_LISTED') {
      if (application.status !== 'APPLIED') {
        const response = badRequestResponse('cannot change status')
        return res.status(response.status.code).json(response)
      }

      await prisma.jobApplications.update({
        where: { id: application.id },
        data: { status }
      })
    }

    if (status === 'HIRED') {
      if (application.status !== 'APPLIED' && application.status !== 'WAIT_LISTED') {
        const response = badRequestResponse('cannot change status')
        return res.status(response.status.code).json(response)
      }

      await prisma.jobApplications.update({
        where: { id: application.id },
        data: { status }
      })
    }

    if (status === 'COMPLETED') {
      if (application.status !== 'HIRED') {
        const response = badRequestResponse('cannot change status')
        return res.status(response.status.code).json(response)
      }

      await prisma.jobApplications.update({
        where: { id: application.id },
        data: { status }
      })

      await prisma.jobs.update({
        where: { id: application.jobId },
        data: {
          hasCompletedByAthlete: true,
          status: 'COMPLETED',
          hasPaid: true
        }
      })

      await prisma.transactions.updateMany({
        where: {
          transactionType: 'HOLD',
          source: {
            path: '$.recourseId',
            equals: String(application.jobId)
          }
        },
        data: { transactionType: 'PAYMENT' }
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

export default {
  getAllApplications,
  updateStatusOfApplications
}
