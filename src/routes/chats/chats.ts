import express from 'express'
import multer from 'multer'

import storage from '../../config/multer.config'

import authRequired from '../../middlewares/authRequired.middleware'
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
  '/',
  authRequired(),
  upload.single('attachment'),
  validateRequest(chatsValidations.createMessage),
  chatsControllers.createMessage
)

export default router
