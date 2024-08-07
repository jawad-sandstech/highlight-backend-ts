import {
  serverErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  updateSuccessResponse,
  okResponse
} from 'generic-response'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TToggleMarkAsFavoriteBody = {
  businessId: number
}

const getAllFavoriteBusinesses = async (req: AuthRequest, res: Response): Promise<Response> => {
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const favoriteBusinesses = await prisma.userFavoriteBusinesses.findMany({
      where: { userId },
      include: { Business: true }
    })

    const response = okResponse(favoriteBusinesses)
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

const toggleMarkAsFavorite = async (
  req: AuthRequest<unknown, unknown, TToggleMarkAsFavoriteBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { businessId } = req.body

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const existingBusiness = await prisma.users.findUnique({ where: { id: businessId } })

    if (existingBusiness === null) {
      const response = notFoundResponse(`business with id: ${businessId} not found.`)
      return res.status(response.status.code).json(response)
    }

    const existingFavoriteBusiness = await prisma.userFavoriteBusinesses.findFirst({
      where: { userId, businessId }
    })

    if (existingFavoriteBusiness !== null) {
      await prisma.userFavoriteBusinesses.delete({
        where: { id: existingFavoriteBusiness.id }
      })

      const response = updateSuccessResponse({ status: false })
      return res.status(response.status.code).json(response)
    }

    await prisma.userFavoriteBusinesses.create({
      data: { userId, businessId }
    })

    const response = updateSuccessResponse({ status: true })
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
  getAllFavoriteBusinesses,
  toggleMarkAsFavorite
}
