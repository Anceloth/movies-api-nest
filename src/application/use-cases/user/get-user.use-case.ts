import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { UserRepositoryInterface } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
