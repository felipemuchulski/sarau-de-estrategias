import { Post, Body, Controller, Get, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDTO } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/updated-lead.dto';
import { UpdateLeadStatusDTO } from './dto/updated-lead-status.dto';
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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leadsService.findOneBy(id);
  }

  @Patch('/update_lead/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.updateLead(id, updateLeadDto);
  }

  @Patch('/update_status_lead/:id')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateLeadStatusDto: UpdateLeadStatusDTO) {
    return this.leadsService.updateStatus(id, updateLeadStatusDto);
  }

  @Patch('/mark_as_lost/:id')
  markAsLost(@Param('id', ParseIntPipe) id: number, @Body() markAsLostDto: MarkLeadAsLostDTO) {
    return this.leadsService.markAsLost(id, markAsLostDto);
  }
}
