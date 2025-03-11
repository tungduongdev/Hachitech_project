import express from 'express'
import { productController } from '../../controller/productController.js'
import { productValidation } from '../../validations/productValidation.js'
import { authMiddlewere } from '../../middleware/authMiddleware.js'
import { multerUploadMiddleware } from '../../middleware/multerUploadMiddleware.js'

const Router = express.Router()

Router.route('/create')
  .post(authMiddlewere.isAuthorized, authMiddlewere.isAuthorizedAndAdmin,multerUploadMiddleware.upload.single('imgUrl') ,productValidation.createNew, productController.createNew)
Router.route('/')
  .get(authMiddlewere.isAuthorized,  productController.getAll)
Router.route('/delete/:id')
  .delete(authMiddlewere.isAuthorized,authMiddlewere.isAuthorizedAndAdmin, productController.deleteProduct)
Router.route('/:id')
  .get(authMiddlewere.isAuthorized, productController.getProductById)
Router.route('/update/:id')
  .put(authMiddlewere.isAuthorized,authMiddlewere.isAuthorizedAndAdmin, multerUploadMiddleware.upload.single('imgUrl'),productValidation.updateProduct, productController.updateProduct)

export const productRoute = Router