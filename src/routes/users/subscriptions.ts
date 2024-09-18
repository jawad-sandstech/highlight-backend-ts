import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import subscriptionsValidations from '../../validations/users/subscriptions'
import subscriptionsControllers from '../../controllers/users/subscriptions.controller'

const router = express.Router()

router.get(
  '/',
  authRequired(),
  validateRequest(subscriptionsValidations.getCurrentSubscription),
  subscriptionsControllers.getCurrentSubscription
)
router.get(
  '/',
  authRequired(),
  validateRequest(subscriptionsValidations.subscribe),
  subscriptionsControllers.subscribe
)
router.patch(
  '/cancel',
  authRequired(),
  validateRequest(subscriptionsValidations.cancelSubcription),
  subscriptionsControllers.cancelSubcription
)

export default router
