import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../app.js';
import { RoutePath } from '../routes/route-paths.js';

const databaseUnavailableMessages = [
  'MONGODB_URI is not configured.',
  'MongoDB connection is not ready: disconnected.'
];

describe('GET /api/health', () => {
  it('returns the service health payload', async () => {
    const response = await request(app).get(RoutePath.api.health).expect(200);

    expect(response.body).toMatchObject({
      status: 'ok',
      service: 'nord-store-backend'
    });
    expect(['not_configured', 'disconnected', 'connected']).toContain(response.body.database.status);
    expect(typeof response.body.database.configured).toBe('boolean');
  });
});

describe('protected routes', () => {
  it('requires a bearer token for the cart API', async () => {
    const response = await request(app).get(RoutePath.api.cart).expect(401);

    expect(response.body).toEqual({
      message: 'Authentication token is required.'
    });
  });

  it('requires a bearer token for admin product writes', async () => {
    const response = await request(app)
      .post(`${RoutePath.api.admin}${RoutePath.admin.products}`)
      .expect(401);

    expect(response.body).toEqual({
      message: 'Authentication token is required.'
    });
  });
});

describe('API validation', () => {
  it('returns a clear error when auth needs MongoDB but it is not configured', async () => {
    const response = await request(app)
      .post(`${RoutePath.api.auth}${RoutePath.auth.login}`)
      .send({ email: 'user@example.com', password: 'password' })
      .expect(503);

    expect(databaseUnavailableMessages).toContain(response.body.message);
  });

  it('returns a clear error when product APIs need MongoDB but it is not configured', async () => {
    const response = await request(app).get(RoutePath.api.products).expect(503);

    expect(databaseUnavailableMessages).toContain(response.body.message);
  });
});
