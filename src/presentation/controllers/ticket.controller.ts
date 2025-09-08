import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PurchaseTicketUseCase } from '../../application/use-cases/showtime/purchase-ticket.use-case';
import { PurchaseTicketDto } from '../../application/dtos/purchase-ticket.dto';

@ApiTags('Tickets')
@Controller('showtimes')
export class TicketController {
  constructor(private readonly purchaseTicketUseCase: PurchaseTicketUseCase) {}

  @Post(':showtimeId/tickets')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Purchase a ticket for a showtime' })
  @ApiParam({ name: 'showtimeId', description: 'Showtime ID' })
  @ApiResponse({ status: 201, description: 'Ticket purchased' })
  @ApiResponse({ status: 400, description: 'Past showtime or capacity exceeded' })
  @ApiResponse({ status: 404, description: 'Showtime or Room not found' })
  async purchase(@Param('showtimeId') showtimeId: string, @Body() dto: PurchaseTicketDto) {
    const ticket = await this.purchaseTicketUseCase.execute({ showtimeId, purchaserName: dto.purchaserName });
    return {
      id: ticket.id,
      showtimeId: ticket.showtimeId,
      purchaserName: ticket.purchaserName,
      createdAt: ticket.createdAt instanceof Date ? ticket.createdAt.toISOString() : ticket.createdAt,
    };
  }
}


