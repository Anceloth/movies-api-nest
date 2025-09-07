import { ApiProperty } from '@nestjs/swagger';

export class MovieResponseDto {
  @ApiProperty({
    description: 'Unique movie ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Movie title',
    example: 'The Godfather',
  })
  title: string;

  @ApiProperty({
    description: 'Movie genre',
    example: 'Drama',
  })
  genre: string;

  @ApiProperty({
    description: 'Movie director',
    example: 'Francis Ford Coppola',
  })
  director: string;

  @ApiProperty({
    description: 'Movie release date',
    example: '1972-03-24',
  })
  releaseDate: string;

  @ApiProperty({
    description: 'Movie active status',
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
