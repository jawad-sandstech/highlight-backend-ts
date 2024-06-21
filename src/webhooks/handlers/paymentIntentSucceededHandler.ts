import prisma from '../../config/database.config'

import type { Stripe } from 'stripe'

const handleDeposit = async (paymentIntent: Stripe.PaymentIntent): Promise<void> => {
  type TMetadata = {
    userId: string
    amount: string
  }

  const { userId, amount } = paymentIntent.metadata as TMetadata

  await prisma.userWallet.create({
    data: {
      userId: Number(userId),
      amount: Number(amount),
      transactionType: 'CREDIT'
    }
  })

  await prisma.userWallet.create({
    data: {
      userId: Number(userId),
      amount: Number(amount),
      transactionType: 'CREDIT'
    }
  })
}

const handleBoughtPackage = async (paymentIntent: Stripe.PaymentIntent): Promise<void> => {}

const paymentIntentSucceededHandler = async (
  paymentIntent: Stripe.PaymentIntent
): Promise<void> => {
  const { type } = paymentIntent.metadata as {
    type: 'DEPOSIT' | 'WITHDRAW' | 'BOUGHT_PACKAGE' | string
  }

  switch (type) {
    case 'DEPOSIT':
      await handleDeposit(paymentIntent)
      break
    case 'BOUGHT_PACKAGE':
      await handleBoughtPackage(paymentIntent)
      break
    default:
      console.error(`Unhandled paymentIntent metadata type: ${type}`)
  }
}

export default paymentIntentSucceededHandler
