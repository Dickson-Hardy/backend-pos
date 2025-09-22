import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ShiftsController } from './shifts.controller'
import { ShiftsService } from './shifts.service'
import { Shift, ShiftSchema } from '../../schemas/shift.schema'
import { Expense, ExpenseSchema } from '../../schemas/expense.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shift.name, schema: ShiftSchema },
      { name: Expense.name, schema: ExpenseSchema },
    ]),
  ],
  controllers: [ShiftsController],
  providers: [ShiftsService],
  exports: [ShiftsService],
})
export class ShiftsModule {}