import Joi from 'joi'

const getAllSportSubCategories = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

export default {
  getAllSportSubCategories
}
