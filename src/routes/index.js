import authRoute from './auth.js'
import messageRoute from './message.js'
import roomRoute from './room.js'

const route = (app) => {
  app.use('/v1/auth', authRoute)
  app.use('/v1/message', messageRoute)
  app.use('/v1/room', roomRoute)
}

export default route