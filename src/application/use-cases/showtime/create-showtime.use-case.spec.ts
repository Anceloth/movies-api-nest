import { Test, TestingModule } from '@nestjs/testing';
import { CreateShowtimeUseCase } from './create-showtime.use-case';
import { ShowtimeRepositoryInterface } from '../../../domain/repositories/showtime.repository.interface';
import { MovieRepositoryInterface } from '../../../domain/repositories/movie.repository.interface';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';
import { CreateShowtimeDto } from '../../dtos/create-showtime.dto';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

describe('CreateShowtimeUseCase', () => {
  let useCase: CreateShowtimeUseCase;
  let showtimeRepo: jest.Mocked<ShowtimeRepositoryInterface>;
  let movieRepo: jest.Mocked<MovieRepositoryInterface>;
  let roomRepo: jest.Mocked<RoomRepositoryInterface>;

  beforeEach(async () => {
    const mockShowtime: any = {
      id: 'st-1',
      movieId: 'm-1',
      roomId: 'r-1',
      startTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 3 * 3600000),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      isTimeConflict: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateShowtimeUseCase,
        {
          provide: 'ShowtimeRepositoryInterface',
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findActive: jest.fn(),
            findByMovieId: jest.fn(),
            findByRoomId: jest.fn(),
            findByDateRange: jest.fn(),
            findByRoomAndDateRange: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: 'MovieRepositoryInterface',
          useValue: { findById: jest.fn() },
        },
        {
          provide: 'RoomRepositoryInterface',
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(CreateShowtimeUseCase);
    showtimeRepo = module.get('ShowtimeRepositoryInterface');
    movieRepo = module.get('MovieRepositoryInterface');
    roomRepo = module.get('RoomRepositoryInterface');

    // Defaults
    movieRepo.findById.mockResolvedValue({ id: 'm-1' } as any);
    roomRepo.findById.mockResolvedValue({ id: 'r-1' } as any);
    showtimeRepo.findByRoomAndDateRange.mockResolvedValue([]);
    showtimeRepo.create.mockImplementation(async (s: any) => s);
  });

  it('should create a showtime successfully', async () => {
    const dto: CreateShowtimeDto = {
      movieId: 'm-1',
      roomId: 'r-1',
      startTime: new Date(Date.now() + 3600000) as any,
      durationMinutes: 120,
    };

    const result = await useCase.execute(dto);
    expect(result).toBeDefined();
    expect(showtimeRepo.create).toHaveBeenCalled();
  });

  it('should fail if movie not found', async () => {
    movieRepo.findById.mockResolvedValueOnce(null);
    const dto: CreateShowtimeDto = {
      movieId: 'not-exists',
      roomId: 'r-1',
      startTime: new Date(Date.now() + 3600000) as any,
      durationMinutes: 120,
    };
    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should fail if room not found', async () => {
    roomRepo.findById.mockResolvedValueOnce(null);
    const dto: CreateShowtimeDto = {
      movieId: 'm-1',
      roomId: 'not-exists',
      startTime: new Date(Date.now() + 3600000) as any,
      durationMinutes: 120,
    };
    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should fail if startTime is in the past', async () => {
    const dto: CreateShowtimeDto = {
      movieId: 'm-1',
      roomId: 'r-1',
      startTime: new Date(Date.now() - 3600000) as any,
      durationMinutes: 120,
    };
    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should fail on time conflict', async () => {
    const future = new Date(Date.now() + 3600000);
    const dto: CreateShowtimeDto = {
      movieId: 'm-1',
      roomId: 'r-1',
      startTime: future as any,
      durationMinutes: 120,
    };
    // Simulate existing overlapping showtime
    showtimeRepo.findByRoomAndDateRange.mockResolvedValueOnce([
      {
        id: 'st-existing',
        roomId: 'r-1',
        startTime: new Date(future.getTime() + 15 * 60000),
        endTime: new Date(future.getTime() + 90 * 60000),
        isActive: true,
      } as any,
    ]);
    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
