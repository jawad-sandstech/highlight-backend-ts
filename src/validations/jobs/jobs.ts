import Joi from 'joi'

const getAllJobs = Joi.object({
  query: Joi.object({
    sportIds: Joi.array().items(Joi.number()).unique().optional(),
    jobType: Joi.array()
      .items(
        Joi.string().valid('SOCIAL_MEDIA', 'MEET_AND_GREET', 'AUTOGRAPHS', 'PHOTO_SHOOTS', 'OTHER')
      )
      .unique()
      .optional(),
    datePosted: Joi.string()
      .valid('ANY_TIME', 'PAST_24_HOURS', 'PAST_WEEK', 'PAST_MONTH')
      .optional(),
    minimumCompensation: Joi.string().valid('NONE', '$50', '$100', '$200', '$400').optional()
  }),
  params: Joi.object({}),
  body: Joi.object({})
})

const uploadJobBanner = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const createJob = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    bannerImage: Joi.string().required(),
    requiredQualification: Joi.array().items(Joi.string()).min(1).required(),
    salary: Joi.number().required(),
    sportId: Joi.number().required(),
    type: Joi.string()
      .valid('SOCIAL_MEDIA', 'MEET_AND_GREET', 'AUTOGRAPHS', 'PHOTO_SHOOTS', 'OTHER')
      .required()
  })
})

export default {
  getAllJobs,
  uploadJobBanner,
  createJob
}
