import { ApiProperty } from '@nestjs/swagger';

export class ShowtimeResponseDto {
  @ApiProperty({
    description: 'Unique showtime ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Movie ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  movieId: string;

  @ApiProperty({
    description: 'Room ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  roomId: string;

  @ApiProperty({
    description: 'Showtime start time',
    example: '2024-01-15T19:00:00.000Z',
  })
  startTime: string;

  @ApiProperty({
    description: 'Showtime end time',
    example: '2024-01-15T21:00:00.000Z',
  })
  endTime: string;

  @ApiProperty({
    description: 'Showtime active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
