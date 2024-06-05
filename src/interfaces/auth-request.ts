import type { Request } from 'express'

export interface AuthRequest<P = unknown, ResBody = unknown, ReqBody = unknown, ReqQuery = unknown>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    userId: number
    role: 'ATHLETE' | 'BUSINESS' | 'ADMIN'
  }
}
