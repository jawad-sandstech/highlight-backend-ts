import {
  okResponse,
  serverErrorResponse,
  notFoundResponse,
  unauthorizedResponse
} from 'generic-response'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TGetAllBusinessParams = {
  isPremium?: string
  favorite?: string
}

type TGetSingleBusinessParams = {
  businessId: number
}

const getAllBusinesses = async (
  req: AuthRequest<unknown, unknown, unknown, TGetAllBusinessParams>,
  res: Response
): Promise<Response> => {
  const { isPremium, favorite } = req.query
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const whereClause: any = { role: 'BUSINESS' }

    if (isPremium === 'true') {
      whereClause.BusinessInfo = { isPremium: true }
    }

    if (favorite === 'true') {
      whereClause.FavoriteBusinesses = {
        some: {
          userId
        }
      }
    }

    const businesses = await prisma.users.findMany({
      where: whereClause,
      include: { BusinessInfo: true, FavoriteBusinesses: { where: { userId } } }
    })

    const response = okResponse(businesses)
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

const getSingleBusiness = async (
  req: AuthRequest<TGetSingleBusinessParams>,
  res: Response
): Promise<Response> => {
  const businessId = Number(req.params.businessId)

  try {
    const business = await prisma.users.findUnique({
      where: { id: businessId, role: 'BUSINESS' },
      include: { BusinessInfo: true }
    })

    if (business === null) {
      const response = notFoundResponse(`business with id: ${businessId} not found.`)
      return res.status(response.status.code).json(response)
    }

    const response = okResponse(business)
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
  getAllBusinesses,
  getSingleBusiness
}
