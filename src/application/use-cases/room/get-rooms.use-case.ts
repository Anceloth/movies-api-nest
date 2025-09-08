import { Injectable, Inject } from '@nestjs/common';
import { Room } from '../../../domain/entities/room.entity';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';
import { RoomQueryDto } from '../../dtos/room-query.dto';

@Injectable()
export class GetRoomsUseCase {
  constructor(
    @Inject('RoomRepositoryInterface')
    private readonly roomRepository: RoomRepositoryInterface,
  ) {}

  async execute(query: RoomQueryDto): Promise<{ rooms: Room[]; total: number; page: number; limit: number }> {
    let rooms: Room[];

    if (query.activeOnly) {
      rooms = await this.roomRepository.findActive();
    } else {
      rooms = await this.roomRepository.findAll();
    }

    const total = rooms.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedRooms = rooms.slice(startIndex, endIndex);

    return {
      rooms: paginatedRooms,
      total,
      page,
      limit,
    };
  }
}
