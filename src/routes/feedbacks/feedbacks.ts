import express from 'express'
import multer from 'multer'

import storage from '../../config/multer.config'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import feedbacksValidations from '../../validations/feedbacks/feedbacks'
import feedbacksControllers from '../../controllers/feedbacks/feedbacks.controllers'

const router = express.Router()

const upload = multer({ storage })

router.get(
  '/',
  authRequired(),
  rolesRequired(['ADMIN']),
  validateRequest(feedbacksValidations.getAllFeedbacks),
  feedbacksControllers.getAllFeedbacks
)
router.post(
  '/upload-picture',
  authRequired(),
  upload.single('image'),
  validateRequest(feedbacksValidations.uploadPicture),
  feedbacksControllers.uploadPicture
)
router.post(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE', 'BUSINESS']),
  validateRequest(feedbacksValidations.createFeedbacks),
  feedbacksControllers.createFeedbacks
)

export default router
