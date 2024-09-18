import Joi from 'joi'

const getAllPackages = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

export default {
  getAllPackages
}
