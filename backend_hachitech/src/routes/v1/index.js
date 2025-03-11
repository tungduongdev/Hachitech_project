import express from 'express'
import { userRoute } from './userRoute.js'
import { productRoute } from './productRoute.js'

const Router = express.Router()

Router.get('/status', (req, res) => res.status(200).json({ message: 'Ready to use' }))

Router.get('/', (req, res) => res.status(200).json({ message: 'Welcome to the API' }))

Router.use('/users', userRoute)

Router.use('/products', productRoute)

export const APIs_v1 = Router