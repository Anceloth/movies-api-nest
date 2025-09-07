import { Injectable, Inject } from '@nestjs/common';
import { Movie } from '../../../domain/entities/movie.entity';
import { MovieRepositoryInterface } from '../../../domain/repositories/movie.repository.interface';
import { MovieQueryDto } from '../../dtos/movie-query.dto';

@Injectable()
export class GetMoviesUseCase {
  constructor(
    @Inject('MovieRepositoryInterface')
    private readonly movieRepository: MovieRepositoryInterface,
  ) {}

  async execute(query: MovieQueryDto): Promise<{ movies: Movie[]; total: number; page: number; limit: number }> {
    let movies: Movie[];

    if (query.activeOnly) {
      movies = await this.movieRepository.findActive();
    } else {
      movies = await this.movieRepository.findAll();
    }

    const total = movies.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedMovies = movies.slice(startIndex, endIndex);

    return {
      movies: paginatedMovies,
      total,
      page,
      limit,
    };
  }
}
