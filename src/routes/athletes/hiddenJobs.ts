import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import hiddenJobsValidations from '../../validations/athletes/hiddenJobs'
import hiddenJobsControllers from '../../controllers/athletes/hiddenJobs.controllers'

const router = express.Router({ mergeParams: true })

router.post(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(hiddenJobsValidations.hideJob),
  hiddenJobsControllers.hideJob
)

export default router
