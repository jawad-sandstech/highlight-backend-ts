import Joi from 'joi'

const register = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    role: Joi.string().valid('ATHLETE', 'BUSINESS').required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
})

const login = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    role: Joi.string().valid('ATHLETE', 'BUSINESS').required(),
    loginMethod: Joi.string().valid('EMAIL', 'GOOGLE', 'FACEBOOK', 'APPLE').required(),
    email: Joi.string().email().when('loginMethod', {
      is: 'EMAIL',
      then: Joi.required(),
      otherwise: Joi.forbidden()
    }),
    password: Joi.string().min(8).when('loginMethod', {
      is: 'EMAIL',
      then: Joi.required(),
      otherwise: Joi.forbidden()
    }),
    tokenSecret: Joi.string().when('loginMethod', {
      is: Joi.valid('GOOGLE', 'FACEBOOK', 'APPLE'),
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
  })
})

const forgotPassword = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    email: Joi.string().email().required()
  })
})

const resetPassword = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    otp: Joi.string().required(),
    email: Joi.string().email().required(),
    newPassword: Joi.string().required()
  })
})

const verifyOtp = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required()
  })
})

const resendOtp = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    email: Joi.string().email().required()
  })
})

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyOtp,
  resendOtp
}
