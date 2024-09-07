import Joi from 'joi'

const getTaxVerification = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const updateTaxVerification = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    address: Joi.string().required(),
    SSN: Joi.string().required()
  })
})

const getTaxDocuments = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

export default {
  getTaxVerification,
  updateTaxVerification,
  getTaxDocuments
}
