const emitToUser = (userId: number, event: string, data: string) => {
  const socket = Object.values(global.connectedSockets).find((i) => i.userId === userId)

  if (socket) {
    socket.emit(event, data)
  }
}

export default emitToUser
