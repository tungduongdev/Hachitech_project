import { StatusCodes } from 'http-status-codes'
import { jwtProvider } from '../providers/jwtProvider.js'
import { env } from '../configs/environment.js'
import apiError from '../utils/apiError.js'

const isAuthorized = async (req, res, next) => {
  // lấy access token từ cookie
 console.log(req)
  console.log('Cookies:', req.cookies);
  const accessToken = req.cookies?.accessToken
  console.log('Access Token:', accessToken);
  // nếu không có access token thì trả về lỗi
  if (!accessToken) {
    next(new apiError(StatusCodes.UNAUTHORIZED, 'Access token not found'))
    return
  }

  try {
    // thực hiện giải mã token xem có hợp lệ không
    const accessTokenDecoded = await jwtProvider.verifyToken(accessToken, env.JWT_SECRET)
    // lưu thông tin user vào req để sử dụng ở các middleware khác
    req.jwtDecoded = accessTokenDecoded
    next()
  } catch (error) {
    // nếu access token hết hạn thì sẽ trả về lỗi
    if (error?.message?.includes('jwt expired')) {
      next(new apiError(StatusCodes.GONE, 'Need to refresh token'))
      return
    }
    next(new apiError(StatusCodes.UNAUTHORIZED, 'Invalid access token')) 
  }
}

const isAuthorizedAndAdmin = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken
  if (!accessToken) {
    next(new apiError(StatusCodes.UNAUTHORIZED, 'Access token not found'))
    return
  }
  try {
    const accessTokenDecoded = await jwtProvider.verifyToken(accessToken, env.JWT_SECRET)
    if (accessTokenDecoded.role !== 'admin') {
      next(new apiError(StatusCodes.FORBIDDEN, 'Admin role required'))
      return
    }
    req.jwtDecoded = accessTokenDecoded
    next()
  } catch (error) {
    next(new apiError(StatusCodes.UNAUTHORIZED, 'Invalid access token')) 
  }
}

export const authMiddlewere = {
  isAuthorized,
  isAuthorizedAndAdmin
}