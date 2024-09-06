import { serverErrorResponse, okResponse, notFoundResponse } from 'generic-response'
import moment from 'moment'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'
import config from '../../config/config'
import calculateAge from '../../utils/calculateAge'

type TGetAllAthletesQuery = {
  type?: 'New' | 'Popular' | 'Regional'
  sportIds?: string
  instagramFollowersGreaterThan?: string
  rating?: string
  distance?: string
  isUniversityAthlete?: 'true' | 'false'
  take?: string
}

type TGetSingleAthleteParams = {
  athleteId: number
}

const getAllAthletes = async (
  req: AuthRequest<unknown, unknown, unknown, TGetAllAthletesQuery>,
  res: Response
): Promise<Response> => {
  const { type, sportIds, instagramFollowersGreaterThan, isUniversityAthlete, rating } = req.query
  const take = req.query.take !== undefined ? Number(req.query.take) : undefined

  try {
    const whereClause: any = { role: 'ATHLETE', isProfileComplete: true }
    const includeClause: any = { ReceivedRatings: { select: { rating: true } } }
    let orderByClause: any = {}

    if (type === 'New') {
      const thirtyDaysAgo = moment().subtract(30, 'days').toDate()

      whereClause.createdAt = {
        gte: thirtyDaysAgo
      }
    }

    if (instagramFollowersGreaterThan !== undefined) {
      whereClause.instagramFollowersCount = {
        gte: Number(instagramFollowersGreaterThan)
      }
    }

    if (sportIds !== undefined || isUniversityAthlete !== undefined) {
      whereClause.AthleteInfo = {}

      if (sportIds !== undefined) {
        const sportIdList = sportIds.split(',').map(Number)

        whereClause.AthleteInfo.sportId = {
          in: sportIdList
        }
      }

      if (isUniversityAthlete !== undefined) {
        whereClause.AthleteInfo.schoolName = null
      }
    }

    if (type === 'Popular') {
      whereClause.JobApplications = {
        some: {
          status: 'COMPLETED'
        }
      }

      includeClause.JobApplications = {
        where: {
          status: 'COMPLETED'
        }
      }

      orderByClause = {
        JobApplications: {
          _count: 'desc'
        }
      }
    }

    let athletes = await prisma.users.findMany({
      where: whereClause,
      include: includeClause,
      orderBy: orderByClause,
      take
    })

    athletes.forEach((i) => (i.profilePicture &&= `${config.S3_ACCESS_URL}/${i.profilePicture}`))

    if (rating !== undefined) {
      const athletesWithAverageRating = athletes.map((athlete: any) => {
        const totalRating = athlete.ReceivedRatings.reduce(
          (sum: any, rating: any) => sum + rating.rating,
          0
        )
        const averageRating =
          athlete.ReceivedRatings.length > 0 ? totalRating / athlete.ReceivedRatings.length : null
        return {
          ...athlete,
          averageRating
        }
      })

      const ratingNumber = Number(rating)
      const lowerBound = ratingNumber
      const upperBound = ratingNumber + 1
      athletes = athletesWithAverageRating.filter(
        (athlete) => athlete.averageRating >= lowerBound && athlete.averageRating < upperBound
      )
    }

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
    const athlete = await prisma.users.findUnique({
      where: { id: athleteId, role: 'ATHLETE' },
      include: { AthleteInfo: true, UserGallery: true }
    })

    if (athlete === null) {
      const response = notFoundResponse(`athlete with id: ${athleteId} not found.`)
      return res.status(response.status.code).json(response)
    }

    const {
      _avg: { rating: averageRating }
    } = await prisma.userRating.aggregate({
      _avg: { rating: true },
      where: { athleteId }
    })

    if (athlete.profilePicture !== null) {
      athlete.profilePicture = `${config.S3_ACCESS_URL}/${athlete.profilePicture}`
    }

    if (athlete.UserGallery.length > 0) {
      athlete.UserGallery = athlete.UserGallery.map((galleryItem) => ({
        ...galleryItem,
        path: `${config.S3_ACCESS_URL}/${galleryItem.path}`
      }))
    }

    const athleteWithAverageRating = {
      ...athlete,
      age: calculateAge(athlete.dateOfBirth),
      averageReceivedRating: averageRating
    }

    const response = okResponse(athleteWithAverageRating)
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
