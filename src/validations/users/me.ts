import Joi from 'joi'

const getMyProfile = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const stripeOnboard = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const uploadPicture = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const uploadAttachment = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const updateProfile = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    fullName: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
    address: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    zoomId: Joi.string().optional(),
    fcmToken: Joi.string().optional()
  })
})

const updateAthleteInfo = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    instagramUsername: Joi.string().optional(),
    schoolName: Joi.string().optional(),
    universityName: Joi.string().optional(),
    sportId: Joi.number().optional(),
    experience: Joi.string()
      .valid(
        'BEGINNER',
        'INTERMEDIATE',
        'ADVANCED',
        'EXPERT',
        'ELITE',
        'RECREATIONAL',
        'SEMI_PROFESSIONAL',
        'PROFESSIONAL'
      )
      .optional(),
    position: Joi.string().optional(),
    bio: Joi.string().optional(),
    attachment: Joi.string().optional(),
    gallery: Joi.array()
      .items(Joi.object({ path: Joi.string().required() }))
      .min(1)
      .max(6)
      .optional(),
    athleticAchievements: Joi.array()
      .items(
        Joi.object({
          gameName: Joi.string().required(),
          medalCount: Joi.number().required()
        })
      )
      .min(1)
      .optional()
  })
})

const updateBusinessInfo = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    organizationName: Joi.string().optional(),
    industryType: Joi.string().optional(),
    founded: Joi.string().optional(),
    overview: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    email: Joi.string().optional(),
    website: Joi.string().optional(),
    address: Joi.string().optional(),
    zoomId: Joi.string().optional()
  })
})

const deleteAccount = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

export default {
  getMyProfile,
  stripeOnboard,
  updateProfile,
  uploadAttachment,
  uploadPicture,
  updateAthleteInfo,
  updateBusinessInfo,
  deleteAccount
}
