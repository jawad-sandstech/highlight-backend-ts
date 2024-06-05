import express from 'express'

import jobsRouter from './jobs'
import businessesRouter from './businesses'

const router = express.Router()

// routes
router.use('/:businessId/jobs', jobsRouter)
router.use('/', businessesRouter)

export default router
