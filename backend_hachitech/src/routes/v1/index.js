import express from 'express'
import { userRoute } from './userRoute.js'
import { productRoute } from './productRoute.js'
import { categoryRoute } from './categoryRoute.js'

const Router = express.Router()

Router.get('/status', (req, res) => res.status(200).json({ message: 'Ready to use' }))

Router.get('/', (req, res) => res.status(200).json({ message: 'Welcome to the API' }))

Router.use('/users', userRoute)

Router.use('/products', productRoute)

Router.use('/categories', categoryRoute)

export const APIs_v1 = Router