import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimeController } from './showtime.controller';
import { CreateShowtimeUseCase, GetShowtimeUseCase, GetShowtimesUseCase, UpdateShowtimeUseCase, DeleteShowtimeUseCase } from '../../application/use-cases/showtime';

describe('ShowtimeController', () => {
  let controller: ShowtimeController;
  let createUC: jest.Mocked<CreateShowtimeUseCase>;
  let getUC: jest.Mocked<GetShowtimeUseCase>;
  let listUC: jest.Mocked<GetShowtimesUseCase>;
  let updateUC: jest.Mocked<UpdateShowtimeUseCase>;
  let deleteUC: jest.Mocked<DeleteShowtimeUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimeController],
      providers: [
        { provide: CreateShowtimeUseCase, useValue: { execute: jest.fn() } },
        { provide: GetShowtimeUseCase, useValue: { execute: jest.fn() } },
        { provide: GetShowtimesUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateShowtimeUseCase, useValue: { execute: jest.fn() } },
        { provide: DeleteShowtimeUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get(ShowtimeController);
    createUC = module.get(CreateShowtimeUseCase);
    getUC = module.get(GetShowtimeUseCase);
    listUC = module.get(GetShowtimesUseCase);
    updateUC = module.get(UpdateShowtimeUseCase);
    deleteUC = module.get(DeleteShowtimeUseCase);
  });

  it('should map created showtime response', async () => {
    const now = new Date();
    const st: any = { id: '1', movieId: 'm', roomId: 'r', startTime: now, endTime: new Date(now.getTime() + 7200000), isActive: true, createdAt: now, updatedAt: now };
    (createUC.execute as jest.Mock).mockResolvedValue(st);
    const res = await controller.create({ movieId: 'm', roomId: 'r', startTime: now as any, durationMinutes: 120 });
    expect(res.id).toBe('1');
    expect(res.startTime).toBe(now.toISOString());
  });

  it('should list showtimes with pagination', async () => {
    const now = new Date();
    (listUC.execute as jest.Mock).mockResolvedValue({ showtimes: [{ id: '1', startTime: now, endTime: now }], total: 1, page: 1, limit: 10 });
    const res: any = await controller.findAll({ page: 1, limit: 10 } as any);
    expect(res.total).toBe(1);
    expect(res.showtimes[0].startTime).toBe(now.toISOString());
  });
});


