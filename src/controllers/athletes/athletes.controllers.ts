import { serverErrorResponse, okResponse, notFoundResponse } from 'generic-response'
import moment from 'moment'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TGetAllAthletesQuery = {
  type?: 'new' | 'popular' | 'regional'
  sportIds?: string[]
  instagramFollowersGreaterThan?: string
  isUniversityAthlete?: 'true' | 'false'
}

type TGetSingleAthleteParams = {
  athleteId: number
}

const getAllAthletes = async (
  req: AuthRequest<unknown, unknown, unknown, TGetAllAthletesQuery>,
  res: Response
): Promise<Response> => {
  const { type, sportIds, instagramFollowersGreaterThan, isUniversityAthlete } = req.query

  try {
    const whereClause: any = { role: 'ATHLETE' }

    if (type === 'new') {
      const thirtyDaysAgo = moment().subtract(30, 'days').toDate()

      whereClause.createdAt = {
        gte: thirtyDaysAgo
      }
    }

    if (type === 'popular') {
      // ...
    }

    if (instagramFollowersGreaterThan !== undefined) {
      whereClause.instagramFollowers = {
        gte: Number(instagramFollowersGreaterThan)
      }
    }

    if (sportIds !== undefined || isUniversityAthlete !== undefined) {
      whereClause.AthleteInfo = {}

      // if (sportIds !== undefined) {
      //   const sportIdList = sportIds.split(',').map((i) => Number(i))

      //   whereClause.AthleteInfo.sportId = {
      //     in: sportIdList
      //   }
      // }

      if (isUniversityAthlete !== undefined) {
        whereClause.AthleteInfo.schoolName = null
      }
    }

    const athletes = await prisma.users.findMany({
      where: whereClause
    })

    const response = okResponse(athletes)
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

const getSingleAthlete = async (
  req: AuthRequest<TGetSingleAthleteParams>,
  res: Response
): Promise<Response> => {
  const athleteId = Number(req.params.athleteId)

  try {
    const athlete = await prisma.users.findFirst({
      where: { id: athleteId, role: 'ATHLETE' }
    })

    if (athlete === null) {
      const response = notFoundResponse(`athlete with id: ${athleteId} not found.`)
      return res.status(response.status.code).json(response)
    }

    const response = okResponse(athlete)
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
  getAllAthletes,
  getSingleAthlete
}
