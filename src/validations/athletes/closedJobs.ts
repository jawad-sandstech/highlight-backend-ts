import Joi from 'joi'

const getAllClosedJobs = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

export default {
  getAllClosedJobs
}
