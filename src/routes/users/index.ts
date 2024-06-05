import express from 'express'

import authRouter from './auth'
import meRouter from './me'
import galleryRouter from './gallery'
import preferencesRouter from './preferences'
import banksRouter from './banks'
import walletRouter from './wallet'

const router = express.Router()

// routes
router.use('/auth', authRouter)
router.use('/me', meRouter)
router.use('/gallery', galleryRouter)
router.use('/preferences', preferencesRouter)
router.use('/banks', banksRouter)
router.use('/wallet', walletRouter)

export default router
