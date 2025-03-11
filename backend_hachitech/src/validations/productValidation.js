import Joi from "joi"
import { StatusCodes } from "http-status-codes"
import apiError from "../utils/apiError.js"

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    productName: Joi.string().required(),
    price: Joi.number().required(),
    imgUrl: Joi.string().allow("").optional()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new apiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateProduct = async (req, res, next) => {
  //console.log("req from front",req.body)
  const correctCondition = Joi.object({
    productName: Joi.string(),
    price: Joi.number(),
    imgUrl: Joi.string().allow("").optional()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new apiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const productValidation = {
  createNew,
  updateProduct
}
