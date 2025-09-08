import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { Room } from '../../../domain/entities/room.entity';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';
import { CreateRoomDto } from '../../dtos/create-room.dto';

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @Inject('RoomRepositoryInterface')
    private readonly roomRepository: RoomRepositoryInterface,
  ) {}

  async execute(createRoomDto: CreateRoomDto): Promise<Room> {
    // Check if a room with the same name already exists
    const existingRoom = await this.roomRepository.findByName(createRoomDto.name);
    if (existingRoom) {
      throw new ConflictException('A room with this name already exists');
    }

    // Create the new room
    const room = Room.create(
      createRoomDto.name,
      createRoomDto.capacity,
    );

    // Save to repository
    return await this.roomRepository.create(room);
  }
}
