import { Showtime } from '../entities/showtime.entity';

export interface ShowtimeRepositoryInterface {
  create(showtime: Showtime): Promise<Showtime>;
  findById(id: string): Promise<Showtime | null>;
  findAll(): Promise<Showtime[]>;
  findByMovieId(movieId: string): Promise<Showtime[]>;
  findByRoomId(roomId: string): Promise<Showtime[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Showtime[]>;
  findByRoomAndDateRange(roomId: string, startDate: Date, endDate: Date): Promise<Showtime[]>;
  update(showtime: Showtime): Promise<Showtime>;
  delete(id: string): Promise<void>;
  findActive(): Promise<Showtime[]>;
}
