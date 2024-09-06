import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import notificationsValidations from '../../validations/users/notifications'
import notificationsControllers from '../../controllers/users/notifications.controllers'

const router = express.Router()

router.get(
  '/',
  authRequired(),
  validateRequest(notificationsValidations.getAllNotifications),
  notificationsControllers.getAllNotifications
)
router.get(
  '/unread-count',
  authRequired(),
  validateRequest(notificationsValidations.getUnreadNotificationsCount),
  notificationsControllers.getUnreadNotificationsCount
)

export default router
