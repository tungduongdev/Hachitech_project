import express from 'express'
import { productController } from '../../controller/productController.js'
import { productValidation } from '../../validations/productValidation.js'
import { authMiddlewere } from '../../middleware/authMiddleware.js'
import { multerUploadMiddleware } from '../../middleware/multerUploadMiddleware.js'

const Router = express.Router()

Router.route('/create')
  .post(authMiddlewere.isAuthorized, authMiddlewere.isAuthorizedAndAdmin,multerUploadMiddleware.upload.single('imgUrl') ,productValidation.createNew, productController.createNew)
Router.route('/')
  .get(productController.getAll)
Router.route('/delete/:id')
  .delete(authMiddlewere.isAuthorized,authMiddlewere.isAuthorizedAndAdmin, productController.deleteProduct)
Router.route('/:id')
  .get(productController.getProductById)
Router.route('/update/:id')
  .put(authMiddlewere.isAuthorized,authMiddlewere.isAuthorizedAndAdmin, multerUploadMiddleware.upload.single('imgUrl'),productValidation.updateProduct, productController.updateProduct)
Router.route('/category-with-products/:id')
  .get(productController.getProductsByCategoryId)

export const productRoute = Router