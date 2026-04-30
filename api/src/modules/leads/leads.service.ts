import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lead } from './entities/leads.entity';
import { Repository } from 'typeorm';
import { CreateLeadDTO } from './dto/create-lead.dto';
import { LeadStatus } from './enums/lead-status.enum';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UpdateLeadStatusDTO } from './dto/update-lead-status.dto';
import { MarkLeadAsLostDTO } from './dto/mark-status-as-lost.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadsRepository: Repository<Lead>,
  ) {}

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  async create(createLeadDto: CreateLeadDTO) {
    const email = this.normalizeEmail(createLeadDto.email);

    const leadEmailExist = await this.leadsRepository.findOneBy({ email });

    if (leadEmailExist) {
      throw new ConflictException('Já existe um lead cadastrado com este e-mail');
    }

    const lead = this.leadsRepository.create({
      ...createLeadDto,
      email,
      status: LeadStatus.NOVO,
    });

    return await this.leadsRepository.save(lead);
  }

  async findAll() {
    const leads = await this.leadsRepository.find();
    return leads;
  }

  async findById(id: number) {
    const lead = await this.leadsRepository.findOneBy({ id });

    if (!lead) {
      throw new NotFoundException(`O Lead de id ${id}, não foi encontrado!`);
    }

    return lead;
  }

  async updateLead(id: number, updateLeadDto: UpdateLeadDto) {
    const lead = await this.leadsRepository.findOneBy({ id });

    if (!lead) {
      throw new NotFoundException('Lead não encontrado');
    }

    if (updateLeadDto.email) {
      const email = this.normalizeEmail(updateLeadDto.email);

      const leadEmailExist = await this.leadsRepository.findOneBy({ email });

      if (leadEmailExist && leadEmailExist.id !== id) {
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

    if (updateLeadStatusDto.status === LeadStatus.PERDIDO) {
      throw new BadRequestException('Para marcar um lead como perdido, utilize a rota específica.');
    }

    if (updateLeadStatusDto.status === LeadStatus.CONVERTIDO) {
      throw new BadRequestException('Para converter um lead, utilize a rota específica.');
    }

    lead.status = updateLeadStatusDto.status;
    lead.motivo_perda = null;
    lead.perdido_em = null;

    return await this.leadsRepository.save(lead);
  }

  async convertLead(id: number) {
    const lead = await this.leadsRepository.findOneBy({ id });

    if (!lead) {
      throw new NotFoundException('Lead não encontrado');
    }

    if (lead.status === LeadStatus.CONVERTIDO) {
      throw new BadRequestException('Este lead já foi convertido.');
    }

    lead.status = LeadStatus.CONVERTIDO;

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
