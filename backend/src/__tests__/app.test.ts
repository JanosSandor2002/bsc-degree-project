import request from 'supertest';
import app from '../app';

describe('Basic route test', () => {
  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});
