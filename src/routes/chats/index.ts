import express from 'express'

import chatsRouter from './chats'
import schedulesRouter from './schedules'

const router = express.Router()

// routes
router.use('/schedules', schedulesRouter)
router.use('/', chatsRouter)

export default router
