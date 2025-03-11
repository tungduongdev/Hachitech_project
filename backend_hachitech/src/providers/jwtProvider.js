import JWT from 'jsonwebtoken'

const generateToken = (user, secret, tokenLife) => {
  try {
    return JWT.sign(user, secret, { algorithm: 'HS256', expiresIn : tokenLife })
  } catch (error) {
    throw new Error(error)
  }
}

const verifyToken = (token, secret) => {
  try {
    return JWT.verify(token, secret)
  } catch (error) {
    throw new Error(error)
  }
}

const refreshToken = (token, secret, tokenLife) => {
  try {
    const decoded = JWT.verify(token, secret)
    const newToken = generateToken(decoded, secret, tokenLife)
    return newToken
  } catch (error) {
    throw new Error(error)
  }
}

export const jwtProvider = {
  generateToken,
  verifyToken,
  refreshToken
}