import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('App E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    jest.setTimeout(10000); // Set timeout for this hook
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    jest.setTimeout(10000); // Set timeout for this hook
    // Additional setup logic
  });

  afterAll(async () => {
    await app.close();
  });

  it('/', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });
});
