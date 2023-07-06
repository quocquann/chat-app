import Room from '../models/Room.js'
import User from '../models/User.js'

const createRoom = async (req, res) => {
  try {
    const { name, userId } = req.body
    const newRoom = new Room({
      name,
      createdBy: userId,
      members: [userId]
    })

    const room = await newRoom.save()

    await User.updateOne({
      _id: userId
    }, {
      $push: {
        rooms: room._id
      }
    }).exec()

    return res.status(201).json({
      status: 201,
      data: [
        {
          ...room['_doc']
        }
      ]
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      status: 500,
      error: {
        message: err.message
      }
    })
  }
}

const getRoomsByUserId = async (req, res) => {
  try {

    const { userId } = req.query
    const user = await User.findById(userId).exec()


    if (!user) {
      return res.status(404).json({
        status: 404,
        error: {
          status: 404,
          message: 'user not found'
        }
      })
    }
    else if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: 401,
        error: {
          status: 401,
          message: 'Unauthorized'
        }
      })
    }

    const rooms = await Room.find(
      {
        _id: {
          $in: user.rooms
        }
      }
    ).exec()

    return res.status(200).json({
      status: 200,
      data: [
        ...rooms
      ]
    })

  } catch (err) {
    console.log(err)
    return res.stauts(500).json({
      status: 500,
      error: {
        status: 500,
        message: err.message
      }
    })
  }
}

const addMemberToRoom = async (req, res) => {
  try {
    const { roomId } = req.params
    const { newMembers } = req.body

    const room = await Room.findById(roomId).exec()
    if (!room) {
      return res.status(404).json({
        status: 404,
        error: {
          status: 404,
          message: 'room not found'
        }
      })
    }

    await Room.updateOne(
      {
        _id: roomId
      },
      {
        $push: {
          members: newMembers
        }
      }
    ).exec()

    await User.updateMany(
      {
        _id: {
          $in: newMembers
        }
      },
      {
        $push: {
          rooms: roomId
        }
      }
    ).exec()

    return res.status(200).json({
      status: 200,
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

const deleteMember = async (req, res) => {
  try {
    const { roomId } = req.params
    const { deletedUserId } = req.body
    const room = await Room.findById(roomId).exec()
    const deletedUser = await User.findById(deletedUserId).exec()

    if (!room) {
      return res.status(404).json({
        status: 404,
        error: {
          status: 404,
          message: 'room not found'
        }
      })
    }

    if (!deletedUser) {
      return res.status(401).json({
        status: 401,
        error: {
          status: 401,
          message: 'deleted user not found'
        }
      })
    }

    if (!room.members.includes(deletedUserId)) {
      return res.status(400).json({
        status: 400,
        error: {
          status: 400,
          message: 'user you wanna del not in this room'
        }
      })
    }



    if (!room.members.includes(req.user._id)) {
      return res.status(401).json({
        status: 401,
        error: {
          status: 401,
          message: 'Unauthorized'
        }
      })
    }


    await Room.updateOne(
      {
        _id: roomId
      },
      {
        $pull: {
          members: deletedUserId
        }
      }
    )

    await User.updateOne(
      {
        _id: deletedUserId
      },
      {
        $pull: {
          rooms: roomId
        }
      }
    )

    return res.status(200).json({
      status: 200,
      data: []
    })

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

export default {
  createRoom,
  getRoomsByUserId,
  addMemberToRoom,
  deleteMember
}