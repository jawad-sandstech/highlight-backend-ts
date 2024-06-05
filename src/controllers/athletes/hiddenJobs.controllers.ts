import {
  serverErrorResponse,
  createSuccessResponse,
  notFoundResponse,
  badRequestResponse,
  unauthorizedResponse
} from 'generic-response'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type THideJobBody = {
  jobId: number
}

const hideJob = async (
  req: AuthRequest<unknown, unknown, THideJobBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { jobId } = req.body

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

    const existingHiddenJob = await prisma.userHiddenJobs.findFirst({
      where: { userId, jobId }
    })

    if (existingHiddenJob !== null) {
      const response = badRequestResponse('Already marked as hidden')
      return res.status(response.status.code).json(response)
    }

    const hiddenJob = await prisma.userHiddenJobs.create({
      data: { userId, jobId }
    })

    const response = createSuccessResponse(hiddenJob)
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
  hideJob
}
