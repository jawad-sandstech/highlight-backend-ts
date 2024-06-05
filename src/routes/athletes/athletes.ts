import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import athletesValidations from '../../validations/athletes/athletes'
import athletesControllers from '../../controllers/athletes/athletes.controllers'

const router = express.Router({ mergeParams: true })

router.get(
  '/',
  authRequired(),
  rolesRequired(['BUSINESS']),
  validateRequest(athletesValidations.getAllAthletes),
  athletesControllers.getAllAthletes
)
router.get(
  '/:athleteId',
  authRequired(),
  rolesRequired(['BUSINESS']),
  validateRequest(athletesValidations.getSingleAthlete),
  athletesControllers.getSingleAthlete
)

export default router
