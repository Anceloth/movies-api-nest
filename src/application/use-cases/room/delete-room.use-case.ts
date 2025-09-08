import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';

@Injectable()
export class DeleteRoomUseCase {
  constructor(
    @Inject('RoomRepositoryInterface')
    private readonly roomRepository: RoomRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    // Check that the room exists
    const existingRoom = await this.roomRepository.findById(id);
    if (!existingRoom) {
      throw new NotFoundException('Room not found');
    }

    // Delete the room
    await this.roomRepository.delete(id);
  }
}
