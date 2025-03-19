import ms from 'ms'
import { userService } from '../service/userService.js'

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      maxAge: ms('15m'),
    })
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: ms('7d'),
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

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      throw new Error('Refresh token is not found')
    }
    console.log("refreshToken", refreshToken)
    const result = await userService.refreshToken(refreshToken)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      maxAge: ms('15m'),
    })
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: ms('7d'),
    })
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      // Người dùng chưa đăng nhập
      return res.status(200).json({ user: null, message: 'Not logged in' });
    }
    const userId =  req.user._id
    //console.log("userId", userId)
    const user = await userService.getUserById(userId)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  login,
  register,
  getAll,
  verifyAccount,
  logout,
  refreshToken,
  getUserById,
  getMe
}
