import { productService } from "../service/productService.js"
import { OK, StatusCodes } from "http-status-codes"

const createNew = async (req, res, next) => {
  try {
    const productImg = req.file
    //console.log(productImg)
    //dieu huong du lieu sang tang service
    const createNewProduct = await productService.createNew(req.body, productImg)
    //co ket qua thif tra ve phia client
    res.status(StatusCodes.CREATED).json(createNewProduct)
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
      const products = await productService.getAll()
      res.status(StatusCodes.OK).json(products)
    } catch (error) {
      next(error)
    }
}

const deleteProduct = async (req, res, next) => {
  try {
    const deleteProduct = await productService.deleteProduct(req.params.id)
    res.status(StatusCodes.OK).json(deleteProduct)
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id)
    res.status(StatusCodes.OK).json(product)
  } catch (error) {
    next(error)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const productImg = req.file
    // console.log("productImg controller",productImg)
    // console.log("controller",req.body)
    const updateProduct = await productService.updateProduct(req.params.id, req.body, productImg)
    res.status(StatusCodes.OK).json(updateProduct)
  } catch (error) {
    next(error)
  }
}
export const productController = {
  createNew,
  getAll,
  deleteProduct,
  getProductById,
  updateProduct
}