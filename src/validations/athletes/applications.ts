import Joi from 'joi'

const getMyApplications = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

export default {
  getMyApplications
}
