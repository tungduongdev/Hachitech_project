import { userModel } from "../models/userModel.js"
import bcrypt from "bcrypt"
import { StatusCodes } from "http-status-codes"
import apiError from "../utils/apiError.js"
import 'dotenv/config'
import { env } from "../configs/environment.js"
import { jwtProvider } from "../providers/jwtProvider.js"

const login = async (reqBody) => {
  try {
    if (!reqBody.username || !reqBody.password) {
      throw new Error("Username và password là bắt buộc!")
    }

    const existUser = await userModel.findByName(reqBody.username)

    if (!existUser) {
      throw new Error("User not found")
    }

    const isPasswordCorrect = bcrypt.compare(reqBody.password, existUser.password)

    if (!isPasswordCorrect) {
      throw new Error("Password is wrong")
    }

    const userInfor = {
      _id: existUser._id,
      username: existUser.username,
      role: existUser.role
    }

    const accessToken = await jwtProvider.generateToken(
      userInfor,
      env.JWT_SECRET,
      env.JWT_EXPIRES_IN
    )

    const refreshToken = await jwtProvider.generateToken(
      userInfor,
      env.REFRESH_TOKEN_SECRET,
      env.REFRESH_TOKEN_LIFE
    )


    return {
      accessToken,
      refreshToken,
      userInfor
    }
  } catch (error) {
    throw new Error(error.message || error)
  }
}

const verifyAccount = async (reqBody) => {
  try {
    const existsUser = await userModel.findByName(reqBody.username)
    if (!existsUser) throw new apiError(StatusCodes.NOT_FOUND, 'User not found')
    if (existsUser.isActive) throw new apiError(StatusCodes.NOT_ACCEPTABLE, 'Account is already verified')
    if (reqBody.token !== existsUser.verifyToken) throw new apiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
    //update dữ liệu
    const updateData = {
      isActive: true,
      verifyToken: null
    }
    const updatedUser = await userModel.update(existsUser._id, updateData)
    return pickUser(updatedUser)
  } catch (error) {throw new Error(error)}
}


const register = async (reqBody) => {
  try {
    if (!reqBody.username || !reqBody.password) {
      throw new Error("Username và password là bắt buộc!")
    }

    const existUser = await userModel.findByName(reqBody.username)
    if (existUser) {
      throw new Error("User is already exist")
    }

    const hashedPassword = bcrypt.hashSync(reqBody.password, 10)
    const newUser = {
      username: reqBody.username,
      password: hashedPassword,
      role: reqBody.role || 'USER'
    }
    
    const createdUser = await userModel.createNew(newUser) 
    return createdUser
  } catch (error) {
    throw new Error(error.message || error) 
  }
}

const getAll = async () => {
  try {
    const users = userModel.getAllsUser()
    return users
  } catch (error) {
    throw new Error(error)
  }
}

export const userService = {
  login,
  register,
  getAll,
  verifyAccount
}