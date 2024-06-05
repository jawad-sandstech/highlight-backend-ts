import {
  serverErrorResponse,
  createSuccessResponse,
  notFoundResponse,
  badRequestResponse,
  deleteSuccessResponse,
  unauthorizedResponse
} from 'generic-response'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TMarkAsFavoriteBody = {
  businessId: number
}

type TDeleteAsFavoriteParams = {
  businessId: number
}

const markAsFavorite = async (
  req: AuthRequest<unknown, unknown, TMarkAsFavoriteBody>,
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
      const response = badRequestResponse('Already marked as favorite.')
      return res.status(response.status.code).json(response)
    }

    const favoriteBusiness = await prisma.userFavoriteBusinesses.create({
      data: { userId, businessId }
    })

    const response = createSuccessResponse(favoriteBusiness)
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

const deleteAsFavorite = async (
  req: AuthRequest<TDeleteAsFavoriteParams>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { businessId } = req.params

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const existingFavoriteBusiness = await prisma.userFavoriteBusinesses.findFirst({
      where: { userId, businessId }
    })

    if (existingFavoriteBusiness === null) {
      const response = badRequestResponse('Nothing to delete.')
      return res.status(response.status.code).json(response)
    }

    const favoriteBusiness = await prisma.userFavoriteBusinesses.delete({
      where: { id: existingFavoriteBusiness.id }
    })

    const response = deleteSuccessResponse(favoriteBusiness)
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
  markAsFavorite,
  deleteAsFavorite
}
