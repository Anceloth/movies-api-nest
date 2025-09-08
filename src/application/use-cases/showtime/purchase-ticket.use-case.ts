import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Ticket } from '../../../domain/entities/ticket.entity';
import { TicketRepositoryInterface } from '../../../domain/repositories/ticket.repository.interface';
import { ShowtimeRepositoryInterface } from '../../../domain/repositories/showtime.repository.interface';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';

interface PurchaseTicketInput {
  showtimeId: string;
  purchaserName: string;
}

@Injectable()
export class PurchaseTicketUseCase {
  constructor(
    @Inject('TicketRepositoryInterface') private readonly ticketRepo: TicketRepositoryInterface,
    @Inject('ShowtimeRepositoryInterface') private readonly showtimeRepo: ShowtimeRepositoryInterface,
    @Inject('RoomRepositoryInterface') private readonly roomRepo: RoomRepositoryInterface,
  ) {}

  async execute(input: PurchaseTicketInput): Promise<Ticket> {
    const showtime = await this.showtimeRepo.findById(input.showtimeId);
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }

    // Validate not in the past
    const now = new Date();
    if (showtime.startTime.getTime() <= now.getTime()) {
      throw new BadRequestException('Cannot purchase tickets for past showtime');
    }

    const room = await this.roomRepo.findById(showtime.roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const sold = await this.ticketRepo.countByShowtimeId(showtime.id);
    if (sold >= room.capacity) {
      throw new BadRequestException('Room capacity exceeded for this showtime');
    }

    const ticket = Ticket.create({ showtimeId: showtime.id, purchaserName: input.purchaserName });
    return this.ticketRepo.create(ticket);
  }
}


