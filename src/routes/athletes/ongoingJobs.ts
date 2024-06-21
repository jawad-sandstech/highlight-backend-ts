import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import ongoingJobsValidations from '../../validations/athletes/ongoingJobs'
import ongoingJobsControllers from '../../controllers/athletes/ongoingJobs.controllers'

const router = express.Router({ mergeParams: true })

router.get(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(ongoingJobsValidations.getAllOngoingJobs),
  ongoingJobsControllers.getAllOngoingJobs
)
router.patch(
  '/:jobId/complete',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(ongoingJobsValidations.completeOngoingJob),
  ongoingJobsControllers.completeOngoingJob
)

export default router
