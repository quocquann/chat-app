import express from 'express'
import dotenv from 'dotenv'
import connect from './database/connect.js'
import route from './routes/index.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import authenToken from './middlewares/authenToken.js'

dotenv.config()

const PORT = process.env.PORT

const app = express()

app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(authenToken)

route(app)

app.listen(PORT, async () => {
  try {
    await connect()
    console.log(`Server listening on port ${PORT}`)
  } catch (err) {
    console.error(err)
  }
})


