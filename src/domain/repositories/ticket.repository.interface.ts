import { Ticket } from '../entities/ticket.entity';

export interface TicketRepositoryInterface {
  create(ticket: Ticket): Promise<Ticket>;
  countByShowtimeId(showtimeId: string): Promise<number>;
}


