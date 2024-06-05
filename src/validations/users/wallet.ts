import Joi from 'joi'

const getMyTransactions = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const deposit = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    amount: Joi.number().required()
  })
})

const withdraw = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    bankAccountId: Joi.string().required(),
    withdrawAmount: Joi.number().required()
  })
})

export default {
  getMyTransactions,
  deposit,
  withdraw
}
