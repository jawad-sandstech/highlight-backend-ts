import Joi from 'joi'

const getAllNotifications = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

const getUnreadNotificationsCount = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({})
})

export default {
  getAllNotifications,
  getUnreadNotificationsCount
}
