import prisma from '../config/database.config'
import stripe from '../config/stripe.config'

import type { Users } from '@prisma/client'

type TCreateUser = {
  role: 'ATHLETE' | 'BUSINESS'
} & (
  | {
      loginMethod: 'EMAIL'
      email: string
      password: string
    }
  | {
      loginMethod: 'GOOGLE' | 'FACEBOOK' | 'APPLE'
      tokenSecret: string
    }
)

const createStripeAccount = async (email: string): Promise<string> => {
  try {
    const account = await stripe.accounts.create({
      type: 'custom',
      email,
      country: 'US',
      capabilities: {
        transfers: { requested: true }
      }
    })

    return account.id
  } catch (error) {
    throw new Error('Failed to create Stripe account')
  }
}

const createStripeCustomer = async (email: string): Promise<string> => {
  try {
    const customer = await stripe.customers.create({ email })

    return customer.id
  } catch (error) {
    throw new Error('Failed to create Stripe customer')
  }
}

const createUser = async (data: TCreateUser): Promise<Users> => {
  try {
    if (data.loginMethod === 'EMAIL') {
      const { role, email, password, loginMethod } = data

      const stripeCustomerId = await createStripeCustomer(email)
      const stripeAccountId = role === 'ATHLETE' ? await createStripeAccount(email) : null

      const user = await prisma.users.create({
        data: {
          role,
          email,
          loginMethod,
          stripeCustomerId,
          stripeAccountId,
          UserPasswords: { create: { password } }
        }
      })

      await prisma.userPreference.create({
        data: { userId: user.id }
      })

      return user
      // else if (
      //   data.loginMethod === 'APPLE' ||
      //   data.loginMethod === 'FACEBOOK' ||
      //   data.loginMethod === 'GOOGLE'
      // ) {}
    } else {
      throw new Error('Invalid Login Method while creating user')
    }
  } catch (error) {
    throw new Error('Failed to create user')
  }
}

export default {
  createUser
}
