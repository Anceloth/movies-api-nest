import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateShowtimesTable1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'showtimes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'movieId',
            type: 'uuid',
            isNullable: false,
            comment: 'Reference to movies table',
          },
          {
            name: 'roomId',
            type: 'uuid',
            isNullable: false,
            comment: 'Reference to rooms table',
          },
          {
            name: 'startTime',
            type: 'timestamp',
            isNullable: false,
            comment: 'Showtime start time',
          },
          {
            name: 'endTime',
            type: 'timestamp',
            isNullable: false,
            comment: 'Showtime end time',
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
            comment: 'Showtime active status',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            comment: 'Creation timestamp',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            comment: 'Last update timestamp',
          },
        ],
      }),
      true,
    );

    // Add foreign key constraints
    await queryRunner.createForeignKey(
      'showtimes',
      new TableForeignKey({
        columnNames: ['movieId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'movies',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'showtimes',
      new TableForeignKey({
        columnNames: ['roomId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'rooms',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Add indexes for better performance
    await queryRunner.query(`
      CREATE INDEX idx_showtimes_movie_id ON showtimes ("movieId");
    `);

    await queryRunner.query(`
      CREATE INDEX idx_showtimes_room_id ON showtimes ("roomId");
    `);

    await queryRunner.query(`
      CREATE INDEX idx_showtimes_start_time ON showtimes ("startTime");
    `);

    await queryRunner.query(`
      CREATE INDEX idx_showtimes_is_active ON showtimes ("isActive");
    `);

    // Add unique constraint to prevent overlapping showtimes in the same room
    await queryRunner.query(`
      CREATE UNIQUE INDEX idx_showtimes_room_time_unique 
      ON showtimes ("roomId", "startTime") 
      WHERE "isActive" = true;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('showtimes');
  }
}
