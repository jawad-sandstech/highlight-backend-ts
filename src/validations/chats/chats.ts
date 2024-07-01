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

const createMessage = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    chatId: Joi.number().required(),
    content: Joi.string().required()
  })
})

export default {
  getAllChats,
  getAllMessages,
  createMessage
}
