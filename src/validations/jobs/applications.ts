import Joi from 'joi'

const createApplication = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    jobId: Joi.number().required()
  })
})

export default {
  createApplication
}
