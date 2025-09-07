import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { MovieRepositoryInterface } from '../../../domain/repositories/movie.repository.interface';

@Injectable()
export class DeleteMovieUseCase {
  constructor(
    @Inject('MovieRepositoryInterface')
    private readonly movieRepository: MovieRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    // Check that the movie exists
    const existingMovie = await this.movieRepository.findById(id);
    if (!existingMovie) {
      throw new NotFoundException('Movie not found');
    }

    // Delete the movie
    await this.movieRepository.delete(id);
  }
}
