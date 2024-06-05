import Joi from 'joi'

const getAllBusinesses = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const getSingleBusiness = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    businessId: Joi.number().required()
  }),
  body: Joi.object({})
})

export default {
  getAllBusinesses,
  getSingleBusiness
}
