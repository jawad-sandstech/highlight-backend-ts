import { Server } from 'socket.io'

import type { Server as HttpServer } from 'http'

import connectionHandler from './handlers/connectionHandler'
import joinChatHandler from './handlers/joinChatHandler'
import leaveChatHandler from './handlers/leaveChatHandler'
import disconnectHandler from './handlers/disconnectHandler'

const createSocketConnection = (server: HttpServer): void => {
  global.connectedSockets = {}
  global.socketIo = null

  global.socketIo = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  global.socketIo.on('connection', (socket) => {
    void connectionHandler(socket)

    socket.on('joinChat', (chatId: string) => {
      void joinChatHandler(socket, Number(chatId))
    })

    socket.on('leaveChat', (chatId: string) => {
      void leaveChatHandler(socket, Number(chatId))
    })

    socket.on('disconnect', () => {
      disconnectHandler(socket)
    })
  })
}

export default createSocketConnection
