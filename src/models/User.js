import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String
  },
  admin: {
    type: Boolean,
    default: false
  },
  rooms: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
      }
    ],
    default: []
  },
  messages: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
      }
    ],
    default: []
  }
}, {
  timestamps: true
})

export default mongoose.model('User', userSchema)