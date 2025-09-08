import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseTicketUseCase } from './purchase-ticket.use-case';
import { TicketRepositoryInterface } from '../../../domain/repositories/ticket.repository.interface';
import { ShowtimeRepositoryInterface } from '../../../domain/repositories/showtime.repository.interface';
import { RoomRepositoryInterface } from '../../../domain/repositories/room.repository.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PurchaseTicketUseCase', () => {
  let useCase: PurchaseTicketUseCase;
  let ticketRepo: jest.Mocked<TicketRepositoryInterface>;
  let showtimeRepo: jest.Mocked<ShowtimeRepositoryInterface>;
  let roomRepo: jest.Mocked<RoomRepositoryInterface>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseTicketUseCase,
        { provide: 'TicketRepositoryInterface', useValue: { create: jest.fn(), countByShowtimeId: jest.fn() } },
        { provide: 'ShowtimeRepositoryInterface', useValue: { findById: jest.fn() } },
        { provide: 'RoomRepositoryInterface', useValue: { findById: jest.fn() } },
      ],
    }).compile();

    useCase = module.get(PurchaseTicketUseCase);
    ticketRepo = module.get('TicketRepositoryInterface');
    showtimeRepo = module.get('ShowtimeRepositoryInterface');
    roomRepo = module.get('RoomRepositoryInterface');
  });

  it('should purchase a ticket when capacity allows and showtime is future', async () => {
    const future = new Date(Date.now() + 3600000);
    showtimeRepo.findById.mockResolvedValue({ id: 'st-1', roomId: 'r-1', startTime: future } as any);
    roomRepo.findById.mockResolvedValue({ id: 'r-1', capacity: 100 } as any);
    ticketRepo.countByShowtimeId.mockResolvedValue(10);
    ticketRepo.create.mockImplementation(async (t) => t);

    const res = await useCase.execute({ showtimeId: 'st-1', purchaserName: 'Alice' });
    expect(res).toBeDefined();
    expect(ticketRepo.create).toHaveBeenCalled();
  });

  it('should fail if showtime not found', async () => {
    showtimeRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ showtimeId: 'X', purchaserName: 'Bob' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should fail if room capacity exceeded', async () => {
    const future = new Date(Date.now() + 3600000);
    showtimeRepo.findById.mockResolvedValue({ id: 'st-1', roomId: 'r-1', startTime: future } as any);
    roomRepo.findById.mockResolvedValue({ id: 'r-1', capacity: 10 } as any);
    ticketRepo.countByShowtimeId.mockResolvedValue(10);

    await expect(useCase.execute({ showtimeId: 'st-1', purchaserName: 'Carol' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should fail if showtime is in the past', async () => {
    const past = new Date(Date.now() - 3600000);
    showtimeRepo.findById.mockResolvedValue({ id: 'st-1', roomId: 'r-1', startTime: past } as any);
    await expect(useCase.execute({ showtimeId: 'st-1', purchaserName: 'Dave' })).rejects.toBeInstanceOf(BadRequestException);
  });
});


