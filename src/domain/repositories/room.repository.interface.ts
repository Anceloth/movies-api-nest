import { Room } from '../entities/room.entity';

export interface RoomRepositoryInterface {
  create(room: Room): Promise<Room>;
  findById(id: string): Promise<Room | null>;
  findAll(): Promise<Room[]>;
  findByName(name: string): Promise<Room | null>;
  update(room: Room): Promise<Room>;
  delete(id: string): Promise<void>;
  findActive(): Promise<Room[]>;
}
