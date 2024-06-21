import Joi from 'joi'

const getMySavedJobs = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const savedJob = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    jobId: Joi.number().required()
  })
})

const deleteSavedJob = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    savedJobId: Joi.number().required()
  }),
  body: Joi.object({})
})

export default {
  getMySavedJobs,
  savedJob,
  deleteSavedJob
}
