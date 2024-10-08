import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import applicationValidations from '../../validations/athletes/applications'
import applicationControllers from '../../controllers/athletes/applications.controllers'

const router = express.Router({ mergeParams: true })

router.get(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(applicationValidations.getMyApplications),
  applicationControllers.getMyApplications
)
router.post(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(applicationValidations.createApplication),
  applicationControllers.createApplication
)

export default router
