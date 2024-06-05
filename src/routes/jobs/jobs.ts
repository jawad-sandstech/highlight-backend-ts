import express from 'express'
import multer from 'multer'

import storage from '../../config/multer.config'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import feedbacksValidations from '../../validations/jobs/jobs'
import feedbacksControllers from '../../controllers/jobs/jobs.controllers'

const router = express.Router()

const upload = multer({ storage })

router.get(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(feedbacksValidations.getAllJobs),
  feedbacksControllers.getAllJobs
)
router.post(
  '/banner',
  authRequired(),
  rolesRequired(['BUSINESS']),
  upload.single('banner'),
  validateRequest(feedbacksValidations.uploadJobBanner),
  feedbacksControllers.uploadJobBanner
)
router.post(
  '/',
  authRequired(),
  rolesRequired(['BUSINESS']),
  validateRequest(feedbacksValidations.createJob),
  feedbacksControllers.createJob
)

export default router
