import Joi from 'joi'

const getAllOngoingJobs = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const completeOngoingJob = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    jobId: Joi.number().required()
  }),
  body: Joi.object({})
})

export default {
  getAllOngoingJobs,
  completeOngoingJob
}
