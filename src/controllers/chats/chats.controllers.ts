import crypto from 'crypto'
import {
  serverErrorResponse,
  okResponse,
  unauthorizedResponse,
  notFoundResponse,
  createSuccessResponse,
  badRequestResponse,
  updateSuccessResponse,
  deleteSuccessResponse
} from 'generic-response'
import { PutObjectCommand } from '@aws-sdk/client-s3'

import s3 from '../../config/s3.config'
import prisma from '../../config/database.config'

import type { Chats, Messages, Participants, Users } from '@prisma/client'
import type { Response } from 'express'
import type { AuthRequest } from '../../interfaces/auth-request'
import config from '../../config/config'
import sendNotification from '../../utils/sendNotification'

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

type TAddMembersInGroupParams = {
  chatId: string
}

type TAddMembersInGroupBody = {
  memberIds: number[]
}

type TRemoveMembersFromGroupParams = {
  chatId: string
}

type TRemoveMembersFromGroupBody = {
  memberIds: number[]
}

type TChatWithParticipants = Chats & {
  Participants: Participants[]
}

type TParticipantWithDetails = Participants & {
  User: Users
}

type TChatWithParticipantDetails = Chats & {
  Participants: TParticipantWithDetails[]
}

type TEditGroupParams = {
  chatId: string
}

type TEditGroupBody = {
  name: string
}

type TDeleteGroupParams = {
  chatId: string
}

const getGroupIcon = async (chatId: number): Promise<string> => {
  const chat = await prisma.chats.findUnique({
    where: { id: chatId },
    include: {
      Participants: {
        where: { isAdmin: true },
        include: {
          User: true
        }
      }
    }
  })

  return `${config.S3_ACCESS_URL}/${chat?.Participants[0].User.profilePicture}`
}

const userHasAccessToChat = (userId: number, chat: TChatWithParticipants): boolean => {
  if (chat.type === 'PRIVATE') {
    return chat.Participants.some((participant) => participant.userId === userId)
  }

  if (chat.type === 'GROUP') {
    const participant = chat.Participants.find((i) => i.userId === userId)
    return participant !== undefined && participant.exitedAt === null
  }

  return false
}

const augmentMessageWithImageUrl = (message: Messages): Messages => {
  message.attachment &&= `${config.S3_ACCESS_URL}/${message.attachment}`

  return message
}

const isGroupAdmin = (userId: number, participants: Participants[]): boolean => {
  return participants.some((participant) => participant.userId === userId && participant.isAdmin)
}

const createMessageInChat = async (
  chatId: number,
  senderId: number,
  content: string,
  attachmentPath?: string
): Promise<Messages> => {
  const message = await prisma.messages.create({
    data: {
      chatId,
      senderId,
      content,
      attachment: attachmentPath
    },
    include: {
      User: true
    }
  })

  message.User.profilePicture &&= `${config.S3_ACCESS_URL}/${message.User.profilePicture}`

  return message
}

const handleSocketIOCommunication = async (
  chatId: number,
  message: Messages,
  chat: TChatWithParticipantDetails,
  userId: number
): Promise<void> => {
  if (global.socketIo !== null) {
    const participants = chat.Participants
    const otherParticipantName = chat.Participants.find((i) => i.userId !== userId)?.User.fullName

    const remoteActiveRoomSockets = await global.socketIo?.in(`chat-${chatId}`).fetchSockets()
    const activeRoomUserIds = remoteActiveRoomSockets?.map((socket) => (socket as any).userId)
    const activeRoomSockets = activeRoomUserIds.map((i) => global.connectedSockets[i])

    const inactiveRoomUserIds = participants
      .filter((i) => !activeRoomUserIds.includes(i.userId))
      .map((i) => i.userId)
    const inactiveSockets = inactiveRoomUserIds
      .map((i) => global.connectedSockets[i])
      .filter((i) => i !== undefined)

    console.log({
      remoteActiveRoomSockets,
      activeRoomUserIds,
      inactiveRoomUserIds,
      inactiveSockets
    })

    await prisma.messageStatus.createMany({
      data: inactiveRoomUserIds.map((i) => ({ userId: i, messageId: message.id }))
    })

    if (global.connectedSockets[userId] !== undefined) {
      global.connectedSockets[userId]
        .to(`chat-${chatId}`)
        .emit('newMessage', JSON.stringify(message))
    }

    for (const socket of [...activeRoomSockets, ...inactiveSockets]) {
      const unreadMessagesCount = await prisma.messages.count({
        where: {
          chatId,
          MessageStatus: {
            some: {
              userId: socket.userId,
              seen: false
            }
          }
        }
      })

      // const chatSummary = {
      //   id: chat.id,
      //   type: chat.type,
      //   name:
      //     // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      //     chat.name ?? userId === socket.userId
      //       ? chat.Participants.find((i) => i.userId !== userId)?.User.fullName
      //       : chat.Participants.find((i) => i.userId === userId)?.User.fullName,
      //   lastMessage: message,
      //   unreadMessagesCount
      // }

      const chatSummary2 = {
        id: chat.id,
        type: chat.type,
        name:
          chat.name !== null && chat.name !== undefined
            ? chat.name
            : userId === socket.userId
            ? chat.Participants.find((i) => i.userId !== userId)?.User.fullName
            : chat.Participants.find((i) => i.userId === userId)?.User.fullName,
        icon:
          chat.type === 'PRIVATE'
            ? userId === socket.userId
              ? `${config.S3_ACCESS_URL}/${
                  chat.Participants.find((i) => i.userId !== userId)?.User?.profilePicture
                }`
              : `${config.S3_ACCESS_URL}/${
                  chat.Participants.find((i) => i.userId === userId)?.User?.profilePicture
                }`
            : await getGroupIcon(chat.id),
        lastMessage: message,
        unreadMessagesCount
      }

      socket.emit('updateChat', chatSummary2)
    }

    for (const userId of inactiveRoomUserIds) {
      void sendNotification(
        userId,
        `New Message From ${chat.name ?? otherParticipantName}`,
        message.content ?? 'attachment',
        chat.type === 'PRIVATE' ? 'PRIVATE_CHAT' : 'GROUP_CHAT',
        { chatId: chat.id }
      )
    }
  }
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
        }
      }
    })

    const chatsWithLastMessage = await Promise.all(
      chats.map(async (chat) => {
        const exitedAt = chat.Participants.find((i) => i.userId === userId)?.exitedAt ?? new Date()

        const lastMessage = await prisma.messages.findFirst({
          where: {
            chatId: chat.id,
            createdAt: {
              lte: exitedAt
            }
          },
          orderBy: { createdAt: 'desc' }
        })

        const unreadMessagesCount = await prisma.messages.count({
          where: {
            chatId: chat.id,
            MessageStatus: {
              some: {
                userId,
                seen: false
              }
            }
          }
        })

        return {
          id: chat.id,
          type: chat.type,
          name: chat.name ?? chat.Participants.find((i) => i.userId !== userId)?.User.fullName,
          icon:
            chat.type === 'PRIVATE'
              ? `${config.S3_ACCESS_URL}/${
                  chat.Participants.find((i) => i.userId !== userId)?.User?.profilePicture
                }`
              : await getGroupIcon(chat.id),
          lastMessage,
          unreadMessagesCount
        }
      })
    )

    const sortedChats = chatsWithLastMessage.sort((a, b) => {
      const aLastMessageDate = a.lastMessage?.createdAt?.getTime() ?? 0
      const bLastMessageDate = b.lastMessage?.createdAt?.getTime() ?? 0
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
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (chat === null) {
      const response = notFoundResponse()
      return res.status(response.status.code).json(response)
    }

    const participant = chat.Participants.find((i) => i.userId === userId)

    if (participant === undefined) {
      const response = unauthorizedResponse()
      return res.status(response.status.code).json(response)
    }

    const exitedAt = participant.exitedAt ?? new Date()

    const messages = chat.Messages.filter((message) => message.createdAt <= exitedAt)

    messages.forEach((i) => {
      i.User.profilePicture &&= `${config.S3_ACCESS_URL}/${i.User.profilePicture}`
      i.attachment &&= `${config.S3_ACCESS_URL}/${i.attachment}`
    })

    const chatWithMessages = {
      ...chat,
      Messages: messages
    }

    const response = okResponse(chatWithMessages)
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

const getAllParticipants = async (
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
        }
      }
    })

    if (chat === null) {
      const response = notFoundResponse()
      return res.status(response.status.code).json(response)
    }

    const participant = chat.Participants.find((i) => i.userId === userId)

    if (participant === undefined) {
      const response = unauthorizedResponse()
      return res.status(response.status.code).json(response)
    }

    const response = okResponse(chat.Participants)
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

const getAllNonParticipants = async (
  req: AuthRequest<TGetSingleChatParams>,
  res: Response
): Promise<Response> => {
  const user = req.user
  const chatId = Number(req.params.chatId)

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  try {
    const chat = await prisma.chats.findUnique({
      where: { id: chatId }
    })

    if (chat === null) {
      const response = notFoundResponse()
      return res.status(response.status.code).json(response)
    }

    if (chat.type !== 'GROUP') {
      const response = badRequestResponse('not a group')
      return res.status(response.status.code).json(response)
    }

    const participants = await prisma.participants.findMany({
      where: { chatId, exitedAt: null },
      select: { userId: true }
    })

    const users = await prisma.users.findMany({
      where: {
        id: {
          notIn: participants.map((i) => i.userId)
        }
      }
    })

    const response = okResponse(users)
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
      Key: `${folderName}/${randomImageName}.${file.mimetype.split('/')[1]}`,
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
  const attachments = req.files as Express.Multer.File[] | undefined
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
          where: {
            exitedAt: null
          },
          include: {
            User: true
          }
        }
      }
    })

    if (chat === null) {
      const response = notFoundResponse('chat not found')
      return res.status(response.status.code).json(response)
    }

    if (!userHasAccessToChat(userId, chat)) {
      const response = unauthorizedResponse()
      return res.status(response.status.code).json(response)
    }

    let attachmentPaths: string[] = []

    if (attachments !== undefined) {
      attachmentPaths = await Promise.all(
        attachments.map(async (attachment) => await uploadAttachment(attachment))
      )
    }

    if (attachmentPaths.length > 0) {
      const messageCreationPromises = attachmentPaths.map(async (attachmentPath) => {
        const message = await createMessageInChat(chatId, userId, 'attachment', attachmentPath)
        const messageWithImageUrl = augmentMessageWithImageUrl(message)

        console.log('messageWithImageUrl', messageWithImageUrl)

        void handleSocketIOCommunication(chatId, messageWithImageUrl, chat, userId)
      })

      await Promise.all(messageCreationPromises)
    } else {
      const message = await createMessageInChat(chatId, userId, content)

      void handleSocketIOCommunication(chatId, message, chat, userId)
    }

    const attachmentUrls = attachmentPaths.map((i) => `${config.S3_ACCESS_URL}/${i}`)

    const response = createSuccessResponse(attachmentUrls)
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

const addMembersInGroup = async (
  req: AuthRequest<TAddMembersInGroupParams, unknown, TAddMembersInGroupBody>,
  res: Response
): Promise<Response> => {
  const chatId = Number(req.params.chatId)
  const { memberIds } = req.body
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const existingUsers = await prisma.users.findMany({
      where: { id: { in: memberIds } }
    })

    const existingUserIds = existingUsers.map((user) => user.id)

    const nonExistingUserIds = memberIds.filter((userId) => !existingUserIds.includes(userId))

    if (nonExistingUserIds.length > 0) {
      const response = notFoundResponse(`users with ids: ${nonExistingUserIds.join(',')} not found`)
      return res.status(response.status.code).json(response)
    }

    const chat = await prisma.chats.findUnique({
      where: { id: chatId },
      include: {
        Participants: {
          include: { User: true }
        }
      }
    })

    if (chat === null) {
      const response = notFoundResponse('chat not found')
      return res.status(response.status.code).json(response)
    }

    if (chat.type !== 'GROUP') {
      const response = badRequestResponse('not a group')
      return res.status(response.status.code).json(response)
    }

    if (!isGroupAdmin(userId, chat.Participants)) {
      const response = unauthorizedResponse('not a group admin')
      return res.status(response.status.code).json(response)
    }

    const participants = chat.Participants

    const existingActiveMembers = memberIds.filter((memberId) =>
      participants.some(
        (participant) => participant.userId === memberId && participant.exitedAt === null
      )
    )

    const reNewMemberIds = memberIds.filter((memberId) =>
      participants.some(
        (participant) => participant.userId === memberId && participant.exitedAt !== null
      )
    )

    const newMemberIds = memberIds.filter(
      (memberId) => !participants.some((participant) => participant.userId === memberId)
    )

    if (existingActiveMembers.length > 0) {
      const response = badRequestResponse(
        `users with ids: ${existingActiveMembers.join(',')} already in group`
      )
      return res.status(response.status.code).json(response)
    }

    await prisma.participants.updateMany({
      where: { userId: { in: reNewMemberIds } },
      data: { exitedAt: null }
    })

    await prisma.participants.createMany({
      data: newMemberIds.map((id) => ({ chatId, userId: id }))
    })

    await prisma.messages.createMany({
      data: participants.map((participant) => ({
        chatId,
        senderId: userId,
        content: `${participant.User.email} was added`,
        messageType: 'SYSTEM'
      }))
    })

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

const removeMembersFromGroup = async (
  req: AuthRequest<TRemoveMembersFromGroupParams, unknown, TRemoveMembersFromGroupBody>,
  res: Response
): Promise<Response> => {
  const chatId = Number(req.params.chatId)
  const { memberIds } = req.body
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const existingUsers = await prisma.users.findMany({
      where: { id: { in: memberIds } }
    })

    const existingUserIds = existingUsers.map((user) => user.id)

    const nonExistingUserIds = memberIds.filter((userId) => !existingUserIds.includes(userId))

    if (nonExistingUserIds.length > 0) {
      const response = notFoundResponse(`users with ids: ${nonExistingUserIds.join(',')} not found`)
      return res.status(response.status.code).json(response)
    }

    const chat = await prisma.chats.findUnique({
      where: { id: chatId },
      include: { Participants: true }
    })

    if (chat === null) {
      const response = notFoundResponse('chat not found')
      return res.status(response.status.code).json(response)
    }

    if (chat.type !== 'GROUP') {
      const response = badRequestResponse('not a group')
      return res.status(response.status.code).json(response)
    }

    if (!isGroupAdmin(userId, chat.Participants)) {
      const response = unauthorizedResponse('not a group admin')
      return res.status(response.status.code).json(response)
    }

    const participantIds = chat.Participants.map((i) => i.userId)
    const nonExistingMembers = memberIds.filter((memberId) => !participantIds.includes(memberId))

    if (nonExistingMembers.length > 0) {
      const response = notFoundResponse(
        `users with ids: ${nonExistingMembers.join(',')} not found in the group`
      )
      return res.status(response.status.code).json(response)
    }

    await prisma.participants.updateMany({
      where: { chatId, userId: { in: memberIds } },
      data: { exitedAt: new Date() }
    })

    await prisma.messages.createMany({
      data: existingUsers.map((i) => ({
        chatId,
        senderId: userId,
        content: `${i.email} was removed`,
        messageType: 'SYSTEM'
      }))
    })

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

const editGroup = async (
  req: AuthRequest<TEditGroupParams, unknown, TEditGroupBody>,
  res: Response
): Promise<Response> => {
  const chatId = Number(req.params.chatId)
  const { name } = req.body
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const chat = await prisma.chats.findUnique({
      where: { id: chatId },
      include: { Participants: true }
    })

    if (chat === null) {
      const response = notFoundResponse('chat not found')
      return res.status(response.status.code).json(response)
    }

    if (chat.type !== 'GROUP') {
      const response = badRequestResponse('not a group')
      return res.status(response.status.code).json(response)
    }

    if (!isGroupAdmin(userId, chat.Participants)) {
      const response = unauthorizedResponse('not a group admin')
      return res.status(response.status.code).json(response)
    }

    await prisma.chats.update({
      where: { id: chatId },
      data: { name }
    })

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

const deleteGroup = async (
  req: AuthRequest<TDeleteGroupParams>,
  res: Response
): Promise<Response> => {
  const chatId = Number(req.params.chatId)
  const user = req.user

  if (user === undefined) {
    const response = unauthorizedResponse()
    return res.status(response.status.code).json(response)
  }

  const { userId } = user

  try {
    const chat = await prisma.chats.findUnique({
      where: { id: chatId },
      include: { Participants: true }
    })

    if (chat === null) {
      const response = notFoundResponse('chat not found')
      return res.status(response.status.code).json(response)
    }

    if (chat.type !== 'GROUP') {
      const response = badRequestResponse('not a group')
      return res.status(response.status.code).json(response)
    }

    if (!isGroupAdmin(userId, chat.Participants)) {
      const response = unauthorizedResponse('not a group admin')
      return res.status(response.status.code).json(response)
    }

    await prisma.chats.delete({
      where: { id: chatId }
    })

    const response = deleteSuccessResponse()
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
  getAllParticipants,
  getAllNonParticipants,
  createPrivateChat,
  createGroupChat,
  createMessage,
  addMembersInGroup,
  removeMembersFromGroup,
  editGroup,
  deleteGroup
}
