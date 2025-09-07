import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../../presentation/controllers/user.controller';
import { UserModel } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import {
  CreateUserUseCase,
  GetUserUseCase,
} from '../../application/use-cases/user';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    CreateUserUseCase,
    GetUserUseCase,
  ],
})
export class UserModule {}
