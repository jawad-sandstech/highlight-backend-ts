import { badRequestResponse } from 'generic-response'
import type { Schema } from 'joi'

import type { Response, NextFunction } from 'express'
import type { AuthRequest } from '../interfaces/auth-request'

const validateRequest =
  (schema: Schema) => (req: AuthRequest, res: Response, next: NextFunction) => {
    const { body, params, query } = req

    try {
      const { error } = schema.validate({ body, params, query }, { abortEarly: true })

      if (error !== undefined) {
        const errorMessage = error.details[0].message
        const response = badRequestResponse(errorMessage)
        return res.status(response.status.code).json(response)
      }

      next()
    } catch (error) {
      console.error(error)
    }
  }

export default validateRequest
