import { okResponse, serverErrorResponse, unauthorizedResponse } from 'generic-response'
import multiGroupBy from 'multi-groupby'

import prisma from '../../config/database.config'

import type { Jobs, JobApplications } from '@prisma/client'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type allPossibleGroups = 'Applied' | 'Open' | 'Closed'

type TJobApplications = JobApplications & {
  Job: Jobs
}

const getMyApplications = async (req: AuthRequest, res: Response): Promise<Response> => {
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const jobApplications = await prisma.jobApplications.findMany({
      where: { userId },
      include: { Job: true }
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
  getMyApplications
}
