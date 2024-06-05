import express from 'express'
import multer from 'multer'

import storage from '../../config/multer.config'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import meValidations from '../../validations/users/me'
import meControllers from '../../controllers/users/me.controllers'

const router = express.Router()

const upload = multer({ storage })

router.get(
  '/',
  authRequired(),
  validateRequest(meValidations.getMyProfile),
  meControllers.getMyProfile
)
router.get(
  '/stripe/onboard',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(meValidations.stripeOnboard),
  meControllers.stripeOnboard
)
router.post(
  '/upload-profile-picture',
  authRequired(),
  upload.single('profile'),
  validateRequest(meValidations.uploadPicture),
  meControllers.uploadPicture
)
router.post(
  '/upload-attachment',
  authRequired(),
  rolesRequired(['ATHLETE']),
  upload.single('attachment'),
  validateRequest(meValidations.uploadAttachment),
  meControllers.uploadAttachment
)
router.patch(
  '/',
  authRequired(),
  validateRequest(meValidations.updateProfile),
  meControllers.updateProfile
)
router.patch(
  '/athlete-info',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(meValidations.updateAthleteInfo),
  meControllers.updateAthleteInfo
)
router.patch(
  '/business-info',
  authRequired(),
  rolesRequired(['BUSINESS']),
  validateRequest(meValidations.updateBusinessInfo),
  meControllers.updateBusinessInfo
)
router.delete(
  '/delete-account',
  authRequired(),
  validateRequest(meValidations.deleteAccount),
  meControllers.deleteAccount
)

export default router
