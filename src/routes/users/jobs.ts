import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import jobsValidations from '../../validations/users/jobs'
import jobsControllers from '../../controllers/users/jobs.controllers'

const router = express.Router()

router.get(
  '/',
  authRequired(),
  validateRequest(jobsValidations.getMyAppliedJobsList),
  jobsControllers.getMyAppliedJobsList
)

export default router
