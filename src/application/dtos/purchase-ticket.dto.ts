import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PurchaseTicketDto {
  @ApiProperty({ description: 'Purchaser full name', example: 'John Doe', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  purchaserName: string;
}


