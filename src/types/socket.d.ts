/* eslint-disable @typescript-eslint/consistent-type-definitions */
import 'socket.io'

declare module 'socket.io' {
  interface Socket {
    userId: number
  }
}
