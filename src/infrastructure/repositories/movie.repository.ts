import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../../domain/entities/movie.entity';
import { MovieRepositoryInterface } from '../../domain/repositories/movie.repository.interface';
import { MovieModel } from '../models/movie.model';
import { MovieMapper } from '../mappers/movie.mapper';

@Injectable()
export class MovieRepository implements MovieRepositoryInterface {
  constructor(
    @InjectRepository(MovieModel)
    private readonly movieRepository: Repository<MovieModel>,
  ) {}

  async create(movie: Movie): Promise<Movie> {
    const model = MovieMapper.toModel(movie);
    const savedModel = await this.movieRepository.save(model);
    return MovieMapper.toDomain(savedModel);
  }

  async findById(id: string): Promise<Movie | null> {
    const model = await this.movieRepository.findOne({ where: { id } });
    return model ? MovieMapper.toDomain(model) : null;
  }

  async findAll(): Promise<Movie[]> {
    const models = await this.movieRepository.find();
    return MovieMapper.toDomainList(models);
  }

  async findByTitle(title: string): Promise<Movie | null> {
    const model = await this.movieRepository.findOne({ where: { title } });
    return model ? MovieMapper.toDomain(model) : null;
  }

  async update(movie: Movie): Promise<Movie> {
    const model = MovieMapper.toModel(movie);
    const updatedModel = await this.movieRepository.save(model);
    return MovieMapper.toDomain(updatedModel);
  }

  async delete(id: string): Promise<void> {
    await this.movieRepository.delete(id);
  }

  async findActive(): Promise<Movie[]> {
    const models = await this.movieRepository.find({ where: { isActive: true } });
    return MovieMapper.toDomainList(models);
  }
}
