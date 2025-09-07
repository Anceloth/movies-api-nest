export class Movie {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly genre: string,
    public readonly director: string,
    public readonly releaseDate: Date,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    title: string,
    genre: string,
    director: string,
    releaseDate: Date,
  ): Movie {
    const now = new Date();
    const id = crypto.randomUUID();

    return new Movie(
      id,
      title,
      genre,
      director,
      releaseDate,
      true,
      now,
      now,
    );
  }

  update(
    title?: string,
    genre?: string,
    director?: string,
    releaseDate?: Date,
  ): Movie {
    return new Movie(
      this.id,
      title ?? this.title,
      genre ?? this.genre,
      director ?? this.director,
      releaseDate ?? this.releaseDate,
      this.isActive,
      this.createdAt,
      new Date(),
    );
  }

  deactivate(): Movie {
    return new Movie(
      this.id,
      this.title,
      this.genre,
      this.director,
      this.releaseDate,
      false,
      this.createdAt,
      new Date(),
    );
  }

  activate(): Movie {
    return new Movie(
      this.id,
      this.title,
      this.genre,
      this.director,
      this.releaseDate,
      true,
      this.createdAt,
      new Date(),
    );
  }
}
