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

type TReportJobBody = {
  jobId: number
  reason: string
}

const getAllReports = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const reportedJobs = await prisma.reportedJobs.findMany()

    const response = createSuccessResponse(reportedJobs)
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

const reportJob = async (
  req: AuthRequest<unknown, unknown, TReportJobBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { jobId, reason } = req.body

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

    const existingReportFromThisUser = await prisma.reportedJobs.findFirst({
      where: {
        userId,
        jobId
      }
    })

    if (existingReportFromThisUser !== null) {
      const response = badRequestResponse('Already reported this job.')
      return res.status(response.status.code).json(response)
    }

    const reportedJob = await prisma.reportedJobs.create({
      data: { userId, jobId, reason }
    })

    const response = createSuccessResponse(reportedJob)
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
  getAllReports,
  reportJob
}
