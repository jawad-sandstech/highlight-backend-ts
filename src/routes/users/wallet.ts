import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import walletValidations from '../../validations/users/wallet'
import walletControllers from '../../controllers/users/wallet.controllers'

const router = express.Router()

router.get(
  '/',
  authRequired(),
  rolesRequired(['ATHLETE', 'BUSINESS']),
  validateRequest(walletValidations.getMyTransactions),
  walletControllers.getMyTransactions
)
router.post(
  '/deposit',
  authRequired(),
  rolesRequired(['BUSINESS']),
  validateRequest(walletValidations.deposit),
  walletControllers.deposit
)
router.post(
  '/withdraw',
  authRequired(),
  rolesRequired(['ATHLETE']),
  validateRequest(walletValidations.withdraw),
  walletControllers.withdraw
)

export default router
