import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { ReceiptTemplatesService } from './receipt-templates.service'
import { CreateReceiptTemplateDto } from './dto/create-receipt-template.dto'
import { UpdateReceiptTemplateDto } from './dto/update-receipt-template.dto'
import { TemplateStatus } from '../../schemas/receipt-template.schema'

@Controller('receipt-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReceiptTemplatesController {
  constructor(private readonly receiptTemplatesService: ReceiptTemplatesService) {}

  @Post()
  @Roles('admin', 'manager')
  create(@Body() createReceiptTemplateDto: CreateReceiptTemplateDto, @Request() req) {
    return this.receiptTemplatesService.create(createReceiptTemplateDto, req.user.userId)
  }

  @Get()
  @Roles('admin', 'manager', 'cashier')
  findAll(
    @Query('outletId') outletId?: string,
    @Query('status') status?: TemplateStatus
  ) {
    return this.receiptTemplatesService.findAll(outletId, status)
  }

  @Get('default/:outletId')
  @Roles('admin', 'manager', 'cashier')
  findDefault(@Param('outletId') outletId: string) {
    return this.receiptTemplatesService.findDefault(outletId)
  }

  @Get(':id')
  @Roles('admin', 'manager', 'cashier')
  findOne(@Param('id') id: string) {
    return this.receiptTemplatesService.findOne(id)
  }

  @Get(':id/preview')
  @Roles('admin', 'manager', 'cashier')
  preview(@Param('id') id: string, @Body() sampleData?: any) {
    return this.receiptTemplatesService.preview(id, sampleData)
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  update(
    @Param('id') id: string,
    @Body() updateReceiptTemplateDto: UpdateReceiptTemplateDto,
    @Request() req
  ) {
    return this.receiptTemplatesService.update(id, updateReceiptTemplateDto, req.user.userId)
  }

  @Post(':id/duplicate')
  @Roles('admin', 'manager')
  duplicate(@Param('id') id: string, @Request() req) {
    return this.receiptTemplatesService.duplicate(id, req.user.userId)
  }

  @Patch(':id/set-default')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  setAsDefault(@Param('id') id: string) {
    return this.receiptTemplatesService.setAsDefault(id)
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.receiptTemplatesService.remove(id)
  }
}