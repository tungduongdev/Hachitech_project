import Joi from "joi"
import { StatusCodes } from "http-status-codes"
import apiError from "../utils/apiError.js"

const createNew = async (req, res, next) => {

  const correctCondition = Joi.object({
    categoryName: Joi.string().required(),
    description: Joi.string().allow("").optional(),
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new apiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateCategory = async (req, res, next) => {
  const correctCondition = Joi.object({
    categoryName: Joi.string(),
    description: Joi.string().allow("").optional(),
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new apiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const categoryValidation = {
  createNew,
  updateCategory
}