import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimeModel } from '../models/showtime.model';
import { TicketModel } from '../models/ticket.model';
import { MovieModel } from '../models/movie.model';
import { RoomModel } from '../models/room.model';
import { ShowtimeRepository } from '../repositories/showtime.repository';
import { TicketRepository } from '../repositories/ticket.repository';
import { MovieRepository } from '../repositories/movie.repository';
import { RoomRepository } from '../repositories/room.repository';
import { ShowtimeController } from '../../presentation/controllers/showtime.controller';
import { TicketController } from '../../presentation/controllers/ticket.controller';
import {
  CreateShowtimeUseCase,
  GetShowtimeUseCase,
  GetShowtimesUseCase,
  UpdateShowtimeUseCase,
  DeleteShowtimeUseCase,
} from '../../application/use-cases/showtime';
import { PurchaseTicketUseCase } from '../../application/use-cases/showtime/purchase-ticket.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ShowtimeModel, MovieModel, RoomModel, TicketModel])],
  controllers: [ShowtimeController, TicketController],
  providers: [
    ShowtimeRepository,
    MovieRepository,
    RoomRepository,
    CreateShowtimeUseCase,
    PurchaseTicketUseCase,
    GetShowtimeUseCase,
    GetShowtimesUseCase,
    UpdateShowtimeUseCase,
    DeleteShowtimeUseCase,
    {
      provide: 'ShowtimeRepositoryInterface',
      useClass: ShowtimeRepository,
    },
    {
      provide: 'TicketRepositoryInterface',
      useClass: TicketRepository,
    },
    {
      provide: 'MovieRepositoryInterface',
      useClass: MovieRepository,
    },
    {
      provide: 'RoomRepositoryInterface',
      useClass: RoomRepository,
    },
  ],
  exports: [ShowtimeRepository],
})
export class ShowtimeModule {}
