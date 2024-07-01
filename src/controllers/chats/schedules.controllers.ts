import {
  serverErrorResponse,
  okResponse,
  unauthorizedResponse,
  notFoundResponse
} from 'generic-response'

import prisma from '../../config/database.config'

import type { Response } from 'express'
import type { AuthRequest } from '../../interfaces/auth-request'
import type { Participants } from '@prisma/client'

type TGetAllSchedulesQuery = {
  jobId?: string
}

type TCreateScheduleBody = {
  jobId: number
  meetingDateTime: string
  zoomMeetingLink: string
}

type TGetAllSchedulesWhereClause = {
  jobId?: number
}

const isUserParticipant = (participants: Participants[], userId: number): boolean => {
  return participants.some((participant: any) => participant.userId === userId)
}

const getAllSchedules = async (
  req: AuthRequest<unknown, unknown, unknown, TGetAllSchedulesQuery>,
  res: Response
): Promise<Response> => {
  const jobId = req.query.jobId
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const getAllSchedulesWhereClause: TGetAllSchedulesWhereClause = {}

    if (jobId !== undefined) {
      getAllSchedulesWhereClause.jobId = Number(jobId)
    }

    const schedules = await prisma.userSchedules.findMany({
      where: {
        OR: [{ organizerId: userId }, { attendeeId: userId }],
        ...getAllSchedulesWhereClause
      },
      include: {
        Job: true
      }
    })

    const response = okResponse(schedules)
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

const createSchedule = async (
  req: AuthRequest<unknown, unknown, TCreateScheduleBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const data = req.body

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const chat = await prisma.userSchedules.findUnique({
      where: { id: data. },
      include: {
        Participants: {
          include: {
            User: true
          }
        }
      }
    })

    if (chat === null) {
      const response = notFoundResponse()
      return res.status(response.status.code).json(response)
    }

    if (!isUserParticipant(chat?.Participants, userId)) {
      const response = unauthorizedResponse()
      return res.status(response.status.code).json(response)
    }

    const response = okResponse(chat)
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
  getAllSchedules,
  createSchedule
}
