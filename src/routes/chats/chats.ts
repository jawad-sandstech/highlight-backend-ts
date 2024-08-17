import express from 'express'
import multer from 'multer'

import storage from '../../config/multer.config'

import authRequired from '../../middlewares/authRequired.middleware'
import rolesRequired from '../../middlewares/rolesRequired.middleware'
import validateRequest from '../../middlewares/validateRequest.middleware'

import chatsValidations from '../../validations/chats/chats'
import chatsControllers from '../../controllers/chats/chats.controllers'

const router = express.Router()

const upload = multer({ storage })

router.get(
  '/',
  authRequired(),
  validateRequest(chatsValidations.getAllChats),
  chatsControllers.getAllChats
)
router.get(
  '/:chatId',
  authRequired(),
  validateRequest(chatsValidations.getAllMessages),
  chatsControllers.getAllMessages
)
router.post(
  '/private',
  authRequired(),
  rolesRequired(['BUSINESS']),
  validateRequest(chatsValidations.createPrivateChat),
  chatsControllers.createPrivateChat
)
router.post(
  '/group',
  authRequired(),
  rolesRequired(['BUSINESS']),
  validateRequest(chatsValidations.createGroupChat),
  chatsControllers.createGroupChat
)
router.post(
  '/:chatId',
  authRequired(),
  upload.single('attachment'),
  validateRequest(chatsValidations.createMessage),
  chatsControllers.createMessage
)

export default router
