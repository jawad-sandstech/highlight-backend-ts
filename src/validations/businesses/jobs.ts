import Joi from 'joi'

const getAllJobsOfBusiness = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    businessId: Joi.number().required()
  }),
  body: Joi.object({})
})

export default {
  getAllJobsOfBusiness
}
