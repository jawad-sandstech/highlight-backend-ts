import {
  okResponse,
  serverErrorResponse,
  unauthorizedResponse,
  updateSuccessResponse
} from 'generic-response'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TReceivePushNotificationsBody = {
  receivePushNotifications?: boolean
}

const getUserPreferences = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { user } = req

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const preference = await prisma.userPreference.findUnique({
      where: { userId }
    })

    const response = okResponse(preference)
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

const updateUserPreferences = async (
  req: AuthRequest<unknown, unknown, TReceivePushNotificationsBody>,
  res: Response
): Promise<Response> => {
  const { user } = req
  const data = req.body

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    await prisma.userPreference.update({
      where: { userId },
      data: { ...data }
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
  getUserPreferences,
  updateUserPreferences
}
