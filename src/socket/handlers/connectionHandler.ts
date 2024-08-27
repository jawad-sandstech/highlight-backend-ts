import jwt from 'jsonwebtoken'

import config from '../../config/config'

import type { Socket } from 'socket.io'

type TDecodedUser = {
  userId: number
}

const authenticateUser = async (socket: Socket): Promise<string | jwt.JwtPayload> => {
  const authorizationHeader = socket.handshake.headers.authorization
  if (authorizationHeader === undefined) throw new Error('No token')

  const [tokenFormat, token] = authorizationHeader.split(' ')

  if (tokenFormat !== 'Bearer') throw new Error('Invalid token format')
  if (token === undefined) throw new Error('No token provided')

  const decodedToken = jwt.verify(token, config.JWT_SECRET)
  return decodedToken
}

const handleConnection = async (socket: Socket): Promise<void> => {
  try {
    const decodedToken = await authenticateUser(socket)
    const { userId } = decodedToken as TDecodedUser

    console.log('a user connected', socket.id)

    socket.userId = userId
    global.connectedSockets[userId] = socket
  } catch (error) {
    if (error instanceof Error) {
      socket.emit('error', error.message)
    } else {
      socket.emit('error', 'An unexpected error occurred.')
    }

    socket.disconnect(true)
  }
}

export default handleConnection
