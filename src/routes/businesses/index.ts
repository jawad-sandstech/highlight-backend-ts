import express from 'express'

import applicationsRouter from './applications'
import jobsRouter from './jobs'
import businessesRouter from './businesses'

const router = express.Router()

// routes
router.use('/applications', applicationsRouter)
router.use('/jobs', jobsRouter)
router.use('/', businessesRouter)

export default router
