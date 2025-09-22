import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class EndShiftDto {
  @ApiProperty({ description: 'Closing cash balance' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  closingBalance: number

  @ApiProperty({ description: 'Optional notes for ending the shift', required: false })
  @IsOptional()
  @IsString()
  notes?: string
}
