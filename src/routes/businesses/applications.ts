import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import applicationsValidations from '../../validations/businesses/applications'
import applicationsControllers from '../../controllers/businesses/applications.controllers'

const router = express.Router({ mergeParams: true })

router.get(
  '/',
  authRequired(),
  rolesRequired(['BUSINESS']),
  validateRequest(applicationsValidations.getAllApplications),
  applicationsControllers.getAllApplications
)
router.get(
  '/:applicationId',
  authRequired(),
  rolesRequired(['BUSINESS']),
  validateRequest(applicationsValidations.updateStatusOfApplications),
  applicationsControllers.updateStatusOfApplications
)

export default router
