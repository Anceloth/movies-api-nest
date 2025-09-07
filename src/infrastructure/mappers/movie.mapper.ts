import { Movie } from '../../domain/entities/movie.entity';
import { MovieModel } from '../models/movie.model';

export class MovieMapper {
  static toDomain(model: MovieModel): Movie {
    return new Movie(
      model.id,
      model.title,
      model.genre,
      model.director,
      model.releaseDate,
      model.isActive,
      model.createdAt,
      model.updatedAt,
    );
  }

  static toModel(entity: Movie): MovieModel {
    const model = new MovieModel();
    model.id = entity.id;
    model.title = entity.title;
    model.genre = entity.genre;
    model.director = entity.director;
    model.releaseDate = entity.releaseDate;
    model.isActive = entity.isActive;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }

  static toDomainList(models: MovieModel[]): Movie[] {
    return models.map(model => this.toDomain(model));
  }
}
