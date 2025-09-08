import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketRepositoryInterface } from '../../domain/repositories/ticket.repository.interface';
import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketModel } from '../models/ticket.model';

@Injectable()
export class TicketRepository implements TicketRepositoryInterface {
  constructor(
    @InjectRepository(TicketModel)
    private readonly repo: Repository<TicketModel>,
  ) {}

  async create(ticket: Ticket): Promise<Ticket> {
    const model = this.repo.create({
      id: ticket.id,
      showtimeId: ticket.showtimeId,
      purchaserName: ticket.purchaserName,
      createdAt: ticket.createdAt,
    });
    const saved = await this.repo.save(model);
    return new Ticket(saved.id, saved.showtimeId, saved.purchaserName, saved.createdAt);
  }

  async countByShowtimeId(showtimeId: string): Promise<number> {
    return this.repo.count({ where: { showtimeId } });
  }
}

