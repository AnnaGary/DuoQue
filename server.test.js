/**
 * @jest-environment jsdom
 */
const request = require('supertest');
const server = require('./server.js');

describe('Server Tests', () => {
  const PORT = 3000;
  const serverUrl = `http://localhost:${PORT}`;

  afterAll((done) => {
    server.close(done);
  });

  test('returns index.html with status code 200', async () => {
    const res = await request(serverUrl).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  test('nonexistent returns a 404 status', async () => {
    const res = await request(serverUrl).get('/nonexistent');
    expect(res.status).toBe(404);
  });
});
