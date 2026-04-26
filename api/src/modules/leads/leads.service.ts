import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Leads } from './entities/leads.entity';
import { Repository } from 'typeorm';
import { CreateLeadDTO } from './dto/create-lead.dto';
import { LeadStatus } from './enums/lead-status.enum';
import { UpdateLeadDto } from './dto/updated-lead.dto';
import { UpdateLeadStatusDTO } from './dto/updated-lead-status.dto';
import { MarkLeadAsLostDTO } from './dto/mark-status-as-lost.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Leads)
    private readonly leadsRepository: Repository<Leads>,
  ) {}

  async create(createLeadDto: CreateLeadDTO) {
    const leadEmailExist = await this.leadsRepository.findOneBy({
      email: createLeadDto.email,
    });

    if (leadEmailExist) {
      throw new ConflictException('Já existe um lead cadastrado com este e-mail');
    }

    const lead = this.leadsRepository.create({
      ...createLeadDto,
      status: LeadStatus.NOVO,
    });

    return await this.leadsRepository.save(lead);
  }

  async findAll() {
    const leads = await this.leadsRepository.find();
    return leads;
  }

  async findOneBy(id: number) {
    const leads_id = await this.leadsRepository.findOneBy({
      id: id,
    });

    if (!leads_id) {
      throw new NotFoundException(`O Lead de id ${id}, não foi encontrado!`);
    }

    return leads_id;
  }

  async updateLead(id: number, updateLeadDto: UpdateLeadDto) {
    const lead = await this.leadsRepository.findOneBy({ id });

    if (!lead) {
      throw new NotFoundException('Lead não encontrado');
    }

    if (updateLeadDto.email) {
      const email = updateLeadDto.email.trim().toLocaleLowerCase();

      const leadEmailExist = await this.leadsRepository.findOneBy({ email });

      if (leadEmailExist && leadEmailExist) {
        throw new ConflictException('Já existe um lead cadastrado com esse email!');
      }

      updateLeadDto.email = email;
    }

    Object.assign(lead, updateLeadDto);

    return await this.leadsRepository.save(lead);
  }

  async updateStatus(id: number, updateLeadStatusDto: UpdateLeadStatusDTO) {
    const lead = await this.leadsRepository.findOneBy({ id });

    if (!lead) {
      throw new NotFoundException('Lead não encontrado');
    }

    lead.status = updateLeadStatusDto.status;

    if (updateLeadStatusDto.status === LeadStatus.PERDIDO) {
      throw new BadRequestException('Para marcar um lead como perdido, utilize a rota específica.');
    }

    lead.status = updateLeadStatusDto.status;
    lead.motivo_perda = undefined;
    lead.perdido_em = undefined;

    return await this.leadsRepository.save(lead);
  }

  async markAsLost(id: number, markAsLostDto: MarkLeadAsLostDTO) {
    const lead = await this.leadsRepository.findOneBy({ id });

    if (!lead) {
      throw new NotFoundException('Lead não cadastrado');
    }

    lead.status = LeadStatus.PERDIDO;
    lead.motivo_perda = markAsLostDto.motivo_perda;
    lead.perdido_em = new Date();

    if (markAsLostDto.observacoes) {
      lead.observacoes = markAsLostDto.observacoes;
    }

    return await this.leadsRepository.save(lead);
  }
}
