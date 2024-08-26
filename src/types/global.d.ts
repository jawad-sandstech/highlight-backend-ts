/* eslint-disable no-var */

import type { Server as SocketIOServer } from 'socket.io'

declare global {
  var connectedSockets: Record<string, any>
  var socketIo: SocketIOServer | null
}

export {}
