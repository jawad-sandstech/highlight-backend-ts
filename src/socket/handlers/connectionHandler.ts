import jwt from 'jsonwebtoken'

import config from '../../config/config'

import type { Socket } from 'socket.io'

type TDecodedUser = {
  userId: number
}

const authenticateUser = async (socket: Socket): Promise<string | jwt.JwtPayload> => {
  const authorizationHeader = socket.handshake.headers.authorization
  const token = authorizationHeader?.split(' ')[1]

  if (token === undefined) throw new Error('No token provided')

  const decodedToken = jwt.verify(token, config.JWT_SECRET)
  return decodedToken
}

const handleConnection = async (socket: Socket): Promise<void> => {
  console.log('a user connected', socket.id)

  try {
    const decodedToken = (await authenticateUser(socket)) as TDecodedUser

    socket.userId = decodedToken.userId
    global.connectedSockets[socket.id] = socket

    await markUserAsOnline(socket.user.id)
  } catch (error) {
    logger.error(`JWT verification failed: ${error.message}`)
    socket.disconnect(true)
  }
}

module.exports = handleConnection
