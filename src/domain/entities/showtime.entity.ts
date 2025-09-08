import * as crypto from 'crypto';

export class Showtime {
  constructor(
    public readonly id: string,
    public readonly movieId: string,
    public readonly roomId: string,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(movieId: string, roomId: string, startTime: Date, durationMinutes: number = 120): Showtime {
    const now = new Date();
    const id = crypto.randomUUID();
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    return new Showtime(id, movieId, roomId, startTime, endTime, true, now, now);
  }

  update(movieId?: string, roomId?: string, startTime?: Date, durationMinutes?: number): Showtime {
    const newEndTime = startTime && durationMinutes 
      ? new Date(startTime.getTime() + durationMinutes * 60000)
      : this.endTime;

    return new Showtime(
      this.id,
      movieId ?? this.movieId,
      roomId ?? this.roomId,
      startTime ?? this.startTime,
      newEndTime,
      this.isActive,
      this.createdAt,
      new Date(),
    );
  }

  deactivate(): Showtime {
    return new Showtime(
      this.id,
      this.movieId,
      this.roomId,
      this.startTime,
      this.endTime,
      false,
      this.createdAt,
      new Date(),
    );
  }

  activate(): Showtime {
    return new Showtime(
      this.id,
      this.movieId,
      this.roomId,
      this.startTime,
      this.endTime,
      true,
      this.createdAt,
      new Date(),
    );
  }

  isTimeConflict(other: Showtime): boolean {
    // Check if this showtime conflicts with another showtime in the same room
    if (this.roomId !== other.roomId) {
      return false;
    }

    // Check if time ranges overlap
    return this.startTime < other.endTime && this.endTime > other.startTime;
  }
}
