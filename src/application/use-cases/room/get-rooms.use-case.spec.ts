import { Test, TestingModule } from '@nestjs/testing';
import { GetRoomsUseCase } from './get-rooms.use-case';
import { Room } from '../../../domain/entities/room.entity';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';
import { RoomQueryDto } from '../../dtos/room-query.dto';

describe('GetRoomsUseCase', () => {
  let useCase: GetRoomsUseCase;
  let mockRoomRepository: jest.Mocked<RoomRepositoryInterface>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findActive: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetRoomsUseCase,
        {
          provide: 'RoomRepositoryInterface',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetRoomsUseCase>(GetRoomsUseCase);
    mockRoomRepository = module.get('RoomRepositoryInterface');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return active rooms when activeOnly is true', async () => {
      // Arrange
      const query: RoomQueryDto = { activeOnly: true, page: 1, limit: 10 };
      const activeRooms = [
        Room.create('Sala 1', 50),
        Room.create('Sala 2', 80),
      ];
      mockRoomRepository.findActive.mockResolvedValue(activeRooms);

      // Act
      const result = await useCase.execute(query);

      // Assert
      expect(mockRoomRepository.findActive).toHaveBeenCalled();
      expect(mockRoomRepository.findAll).not.toHaveBeenCalled();
      expect(result).toEqual({
        rooms: activeRooms,
        total: 2,
        page: 1,
        limit: 10,
      });
    });

    it('should return all rooms when activeOnly is false', async () => {
      // Arrange
      const query: RoomQueryDto = { activeOnly: false, page: 1, limit: 10 };
      const allRooms = [
        Room.create('Sala 1', 50),
        Room.create('Sala 2', 80),
        Room.create('Sala 3', 30),
      ];
      mockRoomRepository.findAll.mockResolvedValue(allRooms);

      // Act
      const result = await useCase.execute(query);

      // Assert
      expect(mockRoomRepository.findAll).toHaveBeenCalled();
      expect(mockRoomRepository.findActive).not.toHaveBeenCalled();
      expect(result).toEqual({
        rooms: allRooms,
        total: 3,
        page: 1,
        limit: 10,
      });
    });

    it('should return paginated results', async () => {
      // Arrange
      const query: RoomQueryDto = { activeOnly: true, page: 2, limit: 2 };
      const allRooms = [
        Room.create('Sala 1', 50),
        Room.create('Sala 2', 80),
        Room.create('Sala 3', 30),
        Room.create('Sala 4', 100),
      ];
      mockRoomRepository.findActive.mockResolvedValue(allRooms);

      // Act
      const result = await useCase.execute(query);

      // Assert
      expect(result).toEqual({
        rooms: [allRooms[2], allRooms[3]], // Page 2 with limit 2
        total: 4,
        page: 2,
        limit: 2,
      });
    });

    it('should return empty array when no rooms found', async () => {
      // Arrange
      const query: RoomQueryDto = { activeOnly: true, page: 1, limit: 10 };
      mockRoomRepository.findActive.mockResolvedValue([]);

      // Act
      const result = await useCase.execute(query);

      // Assert
      expect(result).toEqual({
        rooms: [],
        total: 0,
        page: 1,
        limit: 10,
      });
    });

    it('should use default values when query parameters are undefined', async () => {
      // Arrange
      const query: RoomQueryDto = { activeOnly: true }; // Set activeOnly to true explicitly
      const activeRooms = [Room.create('Sala 1', 50)];
      mockRoomRepository.findActive.mockResolvedValue(activeRooms);

      // Act
      const result = await useCase.execute(query);

      // Assert
      expect(result).toEqual({
        rooms: activeRooms,
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });
});
