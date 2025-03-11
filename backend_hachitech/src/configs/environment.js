import "dotenv/config"

export const env = {
  MONGO_URI: process.env.MONGODB_URI,
  PORT: process.env.APP_PORT,
  HOST: process.env.APP_HOST,
  DATABASE_NAME: process.env.DATABASE_NAME,

  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE

}