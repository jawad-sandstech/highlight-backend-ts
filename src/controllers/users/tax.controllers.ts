import {
  badRequestResponse,
  okResponse,
  serverErrorResponse,
  unauthorizedResponse,
  updateSuccessResponse
} from 'generic-response'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TUpdateTaxVerificationBody = {
  firstName: string
  lastName: string
  dateOfBirth: Date
  address: string
  SSN: string
}

const getTaxVerification = async (req: AuthRequest, res: Response): Promise<Response> => {
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const userTaxVerification = await prisma.userTax.findUnique({
      where: { userId }
    })

    const response = okResponse({ userTaxVerification })
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

const updateTaxVerification = async (
  req: AuthRequest<unknown, unknown, TUpdateTaxVerificationBody>,
  res: Response
): Promise<Response> => {
  const data = req.body
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const userTaxVerification = await prisma.userTax.findUnique({
      where: { userId }
    })

    if (userTaxVerification !== null) {
      const response = badRequestResponse('cannot update again')
      return res.status(response.status.code).json(response)
    }

    await prisma.userTax.create({
      data: { ...data, userId }
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

const getTaxDocuments = async (req: AuthRequest, res: Response): Promise<Response> => {
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const completedJobs = await prisma.jobApplications.findMany({
      where: { userId, status: 'COMPLETED' },
      select: { jobId: true }
    })

    const jobIds = completedJobs.map((jobApplication) => jobApplication.jobId)

    const jobs = await prisma.jobs.findMany({
      where: {
        id: {
          in: jobIds
        }
      }
    })

    const response = okResponse(jobs)
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
  getTaxVerification,
  updateTaxVerification,
  getTaxDocuments
}
