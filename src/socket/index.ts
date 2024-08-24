import { Server } from 'socket.io'

const connectSocketHandler = require('./handlers/connectSocketHandler')
const joinChatHandler = require('./handlers/joinChatHandler')
const disconnectSocketHandler = require('./handlers/disconnectSocketHandler')
const updateLocationHandler = require('./handlers/updateLocationHandler')

const createSocketConnection = (server) => {
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
    connectSocketHandler(socket)

    socket.on('joinChat', (chatId) => {
      joinChatHandler(socket, Number(chatId))
    })

    socket.on('updateLocation', (data) => {
      const parsedData = JSON.parse(data)
      updateLocationHandler(socket, parsedData)
    })

    socket.on('disconnect', () => {
      disconnectSocketHandler(socket)
    })
  })
}

module.exports = createSocketConnection
