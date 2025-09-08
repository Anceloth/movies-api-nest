import { Test, TestingModule } from '@nestjs/testing';
import { GetShowtimesUseCase } from './get-showtimes.use-case';
import { ShowtimeRepositoryInterface } from '../../../domain/repositories/showtime.repository.interface';

describe('GetShowtimesUseCase', () => {
  let useCase: GetShowtimesUseCase;
  let showtimeRepo: jest.Mocked<ShowtimeRepositoryInterface>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetShowtimesUseCase,
        {
          provide: 'ShowtimeRepositoryInterface',
          useValue: {
            findAll: jest.fn(),
            findActive: jest.fn(),
            findByMovieId: jest.fn(),
            findByRoomId: jest.fn(),
            findByDateRange: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(GetShowtimesUseCase);
    showtimeRepo = module.get('ShowtimeRepositoryInterface');
  });

  it('should list active showtimes by default', async () => {
    showtimeRepo.findActive.mockResolvedValue([
      { id: '1', isActive: true } as any,
    ]);
    const res = await useCase.execute({ page: 1, limit: 10, activeOnly: true });
    expect(res.total).toBe(1);
    expect(showtimeRepo.findActive).toHaveBeenCalled();
  });

  it('should filter by movieId', async () => {
    showtimeRepo.findByMovieId.mockResolvedValue([
      { id: '1', movieId: 'm-1' } as any,
    ]);
    const res = await useCase.execute({
      movieId: 'm-1',
      page: 1,
      limit: 10,
    } as any);
    expect(res.total).toBe(1);
    expect(showtimeRepo.findByMovieId).toHaveBeenCalledWith('m-1');
  });
});
