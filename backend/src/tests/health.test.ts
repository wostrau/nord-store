import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../app.js';

describe('GET /api/health', () => {
  it('returns the service health payload', async () => {
    const response = await request(app).get('/api/health').expect(200);

    expect(response.body).toEqual({
      status: 'ok',
      service: 'nord-store-backend'
    });
  });
});
