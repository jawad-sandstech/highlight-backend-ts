import Joi from 'joi'

const uploadGallery = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const updateGallery = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    deleteItems: Joi.array().items(Joi.number()).min(0).required()
  })
})

export default {
  uploadGallery,
  updateGallery
}
