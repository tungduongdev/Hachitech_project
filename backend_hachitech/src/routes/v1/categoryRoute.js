import express from 'express'
import { categoryController } from '../../controller/categoryController.js'
import { categoryValidation } from '../../validations/categoryValidation.js'
import { authMiddlewere } from '../../middleware/authMiddleware.js'

const Router = express.Router()

Router.route('/create')
  .post(authMiddlewere.isAuthorized, authMiddlewere.isAuthorizedAndAdmin,categoryValidation.createNew, categoryController.createNew)
Router.route('/')
  .get(categoryController.getAll)
Router.route('/delete/:id')
  .delete(authMiddlewere.isAuthorized,authMiddlewere.isAuthorizedAndAdmin, categoryController.deleteCategory)
Router.route('/:id')
  .get(categoryController.getCategoryById)
Router.route('/update/:id')
  .put(authMiddlewere.isAuthorized,authMiddlewere.isAuthorizedAndAdmin,categoryValidation.updateCategory, categoryController.updateCategory)

export const categoryRoute = Router