import Users from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await Users.findOne({
      username
    })

    if (!user) {
      return res.status(404).json('Wrong username/password')
    }

    const isMatch = bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(404).json('Wrong username/password')
    }

    const expiresTime = '2h'


    const accessToken = jwt.sign({
      _id: user._id,
      admin: user.admin
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: expiresTime
    })

    return res.status(200).json({
      _id: user._id,
      accessToken,
      tokenExpiresIn: expiresTime
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

const register = async (req, res) => {
  try {
    const { username, password, name } = req.body
    const existUser = await Users.findOne({
      username
    })
    if (!!existUser) {
      return res.status(400).json({
        status: 400,
        error: {
          message: 'User name already exist'
        }
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new Users({
      username,
      password: hashedPassword,
      name
    })
    const user = await newUser.save()

    res.status(201).json({
      status: 201,
      data: [
        {
          _id: user._id,
          username: user.username,
          name: user.name
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

export default {
  login,
  register
}