import Joi from 'joi'

const hideJob = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    jobId: Joi.number().required()
  })
})

export default {
  hideJob
}
