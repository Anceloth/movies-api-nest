import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { Movie } from '../../../domain/entities/movie.entity';
import { MovieRepositoryInterface } from '../../../domain/repositories/movie.repository.interface';
import { CreateMovieDto } from '../../dtos/create-movie.dto';

@Injectable()
export class CreateMovieUseCase {
  constructor(
    @Inject('MovieRepositoryInterface')
    private readonly movieRepository: MovieRepositoryInterface,
  ) {}

  async execute(createMovieDto: CreateMovieDto): Promise<Movie> {
    // Check if a movie with the same title already exists
    const existingMovie = await this.movieRepository.findByTitle(createMovieDto.title);
    if (existingMovie) {
      throw new ConflictException('A movie with this title already exists');
    }

    // Create the new movie
    const movie = Movie.create(
      createMovieDto.title,
      createMovieDto.genre,
      createMovieDto.director,
      new Date(createMovieDto.releaseDate),
    );

    // Save to repository
    return await this.movieRepository.create(movie);
  }
}
