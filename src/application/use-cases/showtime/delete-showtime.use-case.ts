import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ShowtimeRepositoryInterface } from '../../../domain/repositories/showtime.repository.interface';

@Injectable()
export class DeleteShowtimeUseCase {
  constructor(
    @Inject('ShowtimeRepositoryInterface')
    private readonly showtimeRepository: ShowtimeRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    const existingShowtime = await this.showtimeRepository.findById(id);
    if (!existingShowtime) {
      throw new NotFoundException('Showtime not found');
    }

    await this.showtimeRepository.delete(id);
  }
}
