import express from 'express'

import authRouter from './auth'
import meRouter from './me'
import taxRouter from './tax'
import galleryRouter from './gallery'
import preferencesRouter from './preferences'
import jobsRouter from './jobs'
import notificationsRouter from './notifications'
import banksRouter from './banks'
import walletRouter from './wallet'

const router = express.Router()

// routes
router.use('/auth', authRouter)
router.use('/me', meRouter)
router.use('/tax', taxRouter)
router.use('/gallery', galleryRouter)
router.use('/preferences', preferencesRouter)
router.use('/jobs', jobsRouter)
router.use('/notifications', notificationsRouter)
router.use('/banks', banksRouter)
router.use('/wallet', walletRouter)

export default router
