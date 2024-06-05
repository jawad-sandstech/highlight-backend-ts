import Joi from 'joi'

const getAllFeedbacks = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const uploadPicture = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const createFeedbacks = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    text: Joi.string().required(),
    images: Joi.array()
      .items(
        Joi.object({
          path: Joi.string().required()
        })
      )
      .min(1)
      .required()
  })
})

export default {
  getAllFeedbacks,
  uploadPicture,
  createFeedbacks
}
