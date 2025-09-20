import { Controller, Post, UseInterceptors, UseGuards } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { UploadsService } from "./uploads.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { Express } from "express"

@ApiTags("uploads")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("uploads")
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post()
  @ApiOperation({ summary: "Upload file" })
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(file: Express.Multer.File) {
    const fileType = file.mimetype.startsWith("image/") ? "image" : "document"
    const url =
      fileType === "image"
        ? await this.uploadsService.uploadImage(file)
        : await this.uploadsService.uploadDocument(file)

    return { url }
  }

  @Post("image")
  @ApiOperation({ summary: "Upload image file" })
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(file: Express.Multer.File) {
    const url = await this.uploadsService.uploadImage(file)
    return { url }
  }
}
