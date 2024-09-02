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
router.get(
  '/:jobId',
  authRequired(),
  rolesRequired(['ATHLETE', 'BUSINESS', 'ADMIN']),
  validateRequest(feedbacksValidations.getSingleJob),
  feedbacksControllers.getSingleJob
)
router.post(
  '/',
  authRequired(),
  rolesRequired(['BUSINESS']),
  upload.single('banner'),
  feedbacksControllers.createJob
)
router.post(
  '/publish',
  authRequired(),
  rolesRequired(['BUSINESS']),
  validateRequest(feedbacksValidations.publishJob),
  feedbacksControllers.publishJob
)
router.patch(
  '/:jobId',
  authRequired(),
  rolesRequired(['BUSINESS']),
  upload.single('banner'),
  feedbacksControllers.updateJob
)
router.delete(
  '/:jobId',
  authRequired(),
  rolesRequired(['BUSINESS']),
  upload.single('banner'),
  feedbacksControllers.deleteJob
)

export default router
