import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Rooms CRUD (e2e)', () => {
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

  it('should create and get a room', async () => {
    // Create a room
    const unique = `Sala Test E2E ${Date.now()}`;
    const createRoomDto = {
      name: unique,
      capacity: 50,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/rooms')
      .send(createRoomDto)
      .expect(201);

    const roomId = createResponse.body.data.id;

    // Get the created room
    await request(app.getHttpServer())
      .get(`/api/v1/rooms/${roomId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.name).toBe(unique);
        expect(res.body.data.capacity).toBe(50);
        expect(res.body.data.isActive).toBe(true);
      });
  });

  it('should list rooms with pagination', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/rooms?page=1&limit=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('rooms');
        expect(res.body.data).toHaveProperty('total');
        expect(res.body.data).toHaveProperty('page');
        expect(res.body.data).toHaveProperty('limit');
        expect(Array.isArray(res.body.data.rooms)).toBe(true);
      });
  });
});
