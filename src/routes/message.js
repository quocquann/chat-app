import express from 'express'
import messageController from '../controllers/messageController.js'

const router = express.Router()

router.post('/createMessage', messageController.createMessage)
router.get('/getMessagesByRoomId', messageController.getMessagesByRoomId)
router.put('/editMessage/:messageId', messageController.editMessage)
router.delete('/deleteMessage/:messageId', messageController.deleteMessage)

export default router