import express from 'express'

import sportsRouter from './sports'
import sportSubCategoriesRouter from './sportSubCategories'

const router = express.Router()

// routes
router.use('/', sportsRouter)
router.use('/sub-categories', sportSubCategoriesRouter)

export default router
