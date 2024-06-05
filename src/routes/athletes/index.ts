import express from 'express'

import applicationsRouter from './applications'
import savedJobsRouter from './savedJobs'
import hiddenJobsRouter from './hiddenJobs'
import favoriteBusinessRouter from './favoriteBusiness'
import athletesRouter from './athletes'

const router = express.Router()

// routes
router.use('/applications', applicationsRouter)
router.use('/saved-jobs', savedJobsRouter)
router.use('/hidden-jobs', hiddenJobsRouter)
router.use('/favorite-business', favoriteBusinessRouter)
router.use('/', athletesRouter)

export default router
