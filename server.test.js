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

    test('PUT /api/users/login should return 405 or 404', async () => {
    const res = await request('http://localhost:3000')
      .put('/api/users/login')
      .send({ username: 'user', password: 'pass' });

    expect([404, 405]).toContain(res.statusCode);
  });

  test('GET /style.css should return CSS content', async () => {
    const res = await request('http://localhost:3000').get('/style.css');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/css');
  });
});
