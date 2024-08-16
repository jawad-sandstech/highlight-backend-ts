import crypto from 'crypto'
import {
  serverErrorResponse,
  okResponse,
  unauthorizedResponse,
  notFoundResponse,
  createSuccessResponse
} from 'generic-response'
import { PutObjectCommand } from '@aws-sdk/client-s3'

import s3 from '../../config/s3.config'
import prisma from '../../config/database.config'

import type { Messages, Participants } from '@prisma/client'
import type { Response } from 'express'
import type { AuthRequest } from '../../interfaces/auth-request'
import config from '../../config/config'

type TGetAllChatsQuery = {
  type: 'PRIVATE' | 'GROUP'
}

type TGetSingleChatParams = {
  chatId: string
}

type TCreateMessageBody = {
  chatId: number
  content: string
}

const isUserParticipant = (participants: Participants[], userId: number): boolean => {
  return participants.some((participant: any) => participant.userId === userId)
}

const augmentMessageWithImageUrls = (message: Messages): Messages => {
  if (message.attachment !== null) {
    message.attachment = config.S3_ACCESS_URL + message.attachment
  }

  return message
}

const getAllChats = async (
  req: AuthRequest<unknown, unknown, unknown, TGetAllChatsQuery>,
  res: Response
): Promise<Response> => {
  const { type } = req.query
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const chats = await prisma.chats.findMany({
      where: {
        type,
        Participants: {
          some: {
            userId
          }
        }
      },
      include: {
        Participants: {
          include: {
            User: true
          }
        },
        Messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    const response = okResponse(chats)
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

const getAllMessages = async (
  req: AuthRequest<TGetSingleChatParams>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const chatId = Number(req.params.chatId)

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const chat = await prisma.chats.findUnique({
      where: { id: chatId },
      include: {
        Participants: {
          include: {
            User: true
          }
        },
        Messages: true
      }
    })

    if (chat === null) {
      const response = notFoundResponse()
      return res.status(response.status.code).json(response)
    }

    if (!isUserParticipant(chat?.Participants, userId)) {
      const response = unauthorizedResponse()
      return res.status(response.status.code).json(response)
    }

    const response = okResponse(chat)
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

const uploadAttachment = async (file: Express.Multer.File): Promise<string> => {
  try {
    const folderName = 'chat-attachments'

    const randomImageName = crypto.randomBytes(32).toString('hex')

    const command = new PutObjectCommand({
      Bucket: config.S3_BUCKET_NAME,
      Key: `${folderName}/${randomImageName}`,
      Body: file.buffer,
      ContentType: file.mimetype
    })

    await s3.send(command)

    return `${folderName}/${randomImageName}`
  } catch (error) {
    throw new Error('Error uploading chat attachment')
  }
}

const createMessage = async (
  req: AuthRequest<unknown, unknown, TCreateMessageBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const attachment = req.file
  const { chatId, content } = req.body

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const chat = await prisma.chats.findUnique({
      where: { id: chatId },
      include: {
        Participants: {
          include: {
            User: true
          }
        }
      }
    })

    if (chat === null) {
      const response = notFoundResponse()
      return res.status(response.status.code).json(response)
    }

    if (!isUserParticipant(chat?.Participants, userId)) {
      const response = unauthorizedResponse()
      return res.status(response.status.code).json(response)
    }

    let attachmentPath: string | undefined
    if (attachment !== undefined) {
      attachmentPath = await uploadAttachment(attachment)
    }

    const message = await prisma.messages.create({
      data: {
        chatId,
        senderId: userId,
        content,
        attachment: attachmentPath
      }
    })

    const messageWithImageUrls = augmentMessageWithImageUrls(message)

    const response = createSuccessResponse(messageWithImageUrls)
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
  getAllChats,
  getAllMessages,
  createMessage
}
