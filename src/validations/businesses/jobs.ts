import Joi from 'joi'

const getAllJobsOfBusiness = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

export default {
  getAllJobsOfBusiness
}
