import Joi from 'joi'

const getAllSports = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const createSport = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    name: Joi.string().optional()
  })
})

export default {
  getAllSports,
  createSport
}
