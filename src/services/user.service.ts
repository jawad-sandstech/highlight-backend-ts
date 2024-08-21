import prisma from '../config/database.config'
import stripe from '../config/stripe.config'

import type { USER_ROLES, Users } from '@prisma/client'

type TCreateUser = {
  role: USER_ROLES
  loginMethod: 'EMAIL' | 'GOOGLE' | 'FACEBOOK' | 'APPLE'
  email: string
  password?: string
}

type UserData = {
  role: USER_ROLES
  email: string
  loginMethod: 'EMAIL' | 'GOOGLE' | 'FACEBOOK' | 'APPLE'
  stripeCustomerId: string
  stripeAccountId: string | null
  UserPasswords?: {
    create: {
      password: string
    }
  }
}

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
    const { role, email, password, loginMethod } = data

    const stripeCustomerId = await createStripeCustomer(email)
    const stripeAccountId = role === 'ATHLETE' ? await createStripeAccount(email) : null

    const userData: UserData = {
      role,
      email,
      loginMethod,
      stripeCustomerId,
      stripeAccountId
    }

    if (password !== undefined) {
      userData.UserPasswords = { create: { password } }
    }

    const user = await prisma.users.create({ data: userData })

    await prisma.userPreference.create({
      data: { userId: user.id }
    })

    if (role === 'ATHLETE') {
      await prisma.athleteInfo.create({
        data: { userId: user.id }
      })
    } else {
      await prisma.businessInfo.create({
        data: { userId: user.id }
      })
    }

    return user
  } catch (error) {
    throw new Error('Failed to create new user')
  }
}

export default {
  createUser
}
