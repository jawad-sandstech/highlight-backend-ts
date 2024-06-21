import express from 'express'

import reportRouter from './report'
import jobsRouter from './jobs'

const router = express.Router()

// routes
router.use('/report', reportRouter)
router.use('/', jobsRouter)

export default router
