import crypto from 'crypto'
import {
  serverErrorResponse,
  okResponse,
  createSuccessResponse,
  badRequestResponse,
  unauthorizedResponse
} from 'generic-response'
import { PutObjectCommand } from '@aws-sdk/client-s3'

import config from '../../config/config'
import prisma from '../../config/database.config'
import s3 from '../../config/s3.config'

import type { Feedback, FeedbackImages } from '@prisma/client'
import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TFeedback = Feedback & {
  FeedbackImages: FeedbackImages[] | null
}

type TCreateFeedbacksBody = {
  text: string
  images: Array<{ path: string }>
}

const augmentFeedbacksWithImageUrls = (feedbacks: TFeedback[]): Feedback[] => {
  feedbacks.forEach((feedback) => {
    if (feedback.FeedbackImages !== null) {
      feedback.FeedbackImages = feedback.FeedbackImages.map((imageObject) => ({
        ...imageObject,
        path: `${config.S3_ACCESS_URL}/${imageObject.path}`
      }))
    }
  })

  return feedbacks
}

const getAllFeedbacks = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: {
        FeedbackImages: true,
        User: true
      }
    })

    const feedbacksWithImageUrls = augmentFeedbacksWithImageUrls(feedbacks)

    const response = okResponse(feedbacksWithImageUrls)
    return res.status(response.status.code).json(response)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      const response = serverErrorResponse(error.message)
      return res.status(response.status.code).json(response)
    } else {
      const response = serverErrorResponse('An unexpected error occurred')
      return res.status(response.status.code).json(response)
    }
  }
}

const uploadPicture = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { file } = req

  if (file === undefined) {
    const response = badRequestResponse('no file attached')
    return res.status(response.status.code).json(response)
  }

  try {
    const folderName = 'feedback-images'

    const randomImageName = crypto.randomBytes(32).toString('hex')

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `${folderName}/${randomImageName}`,
      Body: file.buffer,
      ContentType: file.mimetype
    })

    await s3.send(command)

    const response = createSuccessResponse({ Key: `${folderName}/${randomImageName}` })
    return res.status(response.status.code).json(response)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      const response = serverErrorResponse(error.message)
      return res.status(response.status.code).json(response)
    } else {
      const response = serverErrorResponse('An unexpected error occurred')
      return res.status(response.status.code).json(response)
    }
  }
}

const createFeedbacks = async (
  req: AuthRequest<unknown, unknown, TCreateFeedbacksBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { images, ...data } = req.body

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const feedback = await prisma.feedback.create({
      data: {
        userId,
        ...data,
        FeedbackImages: {
          createMany: {
            data: images
          }
        }
      },
      include: { FeedbackImages: true }
    })

    const response = createSuccessResponse(feedback)
    return res.status(response.status.code).json(response)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      const response = serverErrorResponse(error.message)
      return res.status(response.status.code).json(response)
    } else {
      const response = serverErrorResponse('An unexpected error occurred')
      return res.status(response.status.code).json(response)
    }
  }
}

export default {
  getAllFeedbacks,
  uploadPicture,
  createFeedbacks
}
