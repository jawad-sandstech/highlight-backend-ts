const userHasAccessToChat = (userId: number, chat: TChatWithParticipants): boolean => {
  if (chat.type === 'PRIVATE') {
    return chat.Participants.some((participant) => participant.userId === userId)
  }

  if (chat.type === 'GROUP') {
    const participant = chat.Participants.find((i) => i.userId === userId)
    return participant !== undefined && participant.exitedAt === null
  }

  return false
}
