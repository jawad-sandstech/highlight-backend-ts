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
  PLATFORM_FEE_PERCENTAGE: Number(process.env.PLATFORM_FEE_PERCENTAGE!),

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,

  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME!,
  S3_BUCKET_REGION: process.env.S3_BUCKET_REGION!,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID!,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY!,
  S3_ACCESS_URL: process.env.S3_ACCESS_URL!,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!
}

export default config
