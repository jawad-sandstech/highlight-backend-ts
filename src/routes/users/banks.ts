import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import banksValidations from '../../validations/users/banks'
import banksControllers from '../../controllers/users/banks.controllers'

const router = express.Router()

router.get(
  '/',
  authRequired(),
  validateRequest(banksValidations.getMyAllBanks),
  banksControllers.getMyAllBanks
)
router.get(
  '/:accountNumber',
  authRequired(),
  validateRequest(banksValidations.getSingleBank),
  banksControllers.getSingleBank
)
router.post(
  '/',
  authRequired(),
  validateRequest(banksValidations.addBankDetail),
  banksControllers.addBankDetail
)

export default router
