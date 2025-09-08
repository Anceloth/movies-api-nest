import { Showtime } from '../../domain/entities/showtime.entity';
import { ShowtimeModel } from '../models/showtime.model';

export class ShowtimeMapper {
  static toDomain(model: ShowtimeModel): Showtime {
    return new Showtime(
      model.id,
      model.movieId,
      model.roomId,
      model.startTime,
      model.endTime,
      model.isActive,
      model.createdAt,
      model.updatedAt,
    );
  }

  static toModel(entity: Showtime): ShowtimeModel {
    const model = new ShowtimeModel();
    model.id = entity.id;
    model.movieId = entity.movieId;
    model.roomId = entity.roomId;
    model.startTime = entity.startTime;
    model.endTime = entity.endTime;
    model.isActive = entity.isActive;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }

  static toDomainList(models: ShowtimeModel[]): Showtime[] {
    return models.map(model => this.toDomain(model));
  }
}
