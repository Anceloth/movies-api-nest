import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetRoomUseCase } from './get-room.use-case';
import { Room } from '../../../domain/entities/room.entity';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';

describe('GetRoomUseCase', () => {
  let useCase: GetRoomUseCase;
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
        GetRoomUseCase,
        {
          provide: 'RoomRepositoryInterface',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetRoomUseCase>(GetRoomUseCase);
    mockRoomRepository = module.get('RoomRepositoryInterface');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const roomId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return room when found', async () => {
      // Arrange
      const expectedRoom = Room.create('Sala 1', 50);
      mockRoomRepository.findById.mockResolvedValue(expectedRoom);

      // Act
      const result = await useCase.execute(roomId);

      // Assert
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
      expect(result).toEqual(expectedRoom);
    });

    it('should throw NotFoundException when room is not found', async () => {
      // Arrange
      mockRoomRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(roomId)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(roomId)).rejects.toThrow('Room not found');
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
    });

    it('should return room with correct properties', async () => {
      // Arrange
      const expectedRoom = Room.create('Sala VIP', 30);
      mockRoomRepository.findById.mockResolvedValue(expectedRoom);

      // Act
      const result = await useCase.execute(roomId);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', 'Sala VIP');
      expect(result).toHaveProperty('capacity', 30);
      expect(result).toHaveProperty('isActive', true);
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
  });
});
