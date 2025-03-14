import Joi from "joi";
import { GET_DB } from "../configs/mongodb.js";
import { ObjectId } from "mongodb";

// Tên collection
const productCollection = "Products";

// Định nghĩa schema validation bằng Joi
const productValidationSchema = Joi.object({
  productName: Joi.string().required().lowercase().trim(),
  imgUrl: Joi.string().allow("", null),
  price: Joi.number().required().default(0),
  isActive: Joi.boolean().default(true),
  description: Joi.string().allow("", null),
  colors: Joi.array().items(Joi.string()).default([]),
  categoryId: Joi.array().items(Joi.string().length(24).pattern(/^[0-9a-fA-F]{24}$/)).required(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null)
});

const getAllProduct = async () => {
  try {
    const result = await GET_DB().collection(productCollection).find().toArray()
    return result
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`)
  }
};

const createNewProduct = async (newProduct) => {
  try {
    const productData = {
      productName: newProduct.productName,
      imgUrl: newProduct.imgUrl,
      price: newProduct.price,
      description: newProduct.description,
      colors: newProduct.colors,
      categoryId:newProduct.categoryId,
      isActive: true,
      createdAt: Date.now(),
    };

    console.log("newProduct model", newProduct)
    const { error } = productValidationSchema.validate(productData)
    if (error) throw new Error(`Validation error: ${error.details[0].message}`)

    const existingProduct = await GET_DB().collection(productCollection).findOne({ productName: productData.productName })
    if (existingProduct) throw new Error("Product already exists")

    const finalProduct = {
      ...productData,
      categoryId: productData.categoryId.map(id => new ObjectId(id))
    }

    const result = await GET_DB().collection(productCollection).insertOne(finalProduct)
    return { _id: result.insertedId, ...finalProduct }
  } catch (error) {
    throw new Error(`Error creating product: ${error.message}`)
  }
}

const findByName = async (username) => {
  try {
    const result = await GET_DB().collection(userCollection).findOne({ username })
    return result;
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`)
  }
}

const deleteProduct = async (id) => {
  try {
    const result = await GET_DB().collection(productCollection).deleteOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(`Error deleting product: ${error.message}`)
  }
}

const getProductById = async (id) => {
  try {
    const result = await GET_DB().collection(productCollection).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(`Error fetching product: ${error.message}`)
  }
}

const updateProduct = async (id, updatedProduct) => {
  try {
    const productData = {
      productName: updatedProduct.productName,
      imgUrl: updatedProduct.imgUrl,
      price: updatedProduct.price,
      description: updatedProduct.description,
      colors: updatedProduct.colors,
      categoryId: updatedProduct.categoryId,
      isActive: updatedProduct.isActive,
      updatedAt: Date.now()
    };
    console.log("newProduct model update", updatedProduct)
    const { error } = productValidationSchema.validate(productData)
    if (error) throw new Error(`Validation error: ${error.details[0].message}`)

      if (productData.categoryId) {
        productData.categoryId = productData.categoryId.map(id => new ObjectId(id));
      }

    const result = await GET_DB().collection(productCollection).updateOne({ _id: new ObjectId(id) }, { $set: productData })
    return result
  } catch (error) {
    throw new Error(`Error updating product: ${error.message}`)
  }
}

const getProductsByCategoryId = async (id) => {
    try {
      const products = await GET_DB().collection(productCollection).find({ categoryId: new ObjectId(id) }).toArray()
      return products
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`)
    }
  }

export const productModel = {
  getAllProduct,
  createNewProduct,
  findByName,
  deleteProduct,
  getProductById,
  updateProduct,
  getProductsByCategoryId
}