import { Injectable, ConflictException, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Showtime } from '../../../domain/entities/showtime.entity';
import { ShowtimeRepositoryInterface } from '../../../domain/repositories/showtime.repository.interface';
import { CreateShowtimeDto } from '../../dtos/create-showtime.dto';
import { MovieRepositoryInterface } from '../../../domain/repositories/movie.repository.interface';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';

@Injectable()
export class CreateShowtimeUseCase {
  constructor(
    @Inject('ShowtimeRepositoryInterface')
    private readonly showtimeRepository: ShowtimeRepositoryInterface,
    @Inject('MovieRepositoryInterface')
    private readonly movieRepository: MovieRepositoryInterface,
    @Inject('RoomRepositoryInterface')
    private readonly roomRepository: RoomRepositoryInterface,
  ) {}

  async execute(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    // Validate that movie exists
    const movie = await this.movieRepository.findById(createShowtimeDto.movieId);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Validate that room exists
    const room = await this.roomRepository.findById(createShowtimeDto.roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check for time conflicts in the same room
    const startTime = new Date(createShowtimeDto.startTime);

    // Validate not in the past
    const now = new Date();
    if (startTime.getTime() < now.getTime()) {
      throw new BadRequestException('Showtime cannot be in the past');
    }
    const endTime = new Date(startTime.getTime() + createShowtimeDto.durationMinutes * 60000);
    
    const existingShowtimes = await this.showtimeRepository.findByRoomAndDateRange(
      createShowtimeDto.roomId,
      startTime,
      endTime,
    );

    // Check for conflicts with existing showtimes
    const newShowtime = Showtime.create(
      createShowtimeDto.movieId,
      createShowtimeDto.roomId,
      startTime,
      createShowtimeDto.durationMinutes,
    );

    for (const existingShowtime of existingShowtimes) {
      if (newShowtime.isTimeConflict(existingShowtime)) {
        throw new ConflictException(
          `Time conflict: Another showtime exists in the same room during this time period`,
        );
      }
    }

    return await this.showtimeRepository.create(newShowtime);
  }
}
