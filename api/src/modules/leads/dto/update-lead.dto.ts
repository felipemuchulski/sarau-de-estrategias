import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadDTO } from './create-lead.dto';

export class UpdateLeadDto extends PartialType(CreateLeadDTO) {}
