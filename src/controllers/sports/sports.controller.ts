import { createSuccessResponse, okResponse, serverErrorResponse } from 'generic-response'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TCreateSportBody = {
  name: string
}

const getAllSports = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const sports = await prisma.sports.findMany()

    const response = okResponse(sports)
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

const createSport = async (
  req: AuthRequest<unknown, unknown, TCreateSportBody>,
  res: Response
): Promise<Response> => {
  const data = req.body

  try {
    await prisma.sports.create({
      data: { ...data }
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
  getAllSports,
  createSport
}
