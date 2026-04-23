import { IsEnum, IsNotEmpty } from 'class-validator';
import { LeadStatus } from '../enums/lead-status.enum';

export class UpdateLeadStatusDTO {
  @IsEnum(LeadStatus)
  @IsNotEmpty()
  status!: LeadStatus;
}
