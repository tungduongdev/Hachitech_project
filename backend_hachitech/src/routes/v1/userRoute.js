import express from 'express'
import { userController } from '../../controller/userController.js'
import { userValidation } from '../../validations/userValidation.js'
import { authMiddlewere } from '../../middleware/authMiddleware.js'

const Router = express.Router()

Router.route('/register')
  .post(userValidation.register, userController.register)
Router.route('/login')
  .post(userValidation.login, userController.login)
Router.route('/')
  .get(userController.getAll)
Router.route('/logout')
  .post(userController.logout)
Router.route('/refresh-token')
  .post(userController.refreshToken)
Router.route('/me')
  .get(authMiddlewere.isAuthorized, userController.getMe)

export const userRoute = Router