import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const authenToken = async (req, res, next) => {
  try {
    if (req.url === '/v1/auth/login' || req.url === '/v1/auth/register') {
      return next()
    }
    const token = req.headers.authorization?.split(" ")[1]
    const tokenPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(tokenPayload._id).exec()

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: {
          status: 404,
          message: 'user not found'
        }
      })
    }

    req.user = user
    next()

  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: {
        status: 500,
        message: err.message
      }
    })
  }
}


export default authenToken