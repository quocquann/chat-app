import express from 'express'
import roomController from '../controllers/roomController.js'

const router = express.Router()

router.post('/createRoom', roomController.createRoom)
router.get('/getRoomsByUserId', roomController.getRoomsByUserId)
router.put('/addMemberToRoom/:roomId', roomController.addMemberToRoom)
router.put('/deleteMember/:roomId', roomController.deleteMember)


export default router