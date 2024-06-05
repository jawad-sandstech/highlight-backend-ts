import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import favoriteBusinessValidations from '../../validations/athletes/favoriteBusiness'
import favoriteBusinessControllers from '../../controllers/athletes/favoriteBusiness.controllers'

const router = express.Router({ mergeParams: true })

router.post(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(favoriteBusinessValidations.markAsFavorite),
  favoriteBusinessControllers.markAsFavorite
)
router.delete(
  '/:businessId',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(favoriteBusinessValidations.deleteAsFavorite),
  favoriteBusinessControllers.deleteAsFavorite
)

export default router
