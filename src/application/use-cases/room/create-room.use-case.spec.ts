import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateRoomUseCase } from './create-room.use-case';
import { Room } from '../../../domain/entities/room.entity';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';
import { CreateRoomDto } from '../../dtos/create-room.dto';

describe('CreateRoomUseCase', () => {
  let useCase: CreateRoomUseCase;
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
        CreateRoomUseCase,
        {
          provide: 'RoomRepositoryInterface',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateRoomUseCase>(CreateRoomUseCase);
    mockRoomRepository = module.get('RoomRepositoryInterface');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const createRoomDto: CreateRoomDto = {
      name: 'Sala 1',
      capacity: 50,
    };

    it('should create a room successfully when name is unique', async () => {
      // Arrange
      const expectedRoom = Room.create('Sala 1', 50);
      mockRoomRepository.findByName.mockResolvedValue(null);
      mockRoomRepository.create.mockResolvedValue(expectedRoom);

      // Act
      const result = await useCase.execute(createRoomDto);

      // Assert
      expect(mockRoomRepository.findByName).toHaveBeenCalledWith('Sala 1');
      expect(mockRoomRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Sala 1',
          capacity: 50,
          isActive: true,
        }),
      );
      expect(result).toEqual(expectedRoom);
    });

    it('should throw ConflictException when room with same name already exists', async () => {
      // Arrange
      const existingRoom = Room.create('Sala 1', 30);
      mockRoomRepository.findByName.mockResolvedValue(existingRoom);

      // Act & Assert
      await expect(useCase.execute(createRoomDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(useCase.execute(createRoomDto)).rejects.toThrow(
        'A room with this name already exists',
      );
      expect(mockRoomRepository.findByName).toHaveBeenCalledWith('Sala 1');
      expect(mockRoomRepository.create).not.toHaveBeenCalled();
    });

    it('should create room with different capacity', async () => {
      // Arrange
      const createRoomDtoWithDifferentCapacity: CreateRoomDto = {
        name: 'Sala VIP',
        capacity: 20,
      };
      const expectedRoom = Room.create('Sala VIP', 20);
      mockRoomRepository.findByName.mockResolvedValue(null);
      mockRoomRepository.create.mockResolvedValue(expectedRoom);

      // Act
      const result = await useCase.execute(createRoomDtoWithDifferentCapacity);

      // Assert
      expect(mockRoomRepository.findByName).toHaveBeenCalledWith('Sala VIP');
      expect(mockRoomRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Sala VIP',
          capacity: 20,
          isActive: true,
        }),
      );
      expect(result).toEqual(expectedRoom);
    });
  });
});
