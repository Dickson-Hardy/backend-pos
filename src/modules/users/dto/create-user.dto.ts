import { IsString, IsEmail, IsEnum, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "../../../schemas/user.schema"

export class CreateUserDto {
  @ApiProperty({ example: "John" })
  @IsString()
  firstName: string

  @ApiProperty({ example: "Doe" })
  @IsString()
  lastName: string

  @ApiProperty({ example: "john.doe@pharmacy.com" })
  @IsEmail()
  email: string

  @ApiProperty({ example: "securePassword123" })
  @IsString()
  password: string

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  outletId?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar?: string
}