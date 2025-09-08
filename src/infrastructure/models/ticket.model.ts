import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShowtimeModel } from './showtime.model';

@Entity('tickets')
export class TicketModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  showtimeId: string;

  @Column({ type: 'varchar', length: 150 })
  purchaserName: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ShowtimeModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'showtimeId' })
  showtime: ShowtimeModel;
}


