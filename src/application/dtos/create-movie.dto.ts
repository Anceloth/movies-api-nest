import { IsString, IsNotEmpty, IsDateString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Movie title',
    example: 'The Godfather',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiProperty({
    description: 'Movie genre',
    example: 'Drama',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  genre: string;

  @ApiProperty({
    description: 'Movie director',
    example: 'Francis Ford Coppola',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  director: string;

  @ApiProperty({
    description: 'Movie release date',
    example: '1972-03-24',
  })
  @IsDateString()
  @IsNotEmpty()
  releaseDate: string;
}
