import { slugify } from "../utils/format.js"
import { productModel } from "../models/productModel.js"
import { StatusCodes } from "http-status-codes"
import { CloudinaryProvider } from "../providers/cloudinaryProvider.js"
import { ObjectId } from "mongodb"

const createNew = async (reqBody, productImg) => {
  try {
    //console.log("service", productImg)
    let imgUrl = ""

    if (productImg) {
      const uploadResult = await CloudinaryProvider.streamUpload(productImg.buffer, 'products')
      imgUrl = uploadResult.secure_url
      //console.log("uploadResult", uploadResult)
    }
    const newProduct = {
      ...reqBody,
      imgUrl,
      slug: slugify(reqBody.productName),
    }

    console.log("newProduct", newProduct)

    const createdProduct = await productModel.createNewProduct(newProduct)
    return createdProduct
  } catch (error) {
    throw new Error(error.message || error)
  }
}

const getAll = async () => {
  try {
    const products = await productModel.getAllProduct()
    return products
  } catch (error) {
    throw new Error(error.message || error)
  }
}

const deleteProduct = async (id) => {
  try {
    const deletedProduct = await productModel.deleteProduct(id)
    return deletedProduct
  } catch (error) {
    throw new Error(error.message || error)
  }
}

const getProductById = async (id) => {
  try {
    const product = await productModel.getProductById(id)
    return product
  } catch (error) {
    throw new Error(error.message || error)
  }
}

const updateProduct = async (id, updatedProduct, productImg) => {
  // console.log("img service",productImg)
  let imgUrl = ''

  if (productImg) {
      const uploadResult = await CloudinaryProvider.streamUpload(productImg.buffer, 'products')
      imgUrl = uploadResult.secure_url
  } else {
    imgUrl = updatedProduct.imgUrl
  }

  try {
    const updatedProductData = {
      ...updatedProduct,
      slug: slugify(updatedProduct.productName),
      description: updatedProduct.description,
      colors: updatedProduct.colors,
      imgUrl
    }

    //console.log(updatedProductData)

    const result = await productModel.updateProduct(id, updatedProductData)
    return updatedProductData
  } catch (error) {
    throw new Error(error.message || error)
  }
}

const getProductsByCategoryId = async (id) => {
  try {
    const products = await productModel.getProductsByCategoryId(id)
    return products
  } catch (error) {
    throw new Error(error.message || error)
  }
}

export const productService = {
  createNew,
  getAll,
  deleteProduct,
  getProductById,
  updateProduct,
  getProductsByCategoryId
}
