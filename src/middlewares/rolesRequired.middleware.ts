import { unauthorizedResponse } from 'generic-response'

import type { Response, NextFunction } from 'express'
import type { AuthRequest } from '../interfaces/auth-request'

const rolesRequired =
  (rolesArray: Array<'ATHLETE' | 'BUSINESS' | 'ADMIN'>) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const { user } = req

    if (user === undefined || !rolesArray.includes(user.role)) {
      const response = unauthorizedResponse('Access denied. Insufficient permissions.')
      return res.status(response.status.code).json(response)
    }

    next()
  }

export default rolesRequired
