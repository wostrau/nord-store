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

describe('protected routes', () => {
  it('requires a bearer token for the cart API', async () => {
    const response = await request(app).get('/api/cart').expect(401);

    expect(response.body).toEqual({
      message: 'Authentication token is required.'
    });
  });

  it('requires a bearer token for admin product writes', async () => {
    const response = await request(app).post('/api/admin/products').expect(401);

    expect(response.body).toEqual({
      message: 'Authentication token is required.'
    });
  });
});

describe('API validation', () => {
  it('validates auth signup body fields before accessing the database', async () => {
    const response = await request(app).post('/api/auth/signup').send({}).expect(400);

    expect(response.body).toEqual({
      message: 'Email and password are required.'
    });
  });

  it('rejects invalid product identifiers', async () => {
    const response = await request(app).get('/api/products/not-a-product-id').expect(400);

    expect(response.body).toEqual({
      message: 'Product ID is invalid.'
    });
  });
});
