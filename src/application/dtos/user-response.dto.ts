import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'john@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'John' })
  @Expose()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Expose()
  lastName: string;

  @ApiProperty({ example: 'John Doe' })
  @Expose()
  fullName: string;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @Expose()
  avatar?: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string;
}
