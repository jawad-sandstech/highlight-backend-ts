import express from 'express'

import sportsRouter from './sports'

const router = express.Router()

// routes
router.use('/', sportsRouter)

export default router
