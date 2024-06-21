import Joi from 'joi'

const getAllAthleteRatings = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    athleteId: Joi.number().required()
  }),
  body: Joi.object({})
})

const giveRating = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    athleteId: Joi.number().required()
  }),
  body: Joi.object({
    jobId: Joi.number().required(),
    rating: Joi.number().min(1).max(5).required()
  })
})

export default {
  getAllAthleteRatings,
  giveRating
}
