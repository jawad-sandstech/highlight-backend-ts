import express from 'express'

import usersRouter from './users'
import stripeRouter from './stripe'
import jobsRouter from './jobs'
import businessesRouter from './businesses'
import athletesRouter from './athletes'
// import packagesRouter from './packages'
import feedbacksRouter from './feedbacks'

const router = express.Router()

// routes
router.use('/users', usersRouter)
router.use('/stripe', stripeRouter)
router.use('/jobs', jobsRouter)
router.use('/businesses', businessesRouter)
router.use('/athletes', athletesRouter)
// router.use('/packages', packagesRouter)
router.use('/feedbacks', feedbacksRouter)

export default router
