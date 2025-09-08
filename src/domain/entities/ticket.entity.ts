import * as crypto from 'crypto';

export class Ticket {
  constructor(
    public readonly id: string,
    public readonly showtimeId: string,
    public readonly purchaserName: string,
    public readonly createdAt: Date,
  ) {}

  static create(params: { showtimeId: string; purchaserName: string }): Ticket {
    const id = crypto.randomUUID();
    const now = new Date();
    return new Ticket(id, params.showtimeId, params.purchaserName, now);
  }
}


