import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Showtime } from '../../domain/entities/showtime.entity';
import { ShowtimeRepositoryInterface } from '../../domain/repositories/showtime.repository.interface';
import { ShowtimeModel } from '../models/showtime.model';
import { ShowtimeMapper } from '../mappers/showtime.mapper';

@Injectable()
export class ShowtimeRepository implements ShowtimeRepositoryInterface {
  constructor(
    @InjectRepository(ShowtimeModel)
    private readonly showtimeRepository: Repository<ShowtimeModel>,
  ) {}

  async create(showtime: Showtime): Promise<Showtime> {
    const model = ShowtimeMapper.toModel(showtime);
    const savedModel = await this.showtimeRepository.save(model);
    return ShowtimeMapper.toDomain(savedModel);
  }

  async findById(id: string): Promise<Showtime | null> {
    const model = await this.showtimeRepository.findOne({ where: { id } });
    return model ? ShowtimeMapper.toDomain(model) : null;
  }

  async findAll(): Promise<Showtime[]> {
    const models = await this.showtimeRepository.find();
    return ShowtimeMapper.toDomainList(models);
  }

  async findByMovieId(movieId: string): Promise<Showtime[]> {
    const models = await this.showtimeRepository.find({ 
      where: { movieId },
      order: { startTime: 'ASC' }
    });
    return ShowtimeMapper.toDomainList(models);
  }

  async findByRoomId(roomId: string): Promise<Showtime[]> {
    const models = await this.showtimeRepository.find({ 
      where: { roomId },
      order: { startTime: 'ASC' }
    });
    return ShowtimeMapper.toDomainList(models);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Showtime[]> {
    const models = await this.showtimeRepository.find({
      where: {
        startTime: Between(startDate, endDate),
      },
      order: { startTime: 'ASC' },
    });
    return ShowtimeMapper.toDomainList(models);
  }

  async findByRoomAndDateRange(roomId: string, startDate: Date, endDate: Date): Promise<Showtime[]> {
    const models = await this.showtimeRepository.find({
      where: {
        roomId,
        startTime: Between(startDate, endDate),
      },
      order: { startTime: 'ASC' },
    });
    return ShowtimeMapper.toDomainList(models);
  }

  async update(showtime: Showtime): Promise<Showtime> {
    const model = ShowtimeMapper.toModel(showtime);
    const updatedModel = await this.showtimeRepository.save(model);
    return ShowtimeMapper.toDomain(updatedModel);
  }

  async delete(id: string): Promise<void> {
    await this.showtimeRepository.delete(id);
  }

  async findActive(): Promise<Showtime[]> {
    const models = await this.showtimeRepository.find({ 
      where: { isActive: true },
      order: { startTime: 'ASC' }
    });
    return ShowtimeMapper.toDomainList(models);
  }
}
