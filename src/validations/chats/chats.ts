import Joi from 'joi'

const getAllChats = Joi.object({
  query: Joi.object({
    type: Joi.string().valid('PRIVATE', 'GROUP').required()
  }),
  params: Joi.object({}),
  body: Joi.object({})
})

const getAllMessages = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    chatId: Joi.number().required()
  }),
  body: Joi.object({})
})

const getAllParticipants = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    chatId: Joi.number().required()
  }),
  body: Joi.object({})
})

const getAllNonParticipants = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    chatId: Joi.number().required()
  }),
  body: Joi.object({})
})

const createPrivateChat = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    athleteId: Joi.number().required()
  })
})

const createGroupChat = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    name: Joi.string().required(),
    participants: Joi.array().items(Joi.number()).min(1).required()
  })
})

const createMessage = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    chatId: Joi.number().required()
  }),
  body: Joi.object({
    content: Joi.string().optional()
  })
})

const addMembersInGroup = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    chatId: Joi.number().required()
  }),
  body: Joi.object({
    memberIds: Joi.array().items(Joi.number()).min(1).required()
  })
})

const removeMembersFromGroup = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    chatId: Joi.number().required()
  }),
  body: Joi.object({
    memberIds: Joi.array().items(Joi.number()).min(1).required()
  })
})

const editGroup = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    chatId: Joi.number().required()
  }),
  body: Joi.object({
    name: Joi.string().required()
  })
})

const deleteGroup = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    chatId: Joi.number().required()
  }),
  body: Joi.object({})
})

export default {
  getAllChats,
  getAllMessages,
  getAllParticipants,
  getAllNonParticipants,
  createPrivateChat,
  createGroupChat,
  createMessage,
  addMembersInGroup,
  removeMembersFromGroup,
  editGroup,
  deleteGroup
}
