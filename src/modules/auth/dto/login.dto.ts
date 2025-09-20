import { IsEmail, IsString, MinLength, Matches } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {
  @ApiProperty({ example: "user@pharmacy.com" })
  @IsEmail()
  email: string

  @ApiProperty({ 
    example: "SecurePass123!",
    description: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  })
  password: string
}
