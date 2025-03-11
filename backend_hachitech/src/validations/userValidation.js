import Joi from "joi"

const login = async (req, res, next) => {
  const corectCondition = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })

  try {
    await corectCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    res.status(400).json({
      message: error.details.map((err) => err.message)
    })
  }
}

const register = async (req, res, next) => {
  const corectCondition = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })

  try {
    await corectCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    res.status(400).json({
      message: error.details.map((err) => err.message)
    })
  }
}

const verifyAccount = async (req, res, next) => {
  const correctCondition = Joi.object({
    username: Joi.string().required(),
    token: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const userValidation = {
  login,
  register,
  verifyAccount
}