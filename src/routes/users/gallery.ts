import express from 'express'
import multer from 'multer'

import storage from '../../config/multer.config'

import authRequired from '../../middlewares/authRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import galleryValidations from '../../validations/users/gallery'
import galleryControllers from '../../controllers/users/gallery.controllers'

const router = express.Router()

const upload = multer({ storage })

router.post(
  '/',
  authRequired(),
  upload.single('image'),
  validateRequest(galleryValidations.uploadGallery),
  galleryControllers.uploadGallery
)

export default router
