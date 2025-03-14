import ms from 'ms'
import { userService } from '../service/userService.js'

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      maxAge: ms('1d')
    })
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: ms('7d')
    })
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const createdUser = await userService.register(req.body)
    res.status(200).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const users = await userService.getAll()
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    res.cookie('accessToken', '', {
      httpOnly: true,
      expires: new Date(0), // Hết hạn ngay lập tức (ngày trong quá khứ)
      path: '/'
    })
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0), // Hết hạn ngay lập tức (ngày trong quá khứ)
      path: '/'
    })
    res.status(200).json({ message: 'Logout successfully' })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  login,
  register,
  getAll,
  verifyAccount,
  logout
}
