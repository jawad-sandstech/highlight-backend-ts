import prisma from '../../config/database.config'

import type { Socket } from 'socket.io'
import type { Chats, Participants, Users, Messages } from '@prisma/client'
import config from '../../config/config'

type TChatWithParticipants = Chats & {
  Participants: Array<Participants & { User: Users }>
  Messages: Messages[]
}

const getChatById = async (chatId: number): Promise<TChatWithParticipants | null> => {
  const chat = await prisma.chats.findUnique({
    where: { id: chatId },
    include: {
      Participants: {
        include: {
          User: true
        }
      },
      Messages: {
        take: 1,
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  return chat
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

const joinChatHandler = async (socket: Socket, chatId: number): Promise<void> => {
  try {
    if (isNaN(chatId) || chatId <= 0) {
      socket.emit('error', 'Invalid chat ID')
      return
    }

    const chat = await getChatById(chatId)

    if (chat === null) {
      socket.emit('error', 'Chat not found')
      return
    }

    const hasAccess = userHasAccessToChat(socket.userId, chat)

    if (!hasAccess) {
      socket.emit('error', 'You do not have permission to join this chat')
      return
    }

    await socket.join(`chat-${chatId}`)

    await prisma.messageStatus.updateMany({
      where: { userId: socket.userId },
      data: { seen: true }
    })

    const chatSummary = {
      id: chat.id,
      type: chat.type,
      name: chat.name ?? chat.Participants.find((i) => i.userId !== socket.userId)?.User.fullName,
      icon:
        chat.type === 'PRIVATE'
          ? `${config.S3_ACCESS_URL}/${
              chat.Participants.find((i) => i.userId !== socket.userId)?.User?.profilePicture
            }`
          : await getGroupIcon(chat.id),
      lastMessage: chat.Messages[0],
      unreadMessagesCount: 0
    }

    socket.emit('updateChat', chatSummary)

    console.log(`User ${socket.userId} joined chat ${chatId}`)
  } catch (error) {
    console.error('Error handling joinChat event:', error)
    socket.emit('error', 'An error occurred while joining the chat')
  }
}

export default joinChatHandler
