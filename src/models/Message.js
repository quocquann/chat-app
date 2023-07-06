import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  message: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }
}, {
  timestamps: true
})

export default mongoose.model('Message', messageSchema)