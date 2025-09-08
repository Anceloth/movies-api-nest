import { Injectable, NotFoundException, ConflictException, Inject, BadRequestException } from '@nestjs/common';
import { Showtime } from '../../../domain/entities/showtime.entity';
import { ShowtimeRepositoryInterface } from '../../../domain/repositories/showtime.repository.interface';
import { UpdateShowtimeDto } from '../../dtos/update-showtime.dto';
import { MovieRepositoryInterface } from '../../../domain/repositories/movie.repository.interface';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';

@Injectable()
export class UpdateShowtimeUseCase {
  constructor(
    @Inject('ShowtimeRepositoryInterface')
    private readonly showtimeRepository: ShowtimeRepositoryInterface,
    @Inject('MovieRepositoryInterface')
    private readonly movieRepository: MovieRepositoryInterface,
    @Inject('RoomRepositoryInterface')
    private readonly roomRepository: RoomRepositoryInterface,
  ) {}

  async execute(id: string, updateShowtimeDto: UpdateShowtimeDto): Promise<Showtime> {
    const existingShowtime = await this.showtimeRepository.findById(id);
    if (!existingShowtime) {
      throw new NotFoundException('Showtime not found');
    }

    // Validate movie if provided
    if (updateShowtimeDto.movieId) {
      const movie = await this.movieRepository.findById(updateShowtimeDto.movieId);
      if (!movie) {
        throw new NotFoundException('Movie not found');
      }
    }

    // Validate room if provided
    if (updateShowtimeDto.roomId) {
      const room = await this.roomRepository.findById(updateShowtimeDto.roomId);
      if (!room) {
        throw new NotFoundException('Room not found');
      }
    }

    // Check for time conflicts if time or room is being updated
    if (updateShowtimeDto.startTime || updateShowtimeDto.roomId) {
      const startTime = updateShowtimeDto.startTime 
        ? new Date(updateShowtimeDto.startTime) 
        : existingShowtime.startTime;
      const durationMinutes = updateShowtimeDto.durationMinutes || 120;
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
      const roomId = updateShowtimeDto.roomId || existingShowtime.roomId;

      // Validate not in the past
      const now = new Date();
      if (startTime.getTime() < now.getTime()) {
        throw new BadRequestException('Showtime cannot be in the past');
      }

      const existingShowtimes = await this.showtimeRepository.findByRoomAndDateRange(
        roomId,
        startTime,
        endTime,
      );

      // Check for conflicts with other showtimes (excluding current one)
      const conflictingShowtimes = existingShowtimes.filter(st => st.id !== id);
      
      for (const conflictingShowtime of conflictingShowtimes) {
        const newShowtime = Showtime.create(
          updateShowtimeDto.movieId || existingShowtime.movieId,
          roomId,
          startTime,
          durationMinutes,
        );
        
        if (newShowtime.isTimeConflict(conflictingShowtime)) {
          throw new ConflictException(
            `Time conflict: Another showtime exists in the same room during this time period`,
          );
        }
      }
    }

    const updatedShowtime = existingShowtime.update(
      updateShowtimeDto.movieId,
      updateShowtimeDto.roomId,
      updateShowtimeDto.startTime ? new Date(updateShowtimeDto.startTime) : undefined,
      updateShowtimeDto.durationMinutes,
    );

    return await this.showtimeRepository.update(updatedShowtime);
  }
}
