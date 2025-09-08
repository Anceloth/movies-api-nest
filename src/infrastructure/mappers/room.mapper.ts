import { Room } from '../../domain/entities/room.entity';
import { RoomModel } from '../models/room.model';

export class RoomMapper {
  static toDomain(model: RoomModel): Room {
    return new Room(
      model.id,
      model.name,
      model.capacity,
      model.isActive,
      model.createdAt,
      model.updatedAt,
    );
  }

  static toModel(entity: Room): RoomModel {
    const model = new RoomModel();
    model.id = entity.id;
    model.name = entity.name;
    model.capacity = entity.capacity;
    model.isActive = entity.isActive;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }

  static toDomainList(models: RoomModel[]): Room[] {
    return models.map(model => this.toDomain(model));
  }
}
