import {
  okResponse,
  serverErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  updateSuccessResponse
} from 'generic-response'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TToggleSavedJobsBody = {
  jobId: number
}

const getMySavedJobs = async (req: AuthRequest, res: Response): Promise<Response> => {
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const savedJobs = await prisma.userSavedJobs.findMany({
      where: { userId },
      include: { Job: true }
    })

    const response = okResponse(savedJobs)
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

const toggleSavedJob = async (
  req: AuthRequest<unknown, unknown, TToggleSavedJobsBody>,
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

    const existingSavedJob = await prisma.userSavedJobs.findFirst({
      where: { userId, jobId }
    })

    if (existingSavedJob !== null) {
      await prisma.userSavedJobs.delete({
        where: { id: existingSavedJob.id }
      })

      const response = updateSuccessResponse({ status: false })
      return res.status(response.status.code).json(response)
    }

    await prisma.userSavedJobs.create({
      data: { userId, jobId }
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
  getMySavedJobs,
  toggleSavedJob
}
