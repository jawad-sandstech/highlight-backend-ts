import Joi from 'joi'

const getAllApplications = Joi.object({
  query: Joi.object({
    status: Joi.string()
      .valid('APPLIED', 'WAIT_LISTED', 'REJECTED', 'HIRED', 'COMPLETED')
      .optional(),
    jobId: Joi.number().optional()
  }),
  params: Joi.object({}),
  body: Joi.object({})
})

const updateStatusOfApplications = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    applicationId: Joi.number().required()
  }),
  body: Joi.object({
    status: Joi.string()
      .valid('APPLIED', 'WAIT_LISTED', 'REJECTED', 'HIRED', 'COMPLETED')
      .required()
  })
})

export default {
  getAllApplications,
  updateStatusOfApplications
}
