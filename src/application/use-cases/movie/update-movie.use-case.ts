import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { Movie } from '../../../domain/entities/movie.entity';
import { MovieRepositoryInterface } from '../../../domain/repositories/movie.repository.interface';
import { UpdateMovieDto } from '../../dtos/update-movie.dto';

@Injectable()
export class UpdateMovieUseCase {
  constructor(
    @Inject('MovieRepositoryInterface')
    private readonly movieRepository: MovieRepositoryInterface,
  ) {}

  async execute(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    // Check that the movie exists
    const existingMovie = await this.movieRepository.findById(id);
    if (!existingMovie) {
      throw new NotFoundException('Movie not found');
    }

    // If updating the title, check that no other movie has the same title
    if (updateMovieDto.title && updateMovieDto.title !== existingMovie.title) {
      const movieWithSameTitle = await this.movieRepository.findByTitle(updateMovieDto.title);
      if (movieWithSameTitle && movieWithSameTitle.id !== id) {
        throw new ConflictException('A movie with this title already exists');
      }
    }

    // Update the movie
    const updatedMovie = existingMovie.update(
      updateMovieDto.title,
      updateMovieDto.genre,
      updateMovieDto.director,
      updateMovieDto.releaseDate ? new Date(updateMovieDto.releaseDate) : undefined,
    );

    // Save to repository
    return await this.movieRepository.update(updatedMovie);
  }
}
