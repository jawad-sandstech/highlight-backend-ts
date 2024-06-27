import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import sportsValidations from '../../validations/sports/sports'
import sportsControllers from '../../controllers/sports/sports.controller'

const router = express.Router()

router.get('/', validateRequest(sportsValidations.getAllSports), sportsControllers.getAllSports)
router.post(
  '/',
  authRequired(),
  rolesRequired(['ADMIN']),
  validateRequest(sportsValidations.createSport),
  sportsControllers.createSport
)

export default router
