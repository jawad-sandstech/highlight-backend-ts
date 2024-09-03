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
router.get(
  '/:chatId/participants',
  authRequired(),
  validateRequest(chatsValidations.getAllParticipants),
  chatsControllers.getAllParticipants
)
router.get(
  '/:chatId/non-participants',
  authRequired(),
  validateRequest(chatsValidations.getAllNonParticipants),
  chatsControllers.getAllNonParticipants
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
  upload.array('attachments'),
  validateRequest(chatsValidations.createMessage),
  chatsControllers.createMessage
)
router.post(
  '/:chatId/add-members',
  authRequired(),
  validateRequest(chatsValidations.addMembersInGroup),
  chatsControllers.addMembersInGroup
)
router.post(
  '/:chatId/remove-members',
  authRequired(),
  validateRequest(chatsValidations.removeMembersFromGroup),
  chatsControllers.removeMembersFromGroup
)
router.patch(
  '/:chatId',
  authRequired(),
  validateRequest(chatsValidations.editGroup),
  chatsControllers.editGroup
)
router.delete(
  '/:chatId',
  authRequired(),
  validateRequest(chatsValidations.deleteGroup),
  chatsControllers.deleteGroup
)

export default router
