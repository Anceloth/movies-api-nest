import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Tickets (e2e)', () => {
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

  async function getFutureShowtimeId() {
    const res = await request(app.getHttpServer()).get('/api/v1/showtimes').expect(200);
    const list = res.body.data.data?.showtimes || res.body.data.showtimes;
    const now = Date.now();
    const future = list.find((s: any) => new Date(s.startTime).getTime() > now);
    return future?.id as string;
  }

  it('should purchase a ticket', async () => {
    const showtimeId = await getFutureShowtimeId();
    await request(app.getHttpServer())
      .post(`/api/v1/showtimes/${showtimeId}/tickets`)
      .send({ purchaserName: 'E2E Buyer' })
      .expect(201)
      .expect((res) => {
        const data = res.body.data?.data || res.body.data;
        expect(data).toHaveProperty('id');
        expect(data.showtimeId).toBe(showtimeId);
      });
  });
});


