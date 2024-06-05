import { okResponse, serverErrorResponse } from 'generic-response'

import prisma from '../../config/database.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

const getAllPackages = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const packages = await prisma.packages.findMany()

    const response = okResponse({ packages })
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
  getAllPackages
}
