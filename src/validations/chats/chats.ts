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
    content: Joi.string().required()
  })
})

export default {
  getAllChats,
  getAllMessages,
  createPrivateChat,
  createGroupChat,
  createMessage
}
