import {
  okResponse,
  serverErrorResponse,
  notFoundResponse,
  unauthorizedResponse
} from 'generic-response'
import multiGroupBy from 'multi-groupby'

import prisma from '../../config/database.config'

import type { Users, BusinessInfo } from '@prisma/client'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TUserWithBusinessInfo = Users & {
  BusinessInfo: BusinessInfo | null
}

type TAllPossibleGroups = 'All' | 'Premium Businesses' | 'Favorite Businesses'

type TGetSingleBusinessParams = {
  businessId: number
}

const getAllBusinesses = async (req: AuthRequest, res: Response): Promise<Response> => {
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const businesses = await prisma.users.findMany({
      where: { role: 'BUSINESS' },
      include: { BusinessInfo: true }
    })

    const userFavoriteBusinesses = await prisma.userFavoriteBusinesses.findMany({
      where: { userId }
    })

    const userFavoriteBusinessIds = userFavoriteBusinesses.map((i) => i.businessId)

    const classifyBusinesses = (business: TUserWithBusinessInfo): TAllPossibleGroups[] => {
      const groups: TAllPossibleGroups[] = []

      groups.push('All')

      if (business.BusinessInfo !== null && business.BusinessInfo.isPremium) {
        groups.push('Premium Businesses')
      }

      if (userFavoriteBusinessIds.includes(business.id)) {
        groups.push('Favorite Businesses')
      }

      return groups
    }

    const allPossibleGroups: TAllPossibleGroups[] = [
      'All',
      'Premium Businesses',
      'Favorite Businesses'
    ]
    const groupedBusinesses = multiGroupBy(businesses, allPossibleGroups, classifyBusinesses)

    const response = okResponse(groupedBusinesses)
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
