import {
  okResponse,
  serverErrorResponse,
  createSuccessResponse,
  notFoundResponse,
  badRequestResponse,
  unauthorizedResponse
} from 'generic-response'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TGetAllAthleteRatingsParams = {
  athleteId: string
}

type TGiveRatingParams = {
  athleteId: string
}

type TGiveRatingBody = {
  jobId: number
  rating: number
}

const getAllAthleteRatings = async (
  req: AuthRequest<TGetAllAthleteRatingsParams>,
  res: Response
): Promise<Response> => {
  const athleteId = Number(req.params.athleteId)

  try {
    const ratings = await prisma.userRating.findMany({
      where: { athleteId }
    })

    const response = okResponse(ratings)
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

const giveRating = async (
  req: AuthRequest<TGiveRatingParams, unknown, TGiveRatingBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const athleteId = Number(req.params.athleteId)
  const { jobId, rating } = req.body

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const existingJob = await prisma.jobs.findUnique({ where: { id: jobId } })

    if (existingJob === null) {
      const response = notFoundResponse(`job with id: ${jobId} not found.`)
      return res.status(response.status.code).json(response)
    }

    const existingRating = await prisma.userRating.findFirst({
      where: { jobId, athleteId, businessId: userId }
    })

    if (existingRating !== null) {
      const response = badRequestResponse('Already gave rating')
      return res.status(response.status.code).json(response)
    }

    const userRating = await prisma.userRating.create({
      data: { jobId, athleteId, businessId: userId, rating }
    })

    const response = createSuccessResponse(userRating)
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
  getAllAthleteRatings,
  giveRating
}
