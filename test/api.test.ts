import request from 'supertest';
import server from '../src';

describe('GET /', () => {
  it('should return 200 OK', () => {
    return request(server.app)
      .get('/')
      .expect(200);
  });
});
