import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import rateValidations from '../../validations/athletes/rate'
import rateControllers from '../../controllers/athletes/rate.controllers'

const router = express.Router({ mergeParams: true })

router.get(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE', 'BUSINESS']),
  validateRequest(rateValidations.getAllAthleteRatings),
  rateControllers.getAllAthleteRatings
)
router.post(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(rateValidations.giveRating),
  rateControllers.giveRating
)

export default router
