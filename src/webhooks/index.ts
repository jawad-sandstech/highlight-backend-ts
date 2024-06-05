import config from '../config/config'
import stripe from '../config/stripe.config'

import paymentIntentSucceededHandler from './handlers/paymentIntentSucceededHandler'

import type { Request, Response } from 'express'

const stripeWebhookHandler = async (req: Request, res: Response): Promise<Response> => {
  const sig = req.headers['stripe-signature']

  if (typeof sig !== 'string') {
    return res.status(400).send('Webhook Error: Missing stripe-signature header')
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, config.STRIPE_WEBHOOK_SECRET)
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }
    return res.status(400).send('Webhook Error: Unknown error')
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      paymentIntentSucceededHandler(event.data.object)
      break
    default:
      console.warn(`Unexpected webhook event type: ${event.type}`)
  }

  return res.status(200).end()
}

export default stripeWebhookHandler
