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
    subject: Joi.string().required(),
    description: Joi.string().required(),
    images: Joi.array()
      .items(
        Joi.object({
          path: Joi.string().required()
        })
      )
      .optional()
  })
})

export default {
  getAllFeedbacks,
  uploadPicture,
  createFeedbacks
}
