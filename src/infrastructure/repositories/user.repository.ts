import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { UserMapper } from '../mappers/user.mapper';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const userModel = await this.userRepository.findOne({ where: { id } });
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await this.userRepository.findOne({ where: { email } });
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async create(user: Partial<User>): Promise<User> {
    // Convert partial domain entity to model for persistence
    const userModel = this.userRepository.create({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      isActive: user.isActive,
      avatar: user.avatar,
    });

    const savedUserModel = await this.userRepository.save(userModel);
    return UserMapper.toDomain(savedUserModel);
  }
}
