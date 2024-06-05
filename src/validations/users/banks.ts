import Joi from 'joi'

const getMyAllBanks = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const getSingleBank = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    accountNumber: Joi.string().required()
  }),
  body: Joi.object({})
})

const addBankDetail = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    accountNumber: Joi.string().required(),
    routingNumber: Joi.string().optional()
  })
})

export default {
  getMyAllBanks,
  getSingleBank,
  addBankDetail
}
