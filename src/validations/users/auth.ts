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
    role: Joi.string().valid('ATHLETE', 'BUSINESS', 'ADMIN').required(),
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
    newPassword: Joi.string().required()
  })
})

const changePassword = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    oldPassword: Joi.string().required(),
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

const logout = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyOtp,
  resendOtp,
  logout
}
