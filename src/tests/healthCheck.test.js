const request = require('supertest');
const HealthCheck = require('../models/HealthCheck');
const sequelize = require('../config/database');
const { app, server } = require('../app'); // Import your Express app

beforeAll(async () => {
  // Sync database before tests
  await sequelize.sync();
});

afterAll(async () => {
  // Close database connection after tests
  await sequelize.close();
  server.close();
});

describe('Health Check API Tests', () => {
  
  test('GET /healthz should return 200 OK and insert a record', async () => {
    // get initial count
    const initialCount = await HealthCheck.count();

    const response = await request(app).get('/healthz');
    expect(response.status).toBe(200);

    // Verify that a record was inserted
    const newCount = await HealthCheck.count();
    expect(newCount).toBe(initialCount + 1);
  });

  test('POST /healthz should return 405 Method Not Allowed', async () => {
    const response = await request(app).post('/healthz');
    expect(response.status).toBe(405);
  });

  test('PUT /healthz should return 405 Method Not Allowed', async () => {
    const response = await request(app).put('/healthz');
    expect(response.status).toBe(405);
  });

  test('DELETE /healthz should return 405 Method Not Allowed', async () => {
    const response = await request(app).delete('/healthz');
    expect(response.status).toBe(405);
  });

  test('PATCH /healthz should return 405 Method Not Allowed', async () => {
    const response = await request(app).patch('/healthz');
    expect(response.status).toBe(405);
  });

  test('OPTIONS /healthz should return 405 Method Not Allowed', async () => {
    const response = await request(app).options('/healthz');
    expect(response.status).toBe(405);
  });

  test('GET /healthz with payload should return 400 Bad Request', async () => {
    const response = await request(app)
      .get('/healthz')
      .send({ invalid: 'payload' });

    expect(response.status).toBe(400);
  });

  test('GET /healthz with query parameters should return 400 Bad Request', async () => {
    const response = await request(app).get('/healthz?param=value');
    expect(response.status).toBe(400);
  });

  test('Database failure should return 503 Service Unavailable', async () => {
    // // Simulate a database failure by closing the connection
    // await sequelize.close();

    // const response = await request(app).get('/healthz');
    // expect(response.status).toBe(503);

    // // Reconnect database for other tests
    // await sequelize.sync();

    jest.spyOn(HealthCheck, 'create').mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/healthz');
    expect(response.status).toBe(503);

    // Restore the original function
    HealthCheck.create.mockRestore();

  });

});
