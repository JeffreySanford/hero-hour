import axios from 'axios';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { waitForPortOpen } from '@nx/node/utils';
import { join } from 'path';
import { promises as fs, existsSync } from 'fs';

const startApiServer = async (port: number, storePath: string): Promise<ChildProcessWithoutNullStreams> => {
  const proc = spawn('node', ['dist/apps/api/main.js'], {
    env: {
      ...process.env,
      PORT: String(port),
      GAME_PROFILE_STORE_PATH: storePath,
      NODE_ENV: 'development',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });


  proc.stdout.on('data', (d) => process.stdout.write(`[api-server:${port}] ${d}`));
  proc.stderr.on('data', (d) => process.stderr.write(`[api-server:${port}] ${d}`));

  await waitForPortOpen(port, { host: 'localhost' });
  return proc;
};

const stopApiServer = async (proc: ChildProcessWithoutNullStreams): Promise<void> => {
  if (!proc.killed) proc.kill();
  return new Promise((resolve) => proc.on('exit', () => resolve()));
};

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });

  it('should persist game-profile state across API process restart', async () => {
    const tmpDir = join(process.cwd(), 'tmp');
    await fs.mkdir(tmpDir, { recursive: true });
    const persistenceFile = join(tmpDir, 'api-game-profile-persist.json');
    if (existsSync(persistenceFile)) await fs.unlink(persistenceFile);

    const port1 = 4444;
    const port2 = 4445;

    const server1 = await startApiServer(port1, persistenceFile);
    const baseUrl1 = `http://localhost:${port1}/api`;
    const username = `persistUser-${Date.now()}`;
    const email = 'admin@example.com';

    let loginRes = await axios.post(`${baseUrl1}/auth/login`, { email, password: 'password' });
    expect(loginRes.status).toBe(200);
    const token = loginRes.data.accessToken;

    let activityRes = await axios.post(`${baseUrl1}/game-profile/${username}/activity`, {
      userId: username,
      activityType: 'work',
      intensity: 4,
    }, { headers: { Authorization: `Bearer ${token}` } });
    expect(activityRes.status).toBe(201);

    await stopApiServer(server1);

    const server2 = await startApiServer(port2, persistenceFile);
    const baseUrl2 = `http://localhost:${port2}/api`;

    loginRes = await axios.post(`${baseUrl2}/auth/login`, { email, password: 'password' });
    expect(loginRes.status).toBe(200);
    const token2 = loginRes.data.accessToken;

    const profileRes = await axios.get(`${baseUrl2}/game-profile/${username}`, {
      headers: { Authorization: `Bearer ${token2}` },
    });
    expect(profileRes.status).toBe(200);
    expect(profileRes.data).toHaveProperty('userId', username);

    await stopApiServer(server2);

    if (existsSync(persistenceFile)) await fs.unlink(persistenceFile);
  }, 120000);
});
