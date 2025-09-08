import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../domain/entities/room.entity';
import { RoomRepositoryInterface } from '../../domain/repositories/room.repository.interface';
import { RoomModel } from '../models/room.model';
import { RoomMapper } from '../mappers/room.mapper';

@Injectable()
export class RoomRepository implements RoomRepositoryInterface {
  constructor(
    @InjectRepository(RoomModel)
    private readonly roomRepository: Repository<RoomModel>,
  ) {}

  async create(room: Room): Promise<Room> {
    const model = RoomMapper.toModel(room);
    const savedModel = await this.roomRepository.save(model);
    return RoomMapper.toDomain(savedModel);
  }

  async findById(id: string): Promise<Room | null> {
    const model = await this.roomRepository.findOne({ where: { id } });
    return model ? RoomMapper.toDomain(model) : null;
  }

  async findAll(): Promise<Room[]> {
    const models = await this.roomRepository.find();
    return RoomMapper.toDomainList(models);
  }

  async findByName(name: string): Promise<Room | null> {
    const model = await this.roomRepository.findOne({ where: { name } });
    return model ? RoomMapper.toDomain(model) : null;
  }

  async update(room: Room): Promise<Room> {
    const model = RoomMapper.toModel(room);
    const updatedModel = await this.roomRepository.save(model);
    return RoomMapper.toDomain(updatedModel);
  }

  async delete(id: string): Promise<void> {
    await this.roomRepository.delete(id);
  }

  async findActive(): Promise<Room[]> {
    const models = await this.roomRepository.find({ where: { isActive: true } });
    return RoomMapper.toDomainList(models);
  }
}
