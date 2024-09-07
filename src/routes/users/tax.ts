import express from 'express'

import authRequired from '../../middlewares/authRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import taxValidations from '../../validations/users/tax'
import taxControllers from '../../controllers/users/tax.controllers'

const router = express.Router()

router.get(
  '/verification',
  authRequired(),
  validateRequest(taxValidations.getTaxVerification),
  taxControllers.getTaxVerification
)
router.patch(
  '/verification',
  authRequired(),
  validateRequest(taxValidations.updateTaxVerification),
  taxControllers.updateTaxVerification
)
router.get(
  '/documents',
  authRequired(),
  validateRequest(taxValidations.getTaxDocuments),
  taxControllers.getTaxDocuments
)

export default router
