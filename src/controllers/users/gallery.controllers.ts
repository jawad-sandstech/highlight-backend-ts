import crypto from 'crypto'
import {
  serverErrorResponse,
  createSuccessResponse,
  badRequestResponse,
  unauthorizedResponse,
  updateSuccessResponse
} from 'generic-response'
import { PutObjectCommand } from '@aws-sdk/client-s3'

import prisma from '../../config/database.config'
import config from '../../config/config'
import s3 from '../../config/s3.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

type TDeleteGalleryBody = {
  deleteItems: number[]
}

const uploadGallery = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { file } = req

  if (file === undefined) {
    const response = badRequestResponse('No file attached')
    return res.status(response.status.code).json(response)
  }

  try {
    const folderName = 'user-gallery'

    const randomImageName = crypto.randomBytes(32).toString('hex')

    const command = new PutObjectCommand({
      Bucket: config.S3_BUCKET_NAME,
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

const updateGallery = async (
  req: AuthRequest<unknown, unknown, TDeleteGalleryBody>,
  res: Response
): Promise<Response> => {
  const { files, user, body } = req
  const { deleteItems } = body

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  console.log(deleteItems.map(Number))

  const { userId } = user

  try {
    await prisma.userGallery.deleteMany({
      where: {
        id: { in: deleteItems.map(Number) }
      }
    })

    const folderName = 'user-gallery'

    for (const file of files as Express.Multer.File[]) {
      const randomImageName = crypto.randomBytes(32).toString('hex')

      const command = new PutObjectCommand({
        Bucket: config.S3_BUCKET_NAME,
        Key: `${folderName}/${randomImageName}`,
        Body: file.buffer,
        ContentType: file.mimetype
      })

      await s3.send(command)
      await prisma.userGallery.create({
        data: { userId, path: `${folderName}/${randomImageName}` }
      })
    }

    const response = updateSuccessResponse()
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
  uploadGallery,
  updateGallery
}
