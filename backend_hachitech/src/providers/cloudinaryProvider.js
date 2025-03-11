import {v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '../configs/environment.js'

//cấu hình cloudinary

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

// khởi tạo fun upload lên cloudinary

const streamUpload = (fileBuffer, forderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: forderName }, (error, result) => {
      if (result) {
        resolve(result)
      } else {
        reject(error)
      }
    })
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

export const CloudinaryProvider = {
  streamUpload
}