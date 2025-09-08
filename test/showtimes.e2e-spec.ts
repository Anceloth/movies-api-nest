import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Showtimes (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  async function getAnyMovieId() {
    const res = await request(app.getHttpServer()).get('/api/v1/movies').expect(200);
    return res.body.data.movies[0].id as string;
  }

  async function getAnyRoomId() {
    const res = await request(app.getHttpServer()).get('/api/v1/rooms').expect(200);
    return res.body.data.rooms[0].id as string;
  }

  it('should create a showtime', async () => {
    const movieId = await getAnyMovieId();
    const roomId = await getAnyRoomId();
    const startTime = new Date(Date.now() + 24 * 3600000).toISOString();

    const res = await request(app.getHttpServer())
      .post('/api/v1/showtimes')
      .send({ movieId, roomId, startTime, durationMinutes: 120 })
      .expect(201);

    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.movieId).toBe(movieId);
    expect(res.body.data.roomId).toBe(roomId);
  });

  it('should reject creating a showtime in the past', async () => {
    const movieId = await getAnyMovieId();
    const roomId = await getAnyRoomId();
    const startTime = new Date(Date.now() - 3600000).toISOString();

    await request(app.getHttpServer())
      .post('/api/v1/showtimes')
      .send({ movieId, roomId, startTime, durationMinutes: 120 })
      .expect(400);
  });

  it('should reject overlapping showtimes in same room', async () => {
    const movieId = await getAnyMovieId();
    const roomId = await getAnyRoomId();
    const startTime = new Date(Date.now() + 48 * 3600000).toISOString();

    // create base showtime
    await request(app.getHttpServer())
      .post('/api/v1/showtimes')
      .send({ movieId, roomId, startTime, durationMinutes: 120 })
      .expect(201);

    // attempt overlapping
    await request(app.getHttpServer())
      .post('/api/v1/showtimes')
      .send({ movieId, roomId, startTime, durationMinutes: 90 })
      .expect(409);
  });
});


