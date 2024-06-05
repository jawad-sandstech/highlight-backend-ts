import Joi from 'joi'

const getAllReports = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const reportJob = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    jobId: Joi.number().required(),
    reason: Joi.string().optional()
  })
})

export default {
  getAllReports,
  reportJob
}
