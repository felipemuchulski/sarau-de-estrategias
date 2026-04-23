import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { LeadStatus } from '../enums/lead-status.enum';

export class CreateLeadDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  empresa!: string;

  @IsString()
  @IsOptional()
  cargo?: string;

  @IsString()
  @IsNotEmpty()
  origem!: string;

  @IsEnum(LeadStatus)
  @IsNotEmpty()
  status!: LeadStatus;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  observacoes?: string;
}
