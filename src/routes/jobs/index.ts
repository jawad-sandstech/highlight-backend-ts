import express from 'express'

import applicationsRouter from './applications'
import reportRouter from './report'
import jobsRouter from './jobs'

const router = express.Router()

// routes
router.use('/applications', applicationsRouter)
router.use('/report', reportRouter)
router.use('/', jobsRouter)

export default router
