import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateShiftDto {
  @ApiProperty({ description: 'Opening cash balance' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  openingBalance: number

  @ApiProperty({ description: 'Optional notes for the shift', required: false })
  @IsOptional()
  @IsString()
  notes?: string
}
