import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import jobsValidations from '../../validations/businesses/jobs'
import jobsControllers from '../../controllers/businesses/jobs.controllers'

const router = express.Router({ mergeParams: true })

router.get(
  '/',
  authRequired(),
  rolesRequired(['BUSINESS']),
  validateRequest(jobsValidations.getAllJobsOfBusiness),
  jobsControllers.getAllJobsOfBusiness
)

export default router
