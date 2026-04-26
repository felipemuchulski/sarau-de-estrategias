import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Leads } from '../../leads/entities/leads.entity';

@Entity('diagnostics')
export class Diagnostics {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Leads)
  @JoinColumn({ name: 'lead_id' })
  lead_id!: Leads;

  @Column({ length: 150 })
  titulo?: string;

  @Column('text')
  resultado?: string;

  @Column('text')
  notas?: string;

  created_at:

  updated_at:
  
  
}
