import { Injectable } from "@nestjs/common"
import { v2 as cloudinary } from "cloudinary"
import type { Express } from "express"

@Injectable()
export class UploadsService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }

  async uploadImage(file: Express.Multer.File, folder = "pharmacy-pos"): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
            transformation: [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }, { format: "webp" }],
          },
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result.secure_url)
            }
          },
        )
        .end(file.buffer)
    })
  }

  async uploadDocument(file: Express.Multer.File, folder = "pharmacy-pos/documents"): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "raw",
          },
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result.secure_url)
            }
          },
        )
        .end(file.buffer)
    })
  }

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId)
  }
}
