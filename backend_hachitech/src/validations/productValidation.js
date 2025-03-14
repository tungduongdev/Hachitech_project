import Joi from "joi"
import { StatusCodes } from "http-status-codes"
import apiError from "../utils/apiError.js"

const createNew = async (req, res, next) => {
  console.log("req from front", req.body);

  if (typeof req.body.categoryId === "string") {
    try {
      req.body.categoryId = JSON.parse(req.body.categoryId);
    } catch (error) {
      return next(new apiError(StatusCodes.UNPROCESSABLE_ENTITY, "Invalid categoryId format"));
    }
  }

  // Xử lý colors nếu là string JSON
  if (typeof req.body.colors === "string") {
    try {
      req.body.colors = JSON.parse(req.body.colors);
    } catch (error) {
      return next(new apiError(StatusCodes.UNPROCESSABLE_ENTITY, "Invalid colors format"));
    }
  }

  //console.log("cate old", req.body.category);

  //console.log("req from front2", req.body);

  const correctCondition = Joi.object({
    productName: Joi.string().required(),
    price: Joi.number().required(),
    imgUrl: Joi.string().allow("").optional(),
    categoryId: Joi.array().items(Joi.string().length(24).pattern(/^[0-9a-fA-F]{24}$/)).required(),
    description: Joi.string().allow("").optional(),
    colors: Joi.array().items(Joi.string()).default([]),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new apiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};


const updateProduct = async (req, res, next) => {
  //console.log("req from front",req.body)
  if (typeof req.body.colors === "string") {
    try {
      req.body.colors = JSON.parse(req.body.colors);
    } catch (error) {
      return next(new apiError(StatusCodes.UNPROCESSABLE_ENTITY, "Invalid colors format"));
    }
  }
  if (typeof req.body.categoryId === "string") {
    try {
      req.body.categoryId = JSON.parse(req.body.categoryId);
    } catch (error) {
      return next(new apiError(StatusCodes.UNPROCESSABLE_ENTITY, "Invalid categoryId format"));
    }
  }
  const correctCondition = Joi.object({
    productName: Joi.string(),
    price: Joi.number(),
    imgUrl: Joi.string().allow("").optional(),
    categoryId: Joi.array().items(Joi.string().length(24).pattern(/^[0-9a-fA-F]{24}$/)).required(),
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
