import Joi from 'joi'

const getMySavedJobs = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const savedJobs = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    jobId: Joi.number().required()
  })
})

export default {
  getMySavedJobs,
  savedJobs
}
