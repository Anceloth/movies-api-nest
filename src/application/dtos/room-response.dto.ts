import { ApiProperty } from '@nestjs/swagger';

export class RoomResponseDto {
  @ApiProperty({
    description: 'Unique room ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Room name',
    example: 'Sala 1',
  })
  name: string;

  @ApiProperty({
    description: 'Room capacity in seats',
    example: 50,
  })
  capacity: number;

  @ApiProperty({
    description: 'Room active status',
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
