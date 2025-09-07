import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { UserRepositoryInterface } from '../../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { User } from '../../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, firstName, lastName, avatar } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create domain entity using factory method
    const userId = uuidv4();
    const user = await User.create(
      userId,
      email,
      firstName,
      lastName,
      hashedPassword,
      avatar,
    );

    // Persist the user
    const savedUser = await this.userRepository.create(user);

    return savedUser;
  }
}
