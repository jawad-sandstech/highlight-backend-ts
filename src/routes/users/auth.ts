import express from 'express'

import validateRequest from '../../middlewares/validateRequest.middleware'

import authValidations from '../../validations/users/auth'
import authControllers from '../../controllers/users/auth.controllers'

const router = express.Router()

router.post('/register', validateRequest(authValidations.register), authControllers.register)
router.post('/login', validateRequest(authValidations.login), authControllers.login)
router.post(
  '/forgot-password',
  validateRequest(authValidations.forgotPassword),
  authControllers.forgotPassword
)
router.post(
  '/reset-password',
  validateRequest(authValidations.resetPassword),
  authControllers.resetPassword
)
router.post('/verify-otp', validateRequest(authValidations.verifyOtp), authControllers.verifyOtp)
router.post('/resend-otp', validateRequest(authValidations.resendOtp), authControllers.resendOtp)

export default router
