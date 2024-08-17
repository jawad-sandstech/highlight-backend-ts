import crypto from 'crypto'
import {
  serverErrorResponse,
  okResponse,
  unauthorizedResponse,
  notFoundResponse,
  createSuccessResponse,
  badRequestResponse
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

type TCreatePrivateChatBody = {
  athleteId: number
}

type TCreateGroupChatBody = {
  name: string
  participants: number[]
}

type TCreateMessageParams = {
  chatId: string
}

type TCreateMessageBody = {
  content: string
}

const isUserParticipant = (participants: Participants[], userId: number): boolean => {
  return participants.some((participant: any) => participant.userId === userId)
}

const augmentMessageWithImageUrls = (message: Messages): Messages => {
  message.attachment &&= config.S3_ACCESS_URL + message.attachment

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
        },
        Messages: {
          some: {}
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
          take: 1,
          include: {
            _count: {
              select: {
                MessageStatus: {
                  where: {
                    userId,
                    seen: false
                  }
                }
              }
            }
          }
        }
      }
    })

    const chatsWithName = chats.map((chat) => ({
      ...chat,
      name: chat.name ?? chat.Participants.find((i) => i.userId !== userId)?.User.fullName
    }))

    const sortedChats = chatsWithName.sort((a, b) => {
      const aLastMessageDate = a.Messages[0]?.createdAt?.getTime() ?? 0
      const bLastMessageDate = b.Messages[0]?.createdAt?.getTime() ?? 0
      return bLastMessageDate - aLastMessageDate
    })

    const response = okResponse(sortedChats)
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
        Messages: {
          include: {
            User: {
              select: {
                id: true,
                profilePicture: true
              }
            }
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

const createPrivateChat = async (
  req: AuthRequest<unknown, unknown, TCreatePrivateChatBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { athleteId } = req.body

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const athlete = await prisma.users.findUnique({
      where: { id: athleteId, role: 'ATHLETE' }
    })

    if (athlete === null) {
      const response = notFoundResponse('athlete not found')
      return res.status(response.status.code).json(response)
    }

    const existingChat = await prisma.chats.findFirst({
      where: {
        type: 'PRIVATE',
        Participants: {
          every: {
            userId: {
              in: [userId, athleteId]
            }
          }
        }
      }
    })

    if (existingChat !== null) {
      const response = okResponse(existingChat, 'chat already exists')
      return res.status(response.status.code).json(response)
    }

    const business = await prisma.users.findUnique({
      where: { id: userId },
      include: { BusinessInfo: true }
    })

    if (business?.BusinessInfo?.isPremium === false) {
      const response = badRequestResponse('business does not have premium account')
      return res.status(response.status.code).json(response)
    }

    const chat = await prisma.chats.create({
      data: {
        type: 'PRIVATE',
        Participants: {
          createMany: {
            data: [{ userId }, { userId: athleteId }]
          }
        }
      }
    })

    const response = createSuccessResponse(chat)
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

const createGroupChat = async (
  req: AuthRequest<unknown, unknown, TCreateGroupChatBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const { name, participants } = req.body

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const existingUsers = await prisma.users.findMany({
      where: { id: { in: participants } }
    })

    const existingUserIds = existingUsers.map((user) => user.id)

    const nonExistingUserIds = participants.filter((userId) => !existingUserIds.includes(userId))

    if (nonExistingUserIds.length > 0) {
      const response = notFoundResponse(`users with ids: ${nonExistingUserIds.join(',')} not found`)
      return res.status(response.status.code).json(response)
    }

    const chat = await prisma.chats.create({
      data: {
        type: 'GROUP',
        name,
        Participants: {
          createMany: {
            data: [{ userId, isAdmin: true }, ...participants.map((i) => ({ userId: i }))]
          }
        }
      }
    })

    await prisma.messages.create({
      data: {
        chatId: chat.id,
        senderId: userId,
        content: 'hello everyone!',
        MessageStatus: {
          createMany: {
            data: participants.map((i) => ({ userId: i }))
          }
        }
      }
    })

    const response = createSuccessResponse(chat)
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

const createMessage = async (
  req: AuthRequest<TCreateMessageParams, unknown, TCreateMessageBody>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const attachment = req.file
  const chatId = Number(req.params.chatId)
  const { content } = req.body

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
        attachment: attachmentPath,
        MessageStatus: {
          create: { userId: chat.Participants.find((i) => i.userId !== userId)?.userId! }
        }
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
  createPrivateChat,
  createGroupChat,
  createMessage
}
