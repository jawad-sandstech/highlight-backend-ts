import {
  okResponse,
  serverErrorResponse,
  createSuccessResponse,
  unauthorizedResponse
} from 'generic-response'

import prisma from '../../config/database.config'
import stripe from '../../config/stripe.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TGetSingleBankParams = {
  accountNumber: string
}

type TAddBankDetailBody = {
  accountNumber: string
  routingNumber: string
}

const getMyAllBanks = async (req: AuthRequest, res: Response): Promise<Response> => {
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

    if (user.stripeAccountId === null) {
      throw new Error('user does not have "stripeAccountId"')
    }

    const externalAccounts = await stripe.accounts.listExternalAccounts(user.stripeAccountId, {
      object: 'bank_account'
    })

    const response = okResponse(externalAccounts)
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

const getSingleBank = async (
  req: AuthRequest<TGetSingleBankParams>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { accountNumber } = req.params

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

    if (user.stripeAccountId === null) {
      throw new Error('user does not have "stripeAccountId"')
    }

    const externalAccount = await stripe.accounts.retrieveExternalAccount(
      user.stripeAccountId,
      accountNumber
    )

    const response = okResponse(externalAccount)
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

const addBankDetail = async (
  req: AuthRequest<unknown, unknown, TAddBankDetailBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { accountNumber, routingNumber } = req.body

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

    if (user.stripeAccountId === null) {
      throw new Error('user does not have "stripeAccountId"')
    }

    const externalAccount = await stripe.accounts.createExternalAccount(user.stripeAccountId, {
      external_account: {
        account_number: accountNumber,
        country: 'US',
        currency: 'usd',
        object: 'bank_account',
        ...(routingNumber !== null && { routing_number: routingNumber })
      }
    })

    const response = createSuccessResponse(externalAccount)
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
  getMyAllBanks,
  getSingleBank,
  addBankDetail
}
