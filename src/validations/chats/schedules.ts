import Joi from 'joi'

const getAllSchedules = Joi.object({
  query: Joi.object({
    jobId: Joi.number().optional(),
    dateRange: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}_\d{4}-\d{2}-\d{2}$/)
      .description('Date range in the format YYYY-MM-DD_YYYY-MM-DD')
      .optional()
  }),
  params: Joi.object({}),
  body: Joi.object({})
})

const createSchedule = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    chatId: Joi.number().required(),
    agenda: Joi.string().required(),
    meetingDateTime: Joi.string().required(),
    zoomMeetingLink: Joi.string().required()
  })
})

export default {
  getAllSchedules,
  createSchedule
}
