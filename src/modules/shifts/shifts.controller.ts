import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Request
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { ShiftsService } from './shifts.service'
import { CreateShiftDto } from './dto/create-shift.dto'
import { EndShiftDto } from './dto/end-shift.dto'
import { CreateExpenseDto } from './dto/create-expense.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('shifts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @ApiOperation({ summary: 'Start a new shift' })
  createShift(@Body() createShiftDto: CreateShiftDto, @Request() req) {
    const { outletId } = req.user
    return this.shiftsService.createShift(createShiftDto, req.user.id, outletId)
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current active shift' })
  getCurrentShift(@Request() req) {
    return this.shiftsService.getCurrentShift(req.user.id)
  }

  @Get('daily')
  @ApiOperation({ summary: 'Get daily shifts for outlet' })
  @ApiQuery({ name: 'date', required: true, description: 'Date in YYYY-MM-DD format' })
  getDailyShifts(@Query('date') date: string, @Request() req) {
    const { outletId } = req.user
    return this.shiftsService.getDailyShifts(outletId, date)
  }

  @Get('daily/summary')
  @ApiOperation({ summary: 'Get daily shift summary' })
  @ApiQuery({ name: 'date', required: true, description: 'Date in YYYY-MM-DD format' })
  getDailySummary(@Query('date') date: string, @Request() req) {
    const { outletId } = req.user
    return this.shiftsService.getDailySummary(outletId, date)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shift by ID' })
  getShiftById(@Param('id') id: string, @Request() req) {
    return this.shiftsService.getShiftById(id, req.user.id)
  }

  @Get(':id/report')
  @ApiOperation({ summary: 'Get detailed shift report' })
  getShiftReport(@Param('id') id: string, @Request() req) {
    return this.shiftsService.getShiftReport(id, req.user.id)
  }

  @Put(':id/end')
  @ApiOperation({ summary: 'End a shift' })
  endShift(@Param('id') id: string, @Body() endShiftDto: EndShiftDto, @Request() req) {
    return this.shiftsService.endShift(id, endShiftDto, req.user.id)
  }

  @Post(':id/expenses')
  @ApiOperation({ summary: 'Add expense to shift' })
  addExpense(@Param('id') id: string, @Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.shiftsService.addExpense(id, createExpenseDto, req.user.id)
  }

  @Get(':id/expenses')
  @ApiOperation({ summary: 'Get shift expenses' })
  getShiftExpenses(@Param('id') id: string, @Request() req) {
    return this.shiftsService.getShiftExpenses(id, req.user.id)
  }
}