import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateRoomUseCase } from './update-room.use-case';
import { Room } from '../../../domain/entities/room.entity';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';
import { UpdateRoomDto } from '../../dtos/update-room.dto';

describe('UpdateRoomUseCase', () => {
  let useCase: UpdateRoomUseCase;
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
        UpdateRoomUseCase,
        {
          provide: 'RoomRepositoryInterface',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateRoomUseCase>(UpdateRoomUseCase);
    mockRoomRepository = module.get('RoomRepositoryInterface');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const roomId = '123e4567-e89b-12d3-a456-426614174000';
    const existingRoom = Room.create('Sala 1', 50);

    it('should update room successfully when all validations pass', async () => {
      // Arrange
      const updateRoomDto: UpdateRoomDto = {
        name: 'Sala 1 - VIP',
        capacity: 40,
      };
      const updatedRoom = existingRoom.update('Sala 1 - VIP', 40);
      
      mockRoomRepository.findById.mockResolvedValue(existingRoom);
      mockRoomRepository.findByName.mockResolvedValue(null);
      mockRoomRepository.update.mockResolvedValue(updatedRoom);

      // Act
      const result = await useCase.execute(roomId, updateRoomDto);

      // Assert
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
      expect(mockRoomRepository.findByName).toHaveBeenCalledWith('Sala 1 - VIP');
      expect(mockRoomRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Sala 1 - VIP',
          capacity: 40,
        }),
      );
      expect(result).toEqual(updatedRoom);
    });

    it('should throw NotFoundException when room does not exist', async () => {
      // Arrange
      const updateRoomDto: UpdateRoomDto = { name: 'Sala 1 - VIP' };
      mockRoomRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(roomId, updateRoomDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(useCase.execute(roomId, updateRoomDto)).rejects.toThrow(
        'Room not found',
      );
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
      expect(mockRoomRepository.findByName).not.toHaveBeenCalled();
      expect(mockRoomRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when new name already exists', async () => {
      // Arrange
      const updateRoomDto: UpdateRoomDto = { name: 'Sala 2' };
      const roomWithSameName = Room.create('Sala 2', 80);
      
      mockRoomRepository.findById.mockResolvedValue(existingRoom);
      mockRoomRepository.findByName.mockResolvedValue(roomWithSameName);

      // Act & Assert
      await expect(useCase.execute(roomId, updateRoomDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(useCase.execute(roomId, updateRoomDto)).rejects.toThrow(
        'A room with this name already exists',
      );
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
      expect(mockRoomRepository.findByName).toHaveBeenCalledWith('Sala 2');
      expect(mockRoomRepository.update).not.toHaveBeenCalled();
    });

    it('should not check name uniqueness when name is not being updated', async () => {
      // Arrange
      const updateRoomDto: UpdateRoomDto = { capacity: 60 };
      const updatedRoom = existingRoom.update(undefined, 60);
      
      mockRoomRepository.findById.mockResolvedValue(existingRoom);
      mockRoomRepository.update.mockResolvedValue(updatedRoom);

      // Act
      const result = await useCase.execute(roomId, updateRoomDto);

      // Assert
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
      expect(mockRoomRepository.findByName).not.toHaveBeenCalled();
      expect(mockRoomRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Sala 1',
          capacity: 60,
        }),
      );
      expect(result).toEqual(updatedRoom);
    });

    it('should not check name uniqueness when new name is same as current', async () => {
      // Arrange
      const updateRoomDto: UpdateRoomDto = { name: 'Sala 1', capacity: 60 };
      const updatedRoom = existingRoom.update('Sala 1', 60);
      
      mockRoomRepository.findById.mockResolvedValue(existingRoom);
      mockRoomRepository.update.mockResolvedValue(updatedRoom);

      // Act
      const result = await useCase.execute(roomId, updateRoomDto);

      // Assert
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
      expect(mockRoomRepository.findByName).not.toHaveBeenCalled();
      expect(mockRoomRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Sala 1',
          capacity: 60,
        }),
      );
      expect(result).toEqual(updatedRoom);
    });

    it('should update only capacity when only capacity is provided', async () => {
      // Arrange
      const updateRoomDto: UpdateRoomDto = { capacity: 100 };
      const updatedRoom = existingRoom.update(undefined, 100);
      
      mockRoomRepository.findById.mockResolvedValue(existingRoom);
      mockRoomRepository.update.mockResolvedValue(updatedRoom);

      // Act
      const result = await useCase.execute(roomId, updateRoomDto);

      // Assert
      expect(mockRoomRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Sala 1',
          capacity: 100,
        }),
      );
      expect(result).toEqual(updatedRoom);
    });
  });
});
