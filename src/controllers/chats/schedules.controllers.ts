import {
  serverErrorResponse,
  okResponse,
  unauthorizedResponse,
  notFoundResponse,
  badRequestResponse,
  createSuccessResponse
} from 'generic-response'

import prisma from '../../config/database.config'

import type { Response } from 'express'
import type { AuthRequest } from '../../interfaces/auth-request'

type TGetAllSchedulesQuery = {
  jobId?: string
  dateRange?: string
}

type TCreateScheduleBody = {
  chatId: number
  agenda: string
  meetingDateTime: string
  zoomMeetingLink: string
}

type TGetAllSchedulesWhereClause = {
  jobId?: number
  meetingDateTime?: {
    gte: Date
    lt: Date
  }
}

const getAllSchedules = async (
  req: AuthRequest<unknown, unknown, unknown, TGetAllSchedulesQuery>,
  res: Response
): Promise<Response> => {
  const jobId = req.query.jobId
  const user = req.user
  const dateRange = req.query.dateRange

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

    if (dateRange !== undefined) {
      const [startDateStr, endDateStr] = dateRange.split('_')
      const startDate = new Date(startDateStr)
      const endDate = new Date(endDateStr)

      endDate.setDate(endDate.getDate() + 1)

      getAllSchedulesWhereClause.meetingDateTime = {
        gte: startDate,
        lt: endDate
      }
    }

    const schedules = await prisma.userSchedules.findMany({
      where: {
        OR: [{ organizerId: userId }, { attendeeId: userId }],
        ...getAllSchedulesWhereClause
      }
    })

    const now = new Date()

    const pastSchedules = schedules.filter((schedule) => new Date(schedule.meetingDateTime) < now)
    const upcomingSchedules = schedules.filter(
      (schedule) => new Date(schedule.meetingDateTime) >= now
    )

    const response = okResponse({
      pastSchedules,
      upcomingSchedules
    })
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
    const chat = await prisma.chats.findUnique({
      where: { id: data.chatId },
      include: { Participants: true }
    })

    if (chat === null) {
      const response = notFoundResponse('chat not found')
      return res.status(response.status.code).json(response)
    }

    if (chat?.type !== 'PRIVATE') {
      const response = badRequestResponse('works on only private chats')
      return res.status(response.status.code).json(response)
    }

    const otherParticipant = chat?.Participants.find((i) => i.userId !== userId)

    if (otherParticipant === undefined) {
      const response = badRequestResponse()
      return res.status(response.status.code).json(response)
    }

    await prisma.userSchedules.create({
      data: {
        organizerId: userId,
        attendeeId: otherParticipant.userId,
        ...data
      }
    })

    const response = createSuccessResponse()
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
