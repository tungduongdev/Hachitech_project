/* eslint-disable no-console */
import 'dotenv/config'
import express from 'express'
import exitHook from 'exit-hook'
import { CONNECT_DB, CLOSE_DB } from './src/configs/mongodb.js'
import { env } from './src/configs/environment.js'
import { APIs_v1 } from './src/routes/v1/index.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const START_SERVER = () => {
  const app = express()
  // fix cache from disk của express
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  //enable cors
  app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true
  }))
  //enable req.body json data
  app.use(express.json())

  app.use(cookieParser())

  app.use('/api/v1', APIs_v1)

  app.listen(env.PORT, env.HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello TUNG DUONG, I am running at http:${env.HOST}:${env.PORT}`)
  })

  // thuc hien cac tac vu cleanup khi server dung
  exitHook(() => {
    console.log('Closing MongoDB ...')
    CLOSE_DB()
    console.log('MongoDB closed successfully!')
  })
}
// chi start server khi da connect toi database
(async () => {
  try {
    console.log('Trying connect to MongoDB ...')
    await CONNECT_DB()
    console.log('Connected to MongoDB successfully!')
    START_SERVER()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0)
  }
})()
