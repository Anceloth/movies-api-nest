import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModel } from '../models/room.model';
import { RoomRepository } from '../repositories/room.repository';
import { RoomController } from '../../presentation/controllers/room.controller';
import {
  CreateRoomUseCase,
  GetRoomUseCase,
  GetRoomsUseCase,
  UpdateRoomUseCase,
  DeleteRoomUseCase,
} from '../../application/use-cases/room';

@Module({
  imports: [TypeOrmModule.forFeature([RoomModel])],
  controllers: [RoomController],
  providers: [
    RoomRepository,
    CreateRoomUseCase,
    GetRoomUseCase,
    GetRoomsUseCase,
    UpdateRoomUseCase,
    DeleteRoomUseCase,
    {
      provide: 'RoomRepositoryInterface',
      useClass: RoomRepository,
    },
  ],
  exports: [RoomRepository],
})
export class RoomModule {}
