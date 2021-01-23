import request from 'supertest';
import { app } from '../src';

describe('GET /', () => {
  it('should return 200 OK', () => {
    return request(app).get('/').expect(200);
  });
});
