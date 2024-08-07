import Joi from 'joi'

const getAllFavoriteBusinesses = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const toggleMarkAsFavorite = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    businessId: Joi.number().required()
  })
})

export default {
  getAllFavoriteBusinesses,
  toggleMarkAsFavorite
}
