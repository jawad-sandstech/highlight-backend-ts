import Joi from 'joi'

const uploadGallery = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

export default {
  uploadGallery
}
