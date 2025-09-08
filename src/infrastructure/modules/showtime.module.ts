import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimeModel } from '../models/showtime.model';
import { MovieModel } from '../models/movie.model';
import { RoomModel } from '../models/room.model';
import { ShowtimeRepository } from '../repositories/showtime.repository';
import { MovieRepository } from '../repositories/movie.repository';
import { RoomRepository } from '../repositories/room.repository';
import { ShowtimeController } from '../../presentation/controllers/showtime.controller';
import {
  CreateShowtimeUseCase,
  GetShowtimeUseCase,
  GetShowtimesUseCase,
  UpdateShowtimeUseCase,
  DeleteShowtimeUseCase,
} from '../../application/use-cases/showtime';

@Module({
  imports: [TypeOrmModule.forFeature([ShowtimeModel, MovieModel, RoomModel])],
  controllers: [ShowtimeController],
  providers: [
    ShowtimeRepository,
    MovieRepository,
    RoomRepository,
    CreateShowtimeUseCase,
    GetShowtimeUseCase,
    GetShowtimesUseCase,
    UpdateShowtimeUseCase,
    DeleteShowtimeUseCase,
    {
      provide: 'ShowtimeRepositoryInterface',
      useClass: ShowtimeRepository,
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
