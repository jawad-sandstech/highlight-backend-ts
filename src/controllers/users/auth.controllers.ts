import {
  badRequestResponse,
  serverErrorResponse,
  okResponse,
  unauthorizedResponse,
  notFoundResponse,
  updateSuccessResponse
} from 'generic-response'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import axios from 'axios'

import config from '../../config/config'
import prisma from '../../config/database.config'

import userService from '../../services/user.service'

import type { USER_ROLES } from '@prisma/client'
import type { Response } from 'express'
import type { AuthRequest } from '../../interfaces/auth-request'

type TRegisterBody = {
  role: USER_ROLES
  email: string
  password: string
}

type TLoginBody = {
  role: USER_ROLES
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

type TForgotPasswordBody = {
  email: string
}

type TResetPasswordBody = {
  otp: string
  email: string
  newPassword: string
}

type TChangePasswordBody = {
  oldPassword: string
  newPassword: string
}

type TVerifyOtpBody = {
  email: string
  otp: string
}

type TResendOtpBody = {
  email: string
}

const verifyGoogleToken = async (token: string): Promise<{ email: string }> => {
  const client = new OAuth2Client(config.GOOGLE_CLIENT_ID)

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()

    if (payload === undefined) {
      throw new Error('No payload found in the Google token.')
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { email: payload.email! }
  } catch (error) {
    throw new Error('Error verifying Google token')
  }
}

const verifyFacebookToken = async (token: string): Promise<{ email: string }> => {
  try {
    const response = await axios.get(`https://graph.facebook.com/me?access_token=${token}`)

    const { email } = response.data
    return { email }
  } catch (error) {
    throw new Error('Error verifying Facebook token')
  }
}

const verifyAppleToken = async (token: string): Promise<{ email: string }> => {
  try {
    type TDecodedToken = {
      header: any
      payload: any
    }

    const decodedToken = jwt.decode(token, { complete: true })
    const { header, payload } = decodedToken as TDecodedToken

    if (
      header.alg !== 'RS256' ||
      payload.iss !== 'https://appleid.apple.com' ||
      payload.aud !== 'com.your.app.bundleId' ||
      Date.now() >= payload.exp * 1000
    ) {
      throw new Error('Invalid Apple token')
    }
    return { email: payload.email }
  } catch (error) {
    throw new Error('Error verifying Google token')
  }
}

const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  return otp
}

const createOTP = async (userId: number): Promise<string> => {
  try {
    const otp = generateOTP()
    const expirationDateTime = moment().add(5, 'minutes').toISOString()

    await prisma.userOTP.updateMany({
      where: { userId },
      data: { isExpired: true }
    })

    await prisma.userOTP.create({
      data: {
        userId,
        otp,
        expirationDateTime
      }
    })

    return otp
  } catch (error) {
    throw new Error('Failed to create OTP')
  }
}

const expireOTP = async (id: number): Promise<void> => {
  await prisma.userOTP.update({
    where: { id },
    data: { isExpired: true }
  })
}

const register = async (
  req: AuthRequest<unknown, unknown, TRegisterBody>,
  res: Response
): Promise<Response> => {
  const { role, email, password } = req.body

  try {
    let user = await prisma.users.findUnique({
      where: { email }
    })

    if (user !== null && user.isEmailVerified) {
      const response = badRequestResponse('Email already in use.')
      return res.status(response.status.code).json(response)
    }

    if (user === null) {
      user = await userService.createUser({
        role,
        loginMethod: 'EMAIL',
        email,
        password
      })
    }

    const otp = await createOTP(user.id)
    // await sendOtpEmail(email, otp)

    const response = okResponse({ otp }, 'OTP sent successfully.')
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

const login = async (
  req: AuthRequest<unknown, unknown, TLoginBody>,
  res: Response
): Promise<Response> => {
  const loginData = req.body

  try {
    if (loginData.loginMethod === 'EMAIL') {
      const { role, email, password } = loginData

      const user = await prisma.users.findFirst({
        where: { role, email },
        include: {
          UserPasswords: {
            where: { isActive: true }
          }
        }
      })

      if (user === null) {
        const response = unauthorizedResponse('incorrect email or password')
        return res.status(response.status.code).json(response)
      }

      if (!user.isEmailVerified) {
        const response = unauthorizedResponse('incorrect email or password')
        return res.status(response.status.code).json(response)
      }

      if (user?.UserPasswords[0].password !== password) {
        const response = unauthorizedResponse('incorrect email or password')
        return res.status(response.status.code).json(response)
      }

      const payload = {
        userId: user.id,
        role: user.role
      }

      const token = jwt.sign(payload, config.JWT_SECRET)

      const response = okResponse({ token, user: payload }, 'Login Success.')
      return res.status(response.status.code).json(response)
    } else if (loginData.loginMethod === 'GOOGLE') {
      const { role, tokenSecret } = loginData

      const tokenData = await verifyGoogleToken(tokenSecret)

      const { email } = tokenData

      let user = await prisma.users.findFirst({
        where: { email }
      })

      if (user?.role !== role) {
        const response = badRequestResponse('User already have an account.')
        return res.status(response.status.code).json(response)
      }

      if (user !== null) {
        const payload = {
          userId: user.id,
          role: user.role
        }

        const token = jwt.sign(payload, config.JWT_SECRET)

        const response = okResponse({ token, user: payload }, 'Login Success.')
        return res.status(response.status.code).json(response)
      }

      user = await userService.createUser({
        loginMethod: 'GOOGLE',
        role,
        email
      })

      const payload = {
        userId: user.id,
        role: user.role
      }

      const token = jwt.sign(payload, config.JWT_SECRET)

      const response = okResponse({ token, user: payload }, 'Login Success.')
      return res.status(response.status.code).json(response)
    } else if (loginData.loginMethod === 'FACEBOOK') {
      const { role, tokenSecret } = loginData

      const tokenData = await verifyFacebookToken(tokenSecret)

      const { email } = tokenData

      let user = await prisma.users.findFirst({
        where: { email }
      })

      if (user?.role !== role) {
        const response = badRequestResponse('User already have an account.')
        return res.status(response.status.code).json(response)
      }

      if (user !== null) {
        const payload = {
          userId: user.id,
          role: user.role
        }

        const token = jwt.sign(payload, config.JWT_SECRET)

        const response = okResponse({ token, user: payload }, 'Login Success.')
        return res.status(response.status.code).json(response)
      }

      user = await userService.createUser({
        loginMethod: 'FACEBOOK',
        role,
        email
      })

      const payload = {
        userId: user.id,
        role: user.role
      }

      const token = jwt.sign(payload, config.JWT_SECRET)

      const response = okResponse({ token, user: payload }, 'Login Success.')
      return res.status(response.status.code).json(response)
    } else if (loginData.loginMethod === 'APPLE') {
      const { role, tokenSecret } = loginData

      const tokenData = await verifyAppleToken(tokenSecret)

      const { email } = tokenData

      let user = await prisma.users.findFirst({
        where: { email }
      })

      if (user?.role !== role) {
        const response = badRequestResponse('User already have an account.')
        return res.status(response.status.code).json(response)
      }

      if (user !== null) {
        const payload = {
          userId: user.id,
          role: user.role
        }

        const token = jwt.sign(payload, config.JWT_SECRET)

        const response = okResponse({ token, user: payload }, 'Login Success.')
        return res.status(response.status.code).json(response)
      }

      user = await userService.createUser({
        loginMethod: 'GOOGLE',
        role,
        email
      })

      const payload = {
        userId: user.id,
        role: user.role
      }

      const token = jwt.sign(payload, config.JWT_SECRET)

      const response = okResponse({ token, user: payload }, 'Login Success.')
      return res.status(response.status.code).json(response)
    } else {
      const response = badRequestResponse('Unsupported login method.')
      return res.status(response.status.code).json(response)
    }
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

const forgotPassword = async (
  req: AuthRequest<unknown, unknown, TForgotPasswordBody>,
  res: Response
): Promise<Response> => {
  const { email } = req.body

  try {
    const user = await prisma.users.findUnique({ where: { email } })

    if (user === null) {
      const response = notFoundResponse('User not found.')
      return res.status(response.status.code).json(response)
    }

    const otp = await createOTP(user.id)
    // send token over email

    const response = okResponse({ otp }, 'Reset token sent on email.')
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

const resetPassword = async (
  req: AuthRequest<unknown, unknown, TResetPasswordBody>,
  res: Response
): Promise<Response> => {
  const { newPassword } = req.body
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        UserPasswords: {
          where: {
            isActive: true
          }
        }
      }
    })

    if (user === null) {
      const response = notFoundResponse('User not found.')
      return res.status(response.status.code).json(response)
    }

    await prisma.userPasswords.update({
      data: { isActive: false },
      where: { id: user.UserPasswords[0].id }
    })

    await prisma.userPasswords.create({
      data: {
        userId: user.id,
        password: newPassword
      }
    })

    const response = updateSuccessResponse(null, 'Password reset successfully.')
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

const changePassword = async (
  req: AuthRequest<unknown, unknown, TChangePasswordBody>,
  res: Response
): Promise<Response> => {
  const { oldPassword, newPassword } = req.body
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: { UserPasswords: { where: { isActive: true } } }
    })

    if (user === null) {
      const response = notFoundResponse('User not found')
      return res.status(response.status.code).json(response)
    }

    if (oldPassword !== user.UserPasswords[0].password) {
      const response = unauthorizedResponse('incorrect old password')
      return res.status(response.status.code).json(response)
    }

    await prisma.userPasswords.updateMany({ where: { userId }, data: { isActive: false } })

    await prisma.userPasswords.create({ data: { userId, password: newPassword } })

    const response = updateSuccessResponse(null, 'password change successfully')
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

const verifyOtp = async (
  req: AuthRequest<unknown, unknown, TVerifyOtpBody>,
  res: Response
): Promise<Response> => {
  const { email, otp } = req.body

  try {
    const user = await prisma.users.findUnique({
      where: { email }
    })

    if (user === null) {
      const response = notFoundResponse('User not found.')
      return res.status(response.status.code).json(response)
    }

    const userOTP = await prisma.userOTP.findFirst({
      where: {
        userId: user.id,
        otp,
        isExpired: false
      }
    })

    if (userOTP === null) {
      const response = unauthorizedResponse('Invalid OTP or OTP expired')
      return res.status(response.status.code).json(response)
    }

    await prisma.users.update({
      where: { id: user.id },
      data: { isEmailVerified: true }
    })

    await expireOTP(userOTP.id)

    const payload = {
      userId: user.id,
      role: user.role
    }

    const token = jwt.sign(payload, config.JWT_SECRET)

    const response = okResponse({ token, user: payload }, 'OTP verified.')
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

const resendOtp = async (
  req: AuthRequest<unknown, unknown, TResendOtpBody>,
  res: Response
): Promise<Response> => {
  const { email } = req.body

  try {
    const user = await prisma.users.findUnique({ where: { email } })

    if (user === null) {
      const response = notFoundResponse('User not found')
      return res.status(response.status.code).json(response)
    }

    const otp = await createOTP(user.id)
    // await sendOtpEmail(email, otp);

    const response = okResponse({ otp }, 'OTP resent successfully')
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
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyOtp,
  resendOtp
}
