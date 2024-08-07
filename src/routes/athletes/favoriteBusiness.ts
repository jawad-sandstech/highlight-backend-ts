import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import favoriteBusinessValidations from '../../validations/athletes/favoriteBusiness'
import favoriteBusinessControllers from '../../controllers/athletes/favoriteBusiness.controllers'

const router = express.Router({ mergeParams: true })

router.get(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(favoriteBusinessValidations.getAllFavoriteBusinesses),
  favoriteBusinessControllers.getAllFavoriteBusinesses
)
router.post(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(favoriteBusinessValidations.toggleMarkAsFavorite),
  favoriteBusinessControllers.toggleMarkAsFavorite
)

export default router
