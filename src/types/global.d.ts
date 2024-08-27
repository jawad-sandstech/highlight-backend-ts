/* eslint-disable no-var */

import type { Server as SocketIOServer, Socket } from 'socket.io'

declare global {
  var connectedSockets: Record<number, Socket>
  var socketIo: SocketIOServer | null
}

export {}
