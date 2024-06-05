import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import applicationsValidations from '../../validations/jobs/applications'
import applicationsControllers from '../../controllers/jobs/applications.controllers'

const router = express.Router()

router.post(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(applicationsValidations.createApplication),
  applicationsControllers.createApplication
)

export default router
