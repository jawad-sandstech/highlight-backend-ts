import crypto from 'crypto'
import { serverErrorResponse, createSuccessResponse, badRequestResponse } from 'generic-response'
import { PutObjectCommand } from '@aws-sdk/client-s3'

import config from '../../config/config'
import s3 from '../../config/s3.config'

import type { AuthRequest } from '../../interfaces/auth-request'
import type { Response } from 'express'

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
      Bucket: config.BUCKET_NAME,
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

export default {
  uploadGallery
}
