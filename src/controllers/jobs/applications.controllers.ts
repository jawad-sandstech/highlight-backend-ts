import {
  serverErrorResponse,
  createSuccessResponse,
  notFoundResponse,
  unauthorizedResponse,
  badRequestResponse
} from 'generic-response'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TCreateApplicationBody = {
  jobId: number
}

const createApplication = async (
  req: AuthRequest<unknown, unknown, TCreateApplicationBody>,
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

    const existingApplication = await prisma.jobApplications.findFirst({
      where: { userId, jobId }
    })

    if (existingApplication !== null) {
      const response = badRequestResponse('already applied to this job')
      return res.status(response.status.code).json(response)
    }

    const application = await prisma.jobApplications.create({
      data: { userId, jobId }
    })

    const response = createSuccessResponse(application)
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
  createApplication
}
