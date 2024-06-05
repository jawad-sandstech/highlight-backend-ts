import express from 'express'
import cors from 'cors'
import reqResInspector from 'express-req-res-inspector'

import stripeWebhookHandler from './webhooks'
import apiRoutes from './routes/index'

const app = express()

app.post('/api/v1/stripe-webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler)

app.use(express.static('uploads'))
app.use(express.json({ limit: '100mb' }))
app.use(cors())
app.use(reqResInspector())

app.use('/api/v1', apiRoutes)

export default app
