import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import preferencesValidations from '../../validations/users/preferences'
import preferencesControllers from '../../controllers/users/preferences.controller'

const router = express.Router()

router.get(
  '/',
  authRequired(),
  validateRequest(preferencesValidations.getUserPreferences),
  preferencesControllers.getUserPreferences
)
router.patch(
  '/',
  authRequired(),
  validateRequest(preferencesValidations.updateUserPreferences),
  preferencesControllers.updateUserPreferences
)

export default router
