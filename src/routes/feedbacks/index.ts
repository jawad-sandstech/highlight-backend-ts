import express from 'express'

import feedbacksRouter from './feedbacks'

const router = express.Router()

// routes
router.use('/', feedbacksRouter)

export default router
