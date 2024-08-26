import type { Socket } from 'socket.io'

const leaveChatHandler = async (socket: Socket, chatId: number): Promise<void> => {
  try {
    if (!socket.rooms.has(`chat-${chatId}`)) {
      socket.emit('error', 'You are not part of this chat')
      return
    }

    await socket.leave(`chat-${chatId}`)
    console.log(`User ${socket.userId} left chat ${chatId}`)
  } catch (error) {
    console.error('Error handling leaveChat event: ', error)
    socket.emit('error', 'An error occurred while leaving the chat')
  }
}

export default leaveChatHandler
