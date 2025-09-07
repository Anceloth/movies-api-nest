import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModel } from '../models/movie.model';
import { MovieRepository } from '../repositories/movie.repository';
import { MovieController } from '../../presentation/controllers/movie.controller';
import {
  CreateMovieUseCase,
  GetMovieUseCase,
  GetMoviesUseCase,
  UpdateMovieUseCase,
  DeleteMovieUseCase,
} from '../../application/use-cases/movie';

@Module({
  imports: [TypeOrmModule.forFeature([MovieModel])],
  controllers: [MovieController],
  providers: [
    MovieRepository,
    CreateMovieUseCase,
    GetMovieUseCase,
    GetMoviesUseCase,
    UpdateMovieUseCase,
    DeleteMovieUseCase,
    {
      provide: 'MovieRepositoryInterface',
      useClass: MovieRepository,
    },
  ],
  exports: [MovieRepository],
})
export class MovieModule {}
