import Joi from 'joi'

const getUserPreferences = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const updateUserPreferences = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    receivePushNotifications: Joi.boolean().optional()
  })
})

export default {
  getUserPreferences,
  updateUserPreferences
}
