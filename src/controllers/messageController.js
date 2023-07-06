import Message from "../models/Message.js"
import Room from '../models/Room.js'
import User from '../models/User.js'


const createMessage = async (req, res) => {
  try {
    const { userId, roomId, message } = req.body
    const room = await Room.findById(roomId).exec()
    const user = await User.findById(userId).exec()


    if (!user) {
      return res.status(404).json({
        status: 404,
        error: {
          status: 404,
          message: 'user is not found'
        }
      })
    }

    else if (!room) {
      return res.status(404).json({
        status: 404,
        error: {
          status: 404,
          message: 'room is not found'
        }
      })
    }

    else if (!room.members.includes(userId)) {
      return res.status(400).json({
        status: 400,
        error: {
          status: 400,
          message: "user's not in this room"
        }
      })
    }

    const newMessage = new Message({
      user: userId,
      room: roomId,
      message
    })

    const msg = await newMessage.save()

    await Room.updateOne(
      {
        _id: roomId
      },
      {
        $push: {
          messages: newMessage._id
        }
      }
    ).exec()

    return res.status(201).json({
      status: 201,
      data: [
        {
          message: msg
        }
      ]
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      status: 500,
      error: {
        status: 500,
        message: err.message
      }
    })
  }
}


const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params
    const { editedMessage } = req.body

    const message = await Message.findById(messageId).exec()
    if (!message) {
      return res.status(404).json({
        status: 404,
        error: {
          status: 404,
          message: 'message not found'
        }
      })
    }

    await Message.updateOne(
      {
        _id: messageId,
      },
      {
        $set: {
          message: editedMessage
        }
      }
    ).exec()


    res.status(201).json({
      status: 201,
      data: []
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: 500,
      error: {
        status: 500,
        message: err.message
      }
    })
  }
}


const getMessagesByRoomId = async (req, res) => {
  try {
    const { roomId } = req.query

    const room = await Room.findById(roomId).exec()


    if (!room) {
      return res.status(404).json({
        status: 404,
        error: {
          status: 404,
          message: 'room is not found'
        }
      })
    }

    const messages = await Message.find({
      _id: {
        $in: room.messages
      }
    }).exec()

    return res.status(200).json({
      status: 200,
      data: [
        ...messages
      ]
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: {
        message: err.message
      }
    })
  }
}

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params

    const message = await Message.findById(messageId).exec()

    if (!message) {
      return res.status(404).json({
        status: 404,
        error: {
          status: 404,
          message: 'message not found'
        }
      })
    }

    if (message.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: 401,
        error: {
          status: 401,
          message: "Unauthorized"
        }
      })
    }

    await User.updateOne(
      {
        _id: req.user._id
      },
      {
        $pull: {
          messages: messageId
        }
      }
    ).exec()

    await Message.deleteOne({
      _id: messageId
    }).exec()

    return res.status(200).json({
      stautus: 200,
      data: []
    })

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      status: 500,
      error: {
        status: 500,
        message: err.message
      }
    })
  }
}


export default {
  createMessage,
  getMessagesByRoomId,
  editMessage,
  deleteMessage
}