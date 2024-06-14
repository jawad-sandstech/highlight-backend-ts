import Joi from 'joi'

const getMyAppliedJobsList = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

export default {
  getMyAppliedJobsList
}
