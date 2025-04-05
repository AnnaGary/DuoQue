import request from 'supertest';
import { connectDB } from './index.js';

beforeAll(async () => {
  await connectDB();
});

describe('Server Endpoints', () => {
  test('GET /index.html should return HTML', async () => {
    const res = await request('http://localhost:3000').get('/index.html');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  test('POST /api/users/login should handle missing data', async () => {
    const res = await request('http://localhost:3000')
      .post('/api/users/login')
      .send({});

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBeDefined();
  });

  test('GET /nonexistent should return 404', async () => {
    const res = await request('http://localhost:3000').get('/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});
