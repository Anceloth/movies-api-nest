import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Movie } from '../../../domain/entities/movie.entity';
import { MovieRepositoryInterface } from '../../../domain/repositories/movie.repository.interface';

@Injectable()
export class GetMovieUseCase {
  constructor(
    @Inject('MovieRepositoryInterface')
    private readonly movieRepository: MovieRepositoryInterface,
  ) {}

  async execute(id: string): Promise<Movie> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }
}
