import {
  serverErrorResponse,
  unauthorizedResponse,
  okResponse,
  notFoundResponse,
  badRequestResponse,
  updateSuccessResponse
} from 'generic-response'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'
import config from '../../config/config'

type TCompleteOngoingJobParams = {
  jobId: string
}

const getAllOngoingJobs = async (req: AuthRequest, res: Response): Promise<Response> => {
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const ongoingJobs = await prisma.jobApplications.findMany({
      where: { userId, status: 'HIRED' },
      include: { Job: true }
    })

    ongoingJobs.forEach((i) => {
      i.Job.bannerImage = `${config.S3_ACCESS_URL}/${i.Job.bannerImage}`
    })

    const response = okResponse(ongoingJobs)
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

const completeOngoingJob = async (
  req: AuthRequest<TCompleteOngoingJobParams>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const jobId = Number(req.params.jobId)

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const job = await prisma.jobs.findUnique({
      where: { id: jobId },
      include: { JobApplications: true }
    })

    if (job === null) {
      const response = notFoundResponse('not found')
      return res.status(response.status.code).json(response)
    }

    const application = job?.JobApplications[0]

    if (application.userId !== userId) {
      const response = unauthorizedResponse('not found')
      return res.status(response.status.code).json(response)
    }

    if (application.status !== 'HIRED') {
      const response = badRequestResponse('cannot mark as complete')
      return res.status(response.status.code).json(response)
    }

    await prisma.jobs.update({
      where: { id: jobId },
      data: { hasCompletedByAthlete: true }
    })

    const response = updateSuccessResponse()
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
  getAllOngoingJobs,
  completeOngoingJob
}
