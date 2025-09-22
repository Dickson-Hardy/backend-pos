import { IsNotEmpty, IsNumber, IsString, IsEnum, Min, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateExpenseDto {
  @ApiProperty({ description: 'Expense amount' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number

  @ApiProperty({ description: 'Expense description' })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({ 
    description: 'Expense category',
    enum: ['operational', 'maintenance', 'supplies', 'other']
  })
  @IsNotEmpty()
  @IsEnum(['operational', 'maintenance', 'supplies', 'other'])
  category: 'operational' | 'maintenance' | 'supplies' | 'other'

  @ApiProperty({ description: 'Receipt number', required: false })
  @IsOptional()
  @IsString()
  receiptNumber?: string

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string
}
