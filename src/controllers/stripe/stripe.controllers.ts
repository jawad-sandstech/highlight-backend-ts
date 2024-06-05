import { okResponse, serverErrorResponse } from 'generic-response'

import prisma from '../../config/database.config'
import stripe from '../../config/stripe.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TOnboardingSuccessQuery = {
  accountId: string
}

const onboardingSuccess = async (
  req: AuthRequest<unknown, unknown, unknown, TOnboardingSuccessQuery>,
  res: Response
): Promise<Response> => {
  const { accountId } = req.query

  try {
    const account = await stripe.accounts.retrieve(accountId)

    if (account.details_submitted) {
      await prisma.users.updateMany({
        where: { stripeAccountId: accountId },
        data: { isStripeVerified: true }
      })
    }

    const response = okResponse()
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
  onboardingSuccess
}
