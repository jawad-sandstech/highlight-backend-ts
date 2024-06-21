import express from 'express'

import favoriteBusinessRouter from './favoriteBusiness'
import applicationsRouter from './applications'
import savedJobsRouter from './savedJobs'
import hiddenJobsRouter from './hiddenJobs'
import ongoingJobsRouter from './ongoingJobs'
import closedJobsRouter from './closedJobs'
import ratingRouter from './rating'
import athletesRouter from './athletes'

const router = express.Router()

// routes
router.use('/favorite-business', favoriteBusinessRouter)
router.use('/applications', applicationsRouter)
router.use('/saved-jobs', savedJobsRouter)
router.use('/hidden-jobs', hiddenJobsRouter)
router.use('/ongoing-jobs', ongoingJobsRouter)
router.use('/closed-jobs', closedJobsRouter)
router.use('/:athleteId/rate', ratingRouter)
router.use('/', athletesRouter)

export default router
