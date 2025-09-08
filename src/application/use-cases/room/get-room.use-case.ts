import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Room } from '../../../domain/entities/room.entity';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';

@Injectable()
export class GetRoomUseCase {
  constructor(
    @Inject('RoomRepositoryInterface')
    private readonly roomRepository: RoomRepositoryInterface,
  ) {}

  async execute(id: string): Promise<Room> {
    const room = await this.roomRepository.findById(id);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }
}
