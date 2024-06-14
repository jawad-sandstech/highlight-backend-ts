import { okResponse, serverErrorResponse, unauthorizedResponse } from 'generic-response'
import multiGroupBy from 'multi-groupby'

import prisma from '../../config/database.config'

import type { Users, JobApplications } from '@prisma/client'
import type { Response } from 'express'

import type { AuthRequest } from '../../interfaces/auth-request'

type allPossibleGroups = 'Applied' | 'Open' | 'Closed'

type TJobApplications = JobApplications & {
  User: Users
}

const getMyAppliedJobsList = async (req: AuthRequest, res: Response): Promise<Response> => {
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const user = await prisma.users.findUnique({ where: { id: userId } })

    if (user === null) {
      throw new Error(`user with id: ${userId} not found`)
    }

    const jobApplications = await prisma.jobApplications.findMany({
      where: { userId },
      include: { User: true }
    })

    const classifyApplications = (application: TJobApplications): allPossibleGroups[] => {
      const groups: allPossibleGroups[] = []

      if (application.status === 'APPLIED') groups.push('Applied')
      if (application.status === 'HIRED') groups.push('Open')
      if (application.status === 'COMPLETED') groups.push('Closed')

      return groups
    }

    const allPossibleGroups = ['Applied', 'Open', 'Closed']
    const groupedApplications = multiGroupBy(
      jobApplications,
      allPossibleGroups,
      classifyApplications
    )

    const response = okResponse(groupedApplications)
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
  getMyAppliedJobsList
}
