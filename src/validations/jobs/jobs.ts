import Joi from 'joi'

const getAllJobs = Joi.object({
  query: Joi.object({
    businessId: Joi.number().optional(),
    sportIds: Joi.string().optional(),
    jobType: Joi.alternatives()
      .try(
        Joi.string().valid('SOCIAL_MEDIA', 'MEET_AND_GREET', 'AUTOGRAPHS', 'PHOTO_SHOOTS', 'OTHER'),
        Joi.array()
          .items(
            Joi.string().valid(
              'SOCIAL_MEDIA',
              'MEET_AND_GREET',
              'AUTOGRAPHS',
              'PHOTO_SHOOTS',
              'OTHER'
            )
          )
          .unique()
      )
      .optional(),
    datePosted: Joi.string()
      .valid('ANY_TIME', 'PAST_24_HOURS', 'PAST_WEEK', 'PAST_MONTH')
      .optional(),
    minimumCompensation: Joi.string().valid('NONE', '$50', '$100', '$200', '$400').optional()
  }),
  params: Joi.object({}),
  body: Joi.object({})
})

const getSingleJob = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    jobId: Joi.number().required()
  }),
  body: Joi.object({})
})

const uploadJobBanner = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const createJob = Joi.object({
  query: Joi.object({
    is_draft: Joi.boolean().optional()
  }),
  params: Joi.object({}),
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    salary: Joi.number().required(),
    sportId: Joi.number().required(),
    type: Joi.string()
      .valid(
        'SOCIAL_MEDIA',
        'MEET_AND_GREET',
        'AUTOGRAPHS',
        'PHOTO_SHOOTS',
        'OTHER',
        'GUEST_APPEARANCE'
      )
      .required()
  })
})

const publishJob = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    jobId: Joi.number().required()
  })
})

const updateJob = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    jobId: Joi.number().required()
  }),
  body: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    salary: Joi.number().optional(),
    sportId: Joi.number().optional(),
    type: Joi.string()
      .valid('SOCIAL_MEDIA', 'MEET_AND_GREET', 'AUTOGRAPHS', 'PHOTO_SHOOTS', 'OTHER')
      .optional()
  })
})

const deleteJob = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    jobId: Joi.number().required()
  }),
  body: Joi.object({})
})

export default {
  getAllJobs,
  getSingleJob,
  uploadJobBanner,
  createJob,
  publishJob,
  updateJob,
  deleteJob
}
