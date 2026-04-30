import { Post, Body, Controller, Get, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDTO } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UpdateLeadStatusDTO } from './dto/update-lead-status.dto';
import { MarkLeadAsLostDTO } from './dto/mark-status-as-lost.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() createLeadDto: CreateLeadDTO) {
    return this.leadsService.create(createLeadDto);
  }

  @Get()
  findAll() {
    return this.leadsService.findAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateLeadStatusDto: UpdateLeadStatusDTO) {
    return this.leadsService.updateStatus(id, updateLeadStatusDto);
  }

  @Patch(':id/lost')
  markAsLost(@Param('id', ParseIntPipe) id: number, @Body() markAsLostDto: MarkLeadAsLostDTO) {
    return this.leadsService.markAsLost(id, markAsLostDto);
  }

  @Patch(':id/convert')
  convertLead(@Param('id', ParseIntPipe) id: number) {
    return this.leadsService.convertLead(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leadsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.updateLead(id, updateLeadDto);
  }
}
