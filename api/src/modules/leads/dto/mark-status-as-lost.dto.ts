import { IsNotEmpty, MaxLength, IsOptional, IsString } from 'class-validator';

export class MarkLeadAsLostDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  motivo_perda!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  observacoes?: string;
}
