import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Showtime } from '../../../domain/entities/showtime.entity';
import { ShowtimeRepositoryInterface } from '../../../domain/repositories/showtime.repository.interface';

@Injectable()
export class GetShowtimeUseCase {
  constructor(
    @Inject('ShowtimeRepositoryInterface')
    private readonly showtimeRepository: ShowtimeRepositoryInterface,
  ) {}

  async execute(id: string): Promise<Showtime> {
    const showtime = await this.showtimeRepository.findById(id);
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }
    return showtime;
  }
}
