import Joi from 'joi'

const getAllSchedules = Joi.object({
  query: Joi.object({
    JobId: Joi.number().optional()
  }),
  params: Joi.object({}),
  body: Joi.object({})
})

const createSchedule = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    jobId: Joi.number().required(),
    meetingDateTime: Joi.string().required(),
    zoomMeetingLink: Joi.string().required()
  })
})

export default {
  getAllSchedules,
  createSchedule
}
