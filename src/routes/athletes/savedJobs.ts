import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import savedJobsValidations from '../../validations/athletes/savedJobs'
import savedJobsControllers from '../../controllers/athletes/savedJobs.controllers'

const router = express.Router({ mergeParams: true })

router.get(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(savedJobsValidations.getMySavedJobs),
  savedJobsControllers.getMySavedJobs
)
router.post(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(savedJobsValidations.savedJobs),
  savedJobsControllers.savedJobs
)

export default router
