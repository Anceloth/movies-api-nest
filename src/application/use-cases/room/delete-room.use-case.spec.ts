import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteRoomUseCase } from './delete-room.use-case';
import { Room } from '../../../domain/entities/room.entity';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';

describe('DeleteRoomUseCase', () => {
  let useCase: DeleteRoomUseCase;
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
        DeleteRoomUseCase,
        {
          provide: 'RoomRepositoryInterface',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteRoomUseCase>(DeleteRoomUseCase);
    mockRoomRepository = module.get('RoomRepositoryInterface');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const roomId = '123e4567-e89b-12d3-a456-426614174000';

    it('should delete room successfully when room exists', async () => {
      // Arrange
      const existingRoom = Room.create('Sala 1', 50);
      mockRoomRepository.findById.mockResolvedValue(existingRoom);
      mockRoomRepository.delete.mockResolvedValue(undefined);

      // Act
      await useCase.execute(roomId);

      // Assert
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
      expect(mockRoomRepository.delete).toHaveBeenCalledWith(roomId);
    });

    it('should throw NotFoundException when room does not exist', async () => {
      // Arrange
      mockRoomRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(roomId)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(roomId)).rejects.toThrow('Room not found');
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
      expect(mockRoomRepository.delete).not.toHaveBeenCalled();
    });

    it('should call delete with correct room ID', async () => {
      // Arrange
      const existingRoom = Room.create('Sala VIP', 30);
      mockRoomRepository.findById.mockResolvedValue(existingRoom);
      mockRoomRepository.delete.mockResolvedValue(undefined);

      // Act
      await useCase.execute(roomId);

      // Assert
      expect(mockRoomRepository.delete).toHaveBeenCalledWith(roomId);
    });

    it('should not call delete when room is not found', async () => {
      // Arrange
      mockRoomRepository.findById.mockResolvedValue(null);

      // Act & Assert
      try {
        await useCase.execute(roomId);
      } catch (error) {
        // Expected to throw
      }

      // Assert
      expect(mockRoomRepository.delete).not.toHaveBeenCalled();
    });
  });
});
