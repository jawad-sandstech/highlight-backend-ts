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
import sendNotification from '../../utils/sendNotification'
import config from '../../config/config'

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

    jobApplications.forEach((i) => {
      i.User.profilePicture &&= `${config.S3_ACCESS_URL}/${i.User.profilePicture}`
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
      if (application.status !== 'APPLIED' && application.status !== 'WAIT_LISTED') {
        const response = badRequestResponse('cannot change status')
        return res.status(response.status.code).json(response)
      }

      await prisma.jobApplications.update({
        where: { id: application.id },
        data: { status }
      })

      await sendNotification(
        application.userId,
        'Application update',
        `Application rejected on "${application.Job.title}"`,
        'APPLICATION_REJECTED',
        { userRole: 'ATHLETE', jobId: application.Job.id, applicationId: application.id }
      )
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

      await sendNotification(
        application.userId,
        'Application update',
        `Application wait-listed on "${application.Job.title}"`,
        'APPLICATION_WAIT_LISTED',
        { userRole: 'ATHLETE', jobId: application.Job.id, applicationId: application.id }
      )
    }

    if (status === 'HIRED') {
      if (application.status !== 'APPLIED' && application.status !== 'WAIT_LISTED') {
        const response = badRequestResponse('cannot change status')
        return res.status(response.status.code).json(response)
      }

      await prisma.jobs.update({
        where: { id: application.Job.id },
        data: { status: 'FILLED' }
      })

      await prisma.jobApplications.update({
        where: { id: application.id },
        data: { status }
      })

      await sendNotification(
        application.userId,
        'Application update',
        `Your Application got selected on "${application.Job.title}"`,
        'APPLICATION_SELECTED',
        { userRole: 'ATHLETE', jobId: application.Job.id, applicationId: application.id }
      )

      const chat = await prisma.chats.create({
        data: {
          type: 'PRIVATE',
          Participants: {
            createMany: {
              data: [{ userId }, { userId: application.userId }]
            }
          }
        }
      })

      await prisma.messages.create({
        data: {
          chatId: chat.id,
          senderId: userId,
          content: "Let's make this collaboration epic!",
          MessageStatus: {
            create: { userId: application.userId }
          }
        }
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

      console.log(application.jobId)

      await prisma.transactions.updateMany({
        where: {
          transactionType: 'HOLD',
          source: {
            path: '$.recourseId',
            equals: application.jobId
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
