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

import config from '../../config/config'
import prisma from '../../config/database.config'

import userService from '../../services/user.service'

import type { Response } from 'express'
import type { AuthRequest } from '../../interfaces/auth-request'

type TRegisterBody = {
  role: 'ATHLETE' | 'BUSINESS'
  email: string
  password: string
}

type TLoginBody = {
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

type TForgotPasswordBody = {
  email: string
}

type TResetPasswordBody = {
  otp: string
  email: string
  newPassword: string
}

type TVerifyOtpBody = {
  email: string
  otp: string
}

type TResendOtpBody = {
  email: string
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

      console.log({ role, email, password })

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
    } else if (
      loginData.loginMethod === 'APPLE' ||
      loginData.loginMethod === 'FACEBOOK' ||
      loginData.loginMethod === 'GOOGLE'
    ) {
      const response = okResponse(null, 'Login Success with OAth.')
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
  const { otp, email, newPassword } = req.body

  try {
    const user = await prisma.users.findUnique({
      where: { email },
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

    const existingOTP = await prisma.userOTP.findFirst({
      where: {
        userId: user.id,
        otp,
        isExpired: false
      }
    })

    if (existingOTP === null) {
      const response = unauthorizedResponse('Invalid OTP or OTP expired')
      return res.status(response.status.code).json(response)
    }

    await expireOTP(existingOTP.id)

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

    const response = okResponse(null, 'OTP verified.')
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
  verifyOtp,
  resendOtp
}
