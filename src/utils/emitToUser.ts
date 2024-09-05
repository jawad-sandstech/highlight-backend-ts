const emitToUser = (userId: number, event: string, data: string): void => {
  const socket = Object.values(global.connectedSockets).find((i) => i.userId === userId)

  if (socket !== undefined) {
    socket.emit(event, data)
  }
}

export default emitToUser
