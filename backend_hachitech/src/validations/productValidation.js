import Joi from "joi"
import { StatusCodes } from "http-status-codes"
import apiError from "../utils/apiError.js"

const createNew = async (req, res, next) => {
  console.log("req from front",req.body)

  if (typeof req.body.colors === "string") {
    try {
      req.body.colors = JSON.parse(req.body.colors);
    } catch (error) {
      return next(new apiError(StatusCodes.UNPROCESSABLE_ENTITY, "Invalid colors format"));
    }
  }

  console.log("req from front2",req.body)
  const correctCondition = Joi.object({
    productName: Joi.string().required(),
    price: Joi.number().required(),
    imgUrl: Joi.string().allow("").optional(),
    description: Joi.string().allow("").optional(),
    colors: Joi.array().items(Joi.string()).default([]),
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
  if (typeof req.body.colors === "string") {
    try {
      req.body.colors = JSON.parse(req.body.colors);
    } catch (error) {
      return next(new apiError(StatusCodes.UNPROCESSABLE_ENTITY, "Invalid colors format"));
    }
  }
  const correctCondition = Joi.object({
    productName: Joi.string(),
    price: Joi.number(),
    imgUrl: Joi.string().allow("").optional(),
    description: Joi.string().allow("").optional(),
    colors: Joi.array().items(Joi.string()).default([])
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
