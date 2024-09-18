import express from 'express'

import validateRequest from '../../middlewares/validateRequest.middleware'

import sportSubCategoriesValidations from '../../validations/sports/sportSubCategories'
import sportSubCategoriesControllers from '../../controllers/sports/sportSubCategories.controller'

const router = express.Router()

router.get(
  '/',
  validateRequest(sportSubCategoriesValidations.getAllSportSubCategories),
  sportSubCategoriesControllers.getAllSportSubCategories
)

export default router
