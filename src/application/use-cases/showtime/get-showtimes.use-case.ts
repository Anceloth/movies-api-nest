import { Injectable, Inject } from '@nestjs/common';
import { Showtime } from '../../../domain/entities/showtime.entity';
import { ShowtimeRepositoryInterface } from '../../../domain/repositories/showtime.repository.interface';
import { ShowtimeQueryDto } from '../../dtos/showtime-query.dto';

@Injectable()
export class GetShowtimesUseCase {
  constructor(
    @Inject('ShowtimeRepositoryInterface')
    private readonly showtimeRepository: ShowtimeRepositoryInterface,
  ) {}

  async execute(query: ShowtimeQueryDto): Promise<{ showtimes: Showtime[]; total: number; page: number; limit: number }> {
    let showtimes: Showtime[];

    // Apply filters based on query parameters
    if (query.movieId && query.roomId) {
      // Filter by both movie and room
      const movieShowtimes = await this.showtimeRepository.findByMovieId(query.movieId);
      const roomShowtimes = await this.showtimeRepository.findByRoomId(query.roomId);
      showtimes = movieShowtimes.filter(st => roomShowtimes.some(rt => rt.id === st.id));
    } else if (query.movieId) {
      showtimes = await this.showtimeRepository.findByMovieId(query.movieId);
    } else if (query.roomId) {
      showtimes = await this.showtimeRepository.findByRoomId(query.roomId);
    } else if (query.startDate && query.endDate) {
      const startDate = new Date(query.startDate);
      const endDate = new Date(query.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      showtimes = await this.showtimeRepository.findByDateRange(startDate, endDate);
    } else if (query.activeOnly) {
      showtimes = await this.showtimeRepository.findActive();
    } else {
      showtimes = await this.showtimeRepository.findAll();
    }

    // Apply active filter if specified
    if (query.activeOnly !== undefined) {
      showtimes = showtimes.filter(showtime => showtime.isActive === query.activeOnly);
    }

    const total = showtimes.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedShowtimes = showtimes.slice(startIndex, endIndex);

    return {
      showtimes: paginatedShowtimes,
      total,
      page,
      limit,
    };
  }
}
