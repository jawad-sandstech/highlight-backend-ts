import { createServer } from 'http'

import config from './config/config'

import app from './app'
import createSocketConnection from './socket'

const server = createServer(app)
createSocketConnection(server)

server.listen(config.PORT, () => {
  console.info(`listening on ${config.PORT}`)
})
