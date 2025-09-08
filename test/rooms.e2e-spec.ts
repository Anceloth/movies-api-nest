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
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create and get a room', async () => {
    // Create a room
    const createRoomDto = {
      name: 'Sala Test E2E',
      capacity: 50,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/rooms')
      .send(createRoomDto)
      .expect(201);

    const roomId = createResponse.body.data.data.id;

    // Get the created room
    await request(app.getHttpServer())
      .get(`/api/v1/rooms/${roomId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.data.name).toBe('Sala Test E2E');
        expect(res.body.data.data.capacity).toBe(50);
        expect(res.body.data.data.isActive).toBe(true);
      });
  });

  it('should list rooms with pagination', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/rooms?page=1&limit=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.data.data).toHaveProperty('rooms');
        expect(res.body.data.data).toHaveProperty('total');
        expect(res.body.data.data).toHaveProperty('page');
        expect(res.body.data.data).toHaveProperty('limit');
        expect(Array.isArray(res.body.data.data.rooms)).toBe(true);
      });
  });
});
