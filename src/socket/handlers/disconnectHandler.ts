import type { Socket } from 'socket.io'

const disconnectHandler = (socket: Socket): void => {
  Reflect.deleteProperty(global.connectedSockets, socket.id)
  console.log(`User ${socket.userId} disconnected.`)
}

export default disconnectHandler
