import * as crypto from 'crypto';

export class Room {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly capacity: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    name: string,
    capacity: number,
  ): Room {
    const now = new Date();
    const id = crypto.randomUUID();

    return new Room(
      id,
      name,
      capacity,
      true,
      now,
      now,
    );
  }

  update(
    name?: string,
    capacity?: number,
  ): Room {
    return new Room(
      this.id,
      name ?? this.name,
      capacity ?? this.capacity,
      this.isActive,
      this.createdAt,
      new Date(),
    );
  }

  deactivate(): Room {
    return new Room(
      this.id,
      this.name,
      this.capacity,
      false,
      this.createdAt,
      new Date(),
    );
  }

  activate(): Room {
    return new Room(
      this.id,
      this.name,
      this.capacity,
      true,
      this.createdAt,
      new Date(),
    );
  }
}
