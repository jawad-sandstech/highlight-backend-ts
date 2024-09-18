import express from 'express'

import validateRequest from '../../middlewares/validateRequest.middleware'

import packagesValidations from '../../validations/packages/packages'
import packagesControllers from '../../controllers/packages/packages.controllers'

const router = express.Router()

router.get(
  '/',
  validateRequest(packagesValidations.getAllPackages),
  packagesControllers.getAllPackages
)

module.exports = router
