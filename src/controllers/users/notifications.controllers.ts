import { okResponse, serverErrorResponse, unauthorizedResponse } from 'generic-response'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

const getAllNotifications = async (req: AuthRequest, res: Response): Promise<Response> => {
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const notifications = await prisma.userNotifications.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    await prisma.userNotifications.updateMany({
      where: { userId },
      data: { hasSeen: true }
    })

    const response = okResponse(notifications)
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

const getUnreadNotificationsCount = async (req: AuthRequest, res: Response): Promise<Response> => {
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const unreadNotificationsCount = await prisma.userNotifications.count({
      where: { userId, hasSeen: false }
    })

    const response = okResponse({ unreadNotificationsCount })
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
  getAllNotifications,
  getUnreadNotificationsCount
}
