import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import reportValidations from '../../validations/jobs/report'
import reportControllers from '../../controllers/jobs/report.controllers'

const router = express.Router()

router.get(
  '/',
  authRequired(),
  rolesRequired(['ADMIN']),
  validateRequest(reportValidations.getAllReports),
  reportControllers.getAllReports
)
router.post(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(reportValidations.reportJob),
  reportControllers.reportJob
)

export default router
