import express from 'express'

import packagesRouter from './packages'

const router = express.Router()

// routes
router.use('/', packagesRouter)

export default router
