import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { Room } from '../../../domain/entities/room.entity';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';
import { UpdateRoomDto } from '../../dtos/update-room.dto';

@Injectable()
export class UpdateRoomUseCase {
  constructor(
    @Inject('RoomRepositoryInterface')
    private readonly roomRepository: RoomRepositoryInterface,
  ) {}

  async execute(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    // Check that the room exists
    const existingRoom = await this.roomRepository.findById(id);
    if (!existingRoom) {
      throw new NotFoundException('Room not found');
    }

    // If updating the name, check that no other room has the same name
    if (updateRoomDto.name && updateRoomDto.name !== existingRoom.name) {
      const roomWithSameName = await this.roomRepository.findByName(updateRoomDto.name);
      if (roomWithSameName && roomWithSameName.id !== id) {
        throw new ConflictException('A room with this name already exists');
      }
    }

    // Update the room
    const updatedRoom = existingRoom.update(
      updateRoomDto.name,
      updateRoomDto.capacity,
    );

    // Save to repository
    return await this.roomRepository.update(updatedRoom);
  }
}
