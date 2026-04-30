import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { LeadStatus } from '../enums/lead-status.enum';
import { LeadOrigin } from '../enums/lead-origin.enum';

@Entity('lead')
export class Lead {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  nome!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  telefone?: string;

  @Column({ length: 255 })
  empresa!: string;

  @Column({ nullable: true })
  cargo?: string;

  @Column({
    type: 'enum',
    enum: LeadOrigin,
  })
  origem!: LeadOrigin;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NOVO,
  })
  status!: LeadStatus;

  @Column({ length: 500, nullable: true })
  observacoes?: string;

  @Column({ length: 255, nullable: true })
  motivo_perda?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  perdido_em?: Date | null;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
