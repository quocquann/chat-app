import mongoose from 'mongoose'

const connect = async () => {
  try {
    debugger
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connect to mongoDb successfully')
  } catch (err) {
    debugger
    if (err.code === 8000) {
      throw new Error('Cannot connect ot Mongodb, wrong usename or password')
    }
    if (err.code === 'ENOTFOUND') {
      throw new Error('Cannot connect ot Mongodb, wrong host name')
    }

  }
}

export default connect