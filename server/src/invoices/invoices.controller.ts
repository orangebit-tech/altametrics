import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(
    @Request() req,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy = 'due_date',
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.invoicesService.findAll(
      req.user.userId,
      parseInt(page),
      parseInt(limit),
      sortBy as 'vendor_name' | 'amount' | 'due_date' | 'paid',
      order,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.invoicesService.findOne(id, req.user.userId);
  }
}
