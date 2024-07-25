import Joi from 'joi'

const getAllAthletes = Joi.object({
  query: Joi.object({
    type: Joi.string().valid('New', 'Popular', 'Regional').optional(),
    sportIds: Joi.string().optional(),
    instagramFollowersGreaterThan: Joi.number().optional(),
    rating: Joi.number().optional(),
    distance: Joi.number().optional(),
    isUniversityAthlete: Joi.boolean().optional(),
    take: Joi.string().optional()
  }),
  params: Joi.object({}),
  body: Joi.object({})
})

const getSingleAthlete = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    athleteId: Joi.number().required()
  }),
  body: Joi.object({})
})

export default {
  getAllAthletes,
  getSingleAthlete
}
