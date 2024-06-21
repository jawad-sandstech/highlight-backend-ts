/* eslint-disable @typescript-eslint/no-non-null-assertion */

import env from 'dotenv'
import path from 'path'

env.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV ?? ''}`)
})

const config = {
  PORT: process.env.PORT!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
  BACKEND_URL: process.env.BACKEND_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  S3_ACCESS_URL: process.env.S3_ACCESS_URL!,
  BUCKET_NAME: process.env.BUCKET_NAME!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  PLATFORM_FEE_PERCENTAGE: Number(process.env.PLATFORM_FEE_PERCENTAGE!)
}

export default config
