import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import schedulesValidations from '../../validations/chats/schedules'
import schedulesControllers from '../../controllers/chats/schedules.controllers'

const router = express.Router()

router.get(
  '/',
  authRequired(),
  validateRequest(schedulesValidations.getAllSchedules),
  schedulesControllers.getAllSchedules
)
router.post(
  '/',
  authRequired(),
  validateRequest(schedulesValidations.createSchedule),
  schedulesControllers.createSchedule
)

export default router
