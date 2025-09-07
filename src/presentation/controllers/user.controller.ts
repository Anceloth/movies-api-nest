import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';
import { plainToClass } from 'class-transformer';
import {
  CreateUserUseCase,
  GetUserUseCase,
} from '../../application/use-cases/user';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(createUserDto);
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserUseCase.execute(id);
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
