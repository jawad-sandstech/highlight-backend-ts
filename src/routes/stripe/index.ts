import express from 'express'

import stripeControllers from '../../controllers/stripe/stripe.controllers'

const router = express.Router()

router.get('/onboarding-success', stripeControllers.onboardingSuccess)

export default router
