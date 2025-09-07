import { Movie } from '../entities/movie.entity';

export interface MovieRepositoryInterface {
  create(movie: Movie): Promise<Movie>;
  findById(id: string): Promise<Movie | null>;
  findAll(): Promise<Movie[]>;
  findByTitle(title: string): Promise<Movie | null>;
  update(movie: Movie): Promise<Movie>;
  delete(id: string): Promise<void>;
  findActive(): Promise<Movie[]>;
}
