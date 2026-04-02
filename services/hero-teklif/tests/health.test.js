const request = require('supertest');
const { spawn } = require('child_process');
const path = require('path');

jest.setTimeout(30000);

let server;

beforeAll((done) => {
  const servicePath = path.join(__dirname, '..', 'index.js');
  server = spawn('node', [servicePath], { env: { ...process.env, PORT: '4000', REDIS_URL: 'redis://localhost:6379' } });
  server.stdout.on('data', (data) => {
    if (data.toString().includes('hero-teklif running')) {
      done();
    }
  });
  server.stderr.on('data', (data) => {
    console.error(data.toString());
  });
});

afterAll(() => {
  server.kill();
});

describe('hero-teklif service', () => {
  it('should return health OK', async () => {
    const res = await request('http://localhost:4000').get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(['ready', 'unknown']).toContain(res.body.status);
    expect(res.body).toHaveProperty('redisPing', 'PONG');
  });

  it('should return contract schema', async () => {
    const res = await request('http://localhost:4000').get('/contract');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('contract');
    expect(res.body.contract).toHaveProperty('required');
  });
});
