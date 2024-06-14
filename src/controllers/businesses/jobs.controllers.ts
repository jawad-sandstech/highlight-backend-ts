import {
  notFoundResponse,
  okResponse,
  serverErrorResponse,
  unauthorizedResponse
} from 'generic-response'
import multiGroupBy from 'multi-groupby'

import prisma from '../../config/database.config'

import type { Jobs } from '@prisma/client'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

const getAllJobsOfBusiness = async (req: AuthRequest, res: Response): Promise<Response> => {
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const business = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (business === null) {
      const response = notFoundResponse('business not found')
      return res.status(response.status.code).json(response)
    }

    const jobs = await prisma.jobs.findMany({
      where: { userId },
      include: { JobRequiredQualifications: true }
    })

    type TAllPossibleGroups = 'All' | 'Draft' | 'Open' | 'Filled' | 'Closed'

    const classifyJobs = (job: Jobs): TAllPossibleGroups[] => {
      const groups: TAllPossibleGroups[] = []

      groups.push('All')
      if (job.status === 'OPEN' && !job.hasPaid) groups.push('Draft')
      if (job.status === 'OPEN' && job.hasPaid) groups.push('Open')
      if (job.status === 'FILLED') groups.push('Filled')
      if (job.status === 'COMPLETED') groups.push('Closed')

      return groups
    }

    const allPossibleGroups: TAllPossibleGroups[] = ['All', 'Draft', 'Open', 'Filled', 'Closed']
    const groupedJobs = multiGroupBy(jobs, allPossibleGroups, classifyJobs)

    const response = okResponse(groupedJobs)
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
  getAllJobsOfBusiness
}
