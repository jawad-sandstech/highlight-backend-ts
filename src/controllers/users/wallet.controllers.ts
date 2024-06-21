import {
  serverErrorResponse,
  okResponse,
  badRequestResponse,
  unauthorizedResponse,
  notFoundResponse
} from 'generic-response'

import prisma from '../../config/database.config'
import stripe from '../../config/stripe.config'

import calculateWalletBalance from '../../utils/calculateWalletBalance'

import type { AuthRequest } from '../../interfaces/auth-request'
import type Stripe from 'stripe'
import type { Response } from 'express'

type TDepositBody = {
  amount: number
}

type TWithdrawBody = {
  bankAccountId: string
  withdrawAmount: number
}

const createTransfer = async (
  connectedAccountId: string,
  amount: number
): Promise<Stripe.Response<Stripe.Transfer>> => {
  try {
    const amountInCents = amount * 100

    const transfer = await stripe.transfers.create({
      amount: amountInCents,
      currency: 'usd',
      destination: connectedAccountId
    })

    return transfer
  } catch (error) {
    throw new Error('Error while creating transfer')
  }
}

const createPayout = async (
  connectedAccountId: string,
  bankAccountId: string,
  amount: number
): Promise<Stripe.Response<Stripe.Payout>> => {
  try {
    const amountInCents = amount * 100

    const payout = await stripe.payouts.create(
      {
        amount: amountInCents,
        destination: bankAccountId,
        currency: 'usd'
      },
      {
        stripeAccount: connectedAccountId
      }
    )

    return payout
  } catch (error) {
    throw new Error('Error while creating payout')
  }
}

const createPaymentIntent = async (
  amount: number,
  metadata: Stripe.MetadataParam
): Promise<{
  id: string
  clientSecret: string | null
}> => {
  try {
    const amountInCents = amount * 100

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata
    })

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret
    }
  } catch (error) {
    throw new Error('Error while creating payment intent')
  }
}

const getMyTransactions = async (req: AuthRequest, res: Response): Promise<Response> => {
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (user === null) {
      const response = notFoundResponse('user not found')
      return res.status(response.status.code).json(response)
    }

    const { walletBalance, transactions } = await calculateWalletBalance(userId)

    const response = okResponse({ walletBalance, transactions })
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

const deposit = async (
  req: AuthRequest<unknown, unknown, TDepositBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { amount } = req.body

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const paymentIntent = await createPaymentIntent(amount, {
      type: 'DEPOSIT',
      userId,
      amount
    })

    const response = okResponse(paymentIntent)
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

const withdraw = async (
  req: AuthRequest<unknown, unknown, TWithdrawBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { bankAccountId, withdrawAmount } = req.body

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (user === null) {
      const response = notFoundResponse('user not found')
      return res.status(response.status.code).json(response)
    }

    if (user.stripeAccountId === null) {
      const response = badRequestResponse('"stripeAccountId" not found')
      return res.status(response.status.code).json(response)
    }

    if (!user.isStripeVerified) {
      const response = badRequestResponse('First verify your stripe account')
      return res.status(response.status.code).json(response)
    }

    const { walletBalance } = await calculateWalletBalance(userId)

    if (walletBalance < withdrawAmount) {
      const response = badRequestResponse('Not enough funds')
      return res.status(response.status.code).json(response)
    }

    await createTransfer(user.stripeAccountId, withdrawAmount)
    await createPayout(user.stripeAccountId, bankAccountId, withdrawAmount)

    await prisma.transactions.create({
      data: {
        userId,
        amount: withdrawAmount,
        transactionType: 'WITHDRAWAL'
      }
    })

    const response = okResponse('Transferred')
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
  getMyTransactions,
  deposit,
  withdraw
}
