import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import businessesValidations from '../../validations/businesses/businesses'
import businessesControllers from '../../controllers/businesses/businesses.controllers'

const router = express.Router({ mergeParams: true })

router.get(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE', 'ADMIN']),
  validateRequest(businessesValidations.getAllBusinesses),
  businessesControllers.getAllBusinesses
)
router.get(
  '/:businessId',
  authRequired(),
  rolesRequired(['ATHLETE', 'ADMIN']),
  validateRequest(businessesValidations.getSingleBusiness),
  businessesControllers.getSingleBusiness
)

export default router
