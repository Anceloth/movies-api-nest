import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { CreateRoomUseCase } from '../../application/use-cases/room/create-room.use-case';
import { GetRoomUseCase } from '../../application/use-cases/room/get-room.use-case';
import { GetRoomsUseCase } from '../../application/use-cases/room/get-rooms.use-case';
import { UpdateRoomUseCase } from '../../application/use-cases/room/update-room.use-case';
import { DeleteRoomUseCase } from '../../application/use-cases/room/delete-room.use-case';
import { Room } from '../../domain/entities/room.entity';
import { CreateRoomDto } from '../../application/dtos/create-room.dto';
import { UpdateRoomDto } from '../../application/dtos/update-room.dto';
import { RoomQueryDto } from '../../application/dtos/room-query.dto';

describe('RoomController', () => {
  let controller: RoomController;
  let createRoomUseCase: jest.Mocked<CreateRoomUseCase>;
  let getRoomUseCase: jest.Mocked<GetRoomUseCase>;
  let getRoomsUseCase: jest.Mocked<GetRoomsUseCase>;
  let updateRoomUseCase: jest.Mocked<UpdateRoomUseCase>;
  let deleteRoomUseCase: jest.Mocked<DeleteRoomUseCase>;

  beforeEach(async () => {
    const mockCreateRoomUseCase = {
      execute: jest.fn(),
    };
    const mockGetRoomUseCase = {
      execute: jest.fn(),
    };
    const mockGetRoomsUseCase = {
      execute: jest.fn(),
    };
    const mockUpdateRoomUseCase = {
      execute: jest.fn(),
    };
    const mockDeleteRoomUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        {
          provide: CreateRoomUseCase,
          useValue: mockCreateRoomUseCase,
        },
        {
          provide: GetRoomUseCase,
          useValue: mockGetRoomUseCase,
        },
        {
          provide: GetRoomsUseCase,
          useValue: mockGetRoomsUseCase,
        },
        {
          provide: UpdateRoomUseCase,
          useValue: mockUpdateRoomUseCase,
        },
        {
          provide: DeleteRoomUseCase,
          useValue: mockDeleteRoomUseCase,
        },
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
    createRoomUseCase = module.get(CreateRoomUseCase);
    getRoomUseCase = module.get(GetRoomUseCase);
    getRoomsUseCase = module.get(GetRoomsUseCase);
    updateRoomUseCase = module.get(UpdateRoomUseCase);
    deleteRoomUseCase = module.get(DeleteRoomUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a room successfully', async () => {
      // Arrange
      const createRoomDto: CreateRoomDto = {
        name: 'Sala 1',
        capacity: 50,
      };
      const expectedRoom = Room.create('Sala 1', 50);
      createRoomUseCase.execute.mockResolvedValue(expectedRoom);

      // Act
      const result = await controller.create(createRoomDto);

      // Assert
      expect(createRoomUseCase.execute).toHaveBeenCalledWith(createRoomDto);
      expect(result).toEqual({
        id: expectedRoom.id,
        name: expectedRoom.name,
        capacity: expectedRoom.capacity,
        isActive: expectedRoom.isActive,
        createdAt: expectedRoom.createdAt.toISOString(),
        updatedAt: expectedRoom.updatedAt.toISOString(),
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated rooms list', async () => {
      // Arrange
      const query: RoomQueryDto = { page: 1, limit: 10, activeOnly: true };
      const rooms = [Room.create('Sala 1', 50), Room.create('Sala 2', 80)];
      const mockResult = {
        rooms,
        total: 2,
        page: 1,
        limit: 10,
      };
      getRoomsUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const result = await controller.findAll(query);

      // Assert
      expect(getRoomsUseCase.execute).toHaveBeenCalledWith(query);
      expect(result).toEqual({
        rooms: [
          {
            id: rooms[0].id,
            name: rooms[0].name,
            capacity: rooms[0].capacity,
            isActive: rooms[0].isActive,
            createdAt: rooms[0].createdAt.toISOString(),
            updatedAt: rooms[0].updatedAt.toISOString(),
          },
          {
            id: rooms[1].id,
            name: rooms[1].name,
            capacity: rooms[1].capacity,
            isActive: rooms[1].isActive,
            createdAt: rooms[1].createdAt.toISOString(),
            updatedAt: rooms[1].updatedAt.toISOString(),
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a room by id', async () => {
      // Arrange
      const roomId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedRoom = Room.create('Sala 1', 50);
      getRoomUseCase.execute.mockResolvedValue(expectedRoom);

      // Act
      const result = await controller.findOne(roomId);

      // Assert
      expect(getRoomUseCase.execute).toHaveBeenCalledWith(roomId);
      expect(result).toEqual({
        id: expectedRoom.id,
        name: expectedRoom.name,
        capacity: expectedRoom.capacity,
        isActive: expectedRoom.isActive,
        createdAt: expectedRoom.createdAt.toISOString(),
        updatedAt: expectedRoom.updatedAt.toISOString(),
      });
    });
  });

  describe('update', () => {
    it('should update a room successfully', async () => {
      // Arrange
      const roomId = '123e4567-e89b-12d3-a456-426614174000';
      const updateRoomDto: UpdateRoomDto = {
        name: 'Sala 1 - VIP',
        capacity: 40,
      };
      const updatedRoom = Room.create('Sala 1 - VIP', 40);
      updateRoomUseCase.execute.mockResolvedValue(updatedRoom);

      // Act
      const result = await controller.update(roomId, updateRoomDto);

      // Assert
      expect(updateRoomUseCase.execute).toHaveBeenCalledWith(roomId, updateRoomDto);
      expect(result).toEqual({
        id: updatedRoom.id,
        name: updatedRoom.name,
        capacity: updatedRoom.capacity,
        isActive: updatedRoom.isActive,
        createdAt: updatedRoom.createdAt.toISOString(),
        updatedAt: updatedRoom.updatedAt.toISOString(),
      });
    });
  });

  describe('remove', () => {
    it('should delete a room successfully', async () => {
      // Arrange
      const roomId = '123e4567-e89b-12d3-a456-426614174000';
      deleteRoomUseCase.execute.mockResolvedValue(undefined);

      // Act
      await controller.remove(roomId);

      // Assert
      expect(deleteRoomUseCase.execute).toHaveBeenCalledWith(roomId);
    });
  });

  describe('mapToResponseDto', () => {
    it('should map room entity to response DTO correctly', () => {
      // Arrange
      const room = Room.create('Sala 1', 50);
      const controller = new RoomController(
        createRoomUseCase,
        getRoomUseCase,
        getRoomsUseCase,
        updateRoomUseCase,
        deleteRoomUseCase,
      );

      // Act
      const result = (controller as any).mapToResponseDto(room);

      // Assert
      expect(result).toEqual({
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        isActive: room.isActive,
        createdAt: room.createdAt.toISOString(),
        updatedAt: room.updatedAt.toISOString(),
      });
    });

    it('should handle string dates in mapToResponseDto', () => {
      // Arrange
      const room = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Sala 1',
        capacity: 50,
        isActive: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };
      const controller = new RoomController(
        createRoomUseCase,
        getRoomUseCase,
        getRoomsUseCase,
        updateRoomUseCase,
        deleteRoomUseCase,
      );

      // Act
      const result = (controller as any).mapToResponseDto(room);

      // Assert
      expect(result).toEqual({
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        isActive: room.isActive,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      });
    });
  });
});
