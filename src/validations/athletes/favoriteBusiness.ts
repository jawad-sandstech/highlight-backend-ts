import Joi from 'joi'

const markAsFavorite = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    businessId: Joi.number().required()
  })
})

const deleteAsFavorite = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    businessId: Joi.number().required()
  }),
  body: Joi.object({})
})

export default {
  markAsFavorite,
  deleteAsFavorite
}
