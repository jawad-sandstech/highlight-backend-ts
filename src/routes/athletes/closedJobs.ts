import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import closedJobsValidations from '../../validations/athletes/closedJobs'
import closedJobsControllers from '../../controllers/athletes/closedJobs.controllers'

const router = express.Router({ mergeParams: true })

router.get(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(closedJobsValidations.getAllClosedJobs),
  closedJobsControllers.getAllClosedJobs
)

export default router
