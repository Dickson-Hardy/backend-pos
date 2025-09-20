import { IsString, IsEmail, IsOptional, IsObject } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateOutletDto {
    @ApiProperty({ example: "Main Pharmacy Branch" })
    @IsString()
    name: string

    @ApiProperty({ example: "123 Main Street" })
    @IsString()
    address: string

    @ApiProperty({ example: "New York" })
    @IsString()
    city: string

    @ApiProperty({ example: "NY" })
    @IsString()
    state: string

    @ApiProperty({ example: "10001" })
    @IsString()
    zipCode: string

    @ApiProperty({ example: "+1-555-0123" })
    @IsString()
    phone: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    email?: string

    @ApiProperty({ example: "PH-2024-001" })
    @IsString()
    licenseNumber: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    managerId?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    operatingHours?: {
        open: string
        close: string
        days: string[]
    }
}