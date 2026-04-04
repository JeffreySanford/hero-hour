// Playwright integration test moved from apps/api/src/app/app.integration.spec.ts
import { request as pwRequest, APIRequestContext, expect as pwExpect, test as pwTest } from '@playwright/test';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { promises as fs, existsSync } from 'fs';
import { join } from 'path';

pwTest.describe('Vertical Slice Integration (Playwright)', () => {
  let apiContext: APIRequestContext;
  let accessToken: string;
  const baseURL = process.env.PLAYWRIGHT_API_BASE_URL || 'http://localhost:3333/api';

async function waitForHealth(url: string, timeout = 20000): Promise<void> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const resp = await fetch(`${url}/health`);
      if (resp.ok) return;
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Unable to reach ${url}/health within ${timeout}ms`);
}

function startApiServer(port: number, storePath: string): ChildProcessWithoutNullStreams {
  const isWindows = process.platform === 'win32';
  const cmd = isWindows ? 'pnpm.cmd' : 'pnpm';
  const proc = spawn(cmd, ['nx', 'serve', 'api', '--port', String(port), '--watch', 'false'], {
    env: { ...process.env, GAME_PROFILE_STORE_PATH: storePath },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  proc.stdout.on('data', (data) => {
    // keep output available for debugging in CI logs
    process.stdout.write(`[api-server:${port}] ${data}`);
  });
  proc.stderr.on('data', (data) => {
    process.stderr.write(`[api-server:${port}] ${data}`);
  });

  return proc;
}

async function stopApiServer(proc: ChildProcessWithoutNullStreams): Promise<void> {
  return new Promise((resolve) => {
    proc.on('exit', () => resolve());
    proc.kill();
  });
}

  pwTest.beforeAll(async () => {
    apiContext = await pwRequest.newContext({ baseURL });
  });

  pwTest.afterAll(async () => {
    await apiContext.dispose();
  });

  pwTest('registers a user and logs in', async () => {
    const registerDto = {
      email: 'integration@example.com',
      password: 'Test1234!',
      username: 'integrationUser',
    };
    const res = await apiContext.post('/auth/register', {
      data: registerDto,
    });
    pwExpect(res.status()).toBe(201);
    const resBody = await res.json();
    pwExpect(resBody).toHaveProperty('id');

    const loginRes = await apiContext.post('/auth/login', {
      data: { email: registerDto.email, password: registerDto.password },
    });
    pwExpect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    pwExpect(loginBody).toHaveProperty('accessToken');
    accessToken = loginBody.accessToken;
  });

  pwTest('creates onboarding state for the user', async () => {
    const onboardingDto = { stepName: 'life-role', data: { roles: ['student'] } };
    const res = await apiContext.post('/onboarding/step', {
      data: onboardingDto,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(res.status()).toBe(201);
    const resBody = await res.json();
    pwExpect(resBody).toHaveProperty('stepName', 'life-role');
  });

  pwTest('cross-device progression with explicit userId consistency', async () => {
    const userId = 'cross-device-user';

    const createQuest = await apiContext.post(`/game-profile/${userId}/quests`, {
      data: { userId, title: 'Sync Quest', lifeArea: 'career', status: 'pending', progress: 10 },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(createQuest.status()).toBe(201);
    const questBody = await createQuest.json();

    const completeQuest = await apiContext.post(`/game-profile/${userId}/quests/${questBody.id}/complete`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(completeQuest.status()).toBe(200);
    const completeBody = await completeQuest.json();

    pwExpect(completeBody).toHaveProperty('quest');
    pwExpect(completeBody).toHaveProperty('worldState');
    pwExpect(completeBody).toHaveProperty('profile');
    pwExpect(completeBody.quest.status).toBe('complete');
    pwExpect(completeBody.worldState.progress).toBeGreaterThanOrEqual(10);

    const worldState = await apiContext.get(`/game-profile/${userId}/world-state`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(worldState.status()).toBe(200);
    const worldStateData = await worldState.json();
    pwExpect(worldStateData.seed).toBe(completeBody.worldState.seed);
    pwExpect(worldStateData.progress).toBe(completeBody.worldState.progress);

    // simulate a second client (Flutter) reading same user journey
    const secondClientWorldState = await apiContext.get(`/game-profile/${userId}/world-state`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(secondClientWorldState.status()).toBe(200);
    const secondWorldStateData = await secondClientWorldState.json();
    pwExpect(secondWorldStateData).toEqual(worldStateData);
  });

  pwTest('weekly challenge progression is tracked via quest complete', async () => {
    const userId = 'weekly-challenge-user';

    const challengeCreate = await apiContext.post(`/game-profile/${userId}/weekly-challenges`, {
      data: {
        title: 'Complete 2 quests',
        description: 'Complete two quests this week',
        target: 2,
        rewardXp: 20,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(challengeCreate.status()).toBe(201);
    const challenge = await challengeCreate.json();

    const quest1 = await apiContext.post(`/game-profile/${userId}/quests`, {
      data: { userId, title: 'Q1', lifeArea: 'career', status: 'pending', progress: 10 },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(quest1.status()).toBe(201);
    const q1body = await quest1.json();

    const complete1 = await apiContext.post(`/game-profile/${userId}/quests/${q1body.id}/complete`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(complete1.status()).toBe(200);

    const quest2 = await apiContext.post(`/game-profile/${userId}/quests`, {
      data: { userId, title: 'Q2', lifeArea: 'health', status: 'pending', progress: 10 },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(quest2.status()).toBe(201);
    const q2body = await quest2.json();

    const complete2 = await apiContext.post(`/game-profile/${userId}/quests/${q2body.id}/complete`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(complete2.status()).toBe(200);

    const updated = await apiContext.get(`/game-profile/${userId}/weekly-challenges`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(updated.status()).toBe(200);
    const activeChallenges = await updated.json();
    pwExpect(activeChallenges).toEqual(expect.arrayContaining([expect.objectContaining({ id: challenge.id, status: 'complete', progress: 2 })]));
  });

  pwTest('saves a life-profile step', async () => {
    const lifeProfileDto = { roles: ['student'], priorities: ['health'], habitAnchors: ['morning'] };
    const res = await apiContext.patch('/life-profile', {
      data: lifeProfileDto,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(res.status()).toBe(200);
    const resBody = await res.json();
    pwExpect(resBody).toHaveProperty('roles');
    pwExpect(resBody.roles).toContain('student');
  });

  pwTest('confirms resulting game profile seed behavior', async () => {
    const res = await apiContext.get('/game-profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(res.status()).toBe(200);
    const resBody = await res.json();
    pwExpect(resBody).toHaveProperty('xp');
    pwExpect(resBody).toHaveProperty('level');
    pwExpect(resBody).toHaveProperty('displayName');
  });

  pwTest('contract-check /auth/login and /health responses', async () => {
    const loginRes = await apiContext.post('/auth/login', {
      data: { email: 'integration@example.com', password: 'Test1234!' },
    });
    pwExpect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    pwExpect(loginBody).toMatchObject({ accessToken: expect.any(String), refreshToken: expect.any(String) });

    const healthRes = await apiContext.get('/health');
    pwExpect(healthRes.status()).toBe(200);
    const healthBody = await healthRes.json();
    pwExpect(healthBody).toMatchObject({ status: expect.any(String), uptime: expect.any(Number) });

    // 3 consecutive checks condition
    for (let i = 0; i < 3; i++) {
      const checkRes = await apiContext.get('/health');
      pwExpect(checkRes.status()).toBe(200);
      const checkBody = await checkRes.json();
      pwExpect(checkBody.status).toMatch(/^(ok|degraded|down)$/);
      pwExpect(checkBody.uptime).toBeGreaterThanOrEqual(0);
    }
  });

  pwTest('game-profile GET/POST contract tests', async () => {
    const questDto = { userId: 'integrationUser', title: 'Roadmap quest', lifeArea: 'career', status: 'pending', progress: 10 };
    const postRes = await apiContext.post('/game-profile/integrationUser/quests', { data: questDto });
    pwExpect(postRes.status()).toBe(201);
    const questBody = await postRes.json();
    pwExpect(questBody).toMatchObject({ userId: 'integrationUser', title: 'Roadmap quest', lifeArea: 'career', status: 'pending' });

    const getRes = await apiContext.get('/game-profile/integrationUser/quests');
    pwExpect(getRes.status()).toBe(200);
    const quests = await getRes.json();
    pwExpect(quests).toEqual(expect.arrayContaining([expect.objectContaining({ title: 'Roadmap quest', progress: expect.any(Number) })]));
  });

  pwTest('creates quest and updates world seed', async () => {
    // create a quest in a life area
    const questDto = { userId: 'integrationUser', title: 'Read docs', lifeArea: 'career', status: 'pending', progress: 10 };
    const questRes = await apiContext.post('/game-profile/integrationUser/quests', { data: questDto });
    pwExpect(questRes.status()).toBe(201);

    const listRes = await apiContext.get('/game-profile/integrationUser/quests');
    pwExpect(listRes.status()).toBe(200);
    const quests = await listRes.json();
    pwExpect(quests).toEqual(expect.arrayContaining([expect.objectContaining({ title: 'Read docs', lifeArea: 'career' })]));

    const activityRes = await apiContext.post('/game-profile/integrationUser/activity', { data: { userId: 'integrationUser', activityType: 'exercise', intensity: 5 } });
    pwExpect(activityRes.status()).toBe(200);
    const worldState = await activityRes.json();
    pwExpect(worldState).toHaveProperty('seed');
    pwExpect(worldState).toHaveProperty('color');
    pwExpect(worldState).toHaveProperty('icon');
    pwExpect(worldState).toHaveProperty('progress');

    const badUpdateRes = await apiContext.put(`/game-profile/integrationUser/quests/${questBody.id}`, {
      data: { status: 'foo', progress: 150 },
    });
    pwExpect(badUpdateRes.status()).toBe(400);
  });

  pwTest('maintains world-state after sequential updates', async () => {
    const firstStateRes = await apiContext.get('/game-profile/integrationUser/world-state');
    pwExpect(firstStateRes.status()).toBe(200);
    const firstState = await firstStateRes.json();

    const activityRes = await apiContext.post('/game-profile/integrationUser/activity', { data: { userId: 'integrationUser', activityType: 'work', intensity: 3 } });
    pwExpect(activityRes.status()).toBe(200);

    const secondStateRes = await apiContext.get('/game-profile/integrationUser/world-state');
    pwExpect(secondStateRes.status()).toBe(200);
    const secondState = await secondStateRes.json();

    pwExpect(secondState.progress).toBeGreaterThanOrEqual(firstState.progress);
    pwExpect(secondState.seed).not.toBe(firstState.seed);
  });

  pwTest('quest-complete API returns joined payload and updates world state', async () => {
    const questDto = { userId: 'integrationUser', title: 'Complete RPC', lifeArea: 'career', status: 'pending', progress: 10 };
    const questRes = await apiContext.post('/game-profile/integrationUser/quests', { data: questDto });
    pwExpect(questRes.status()).toBe(201);
    const quest = await questRes.json();

    const worldBefore = await apiContext.get('/game-profile/integrationUser/world-state');
    pwExpect(worldBefore.status()).toBe(200);
    const worldStateBefore = await worldBefore.json();

    const completeRes = await apiContext.post(`/game-profile/integrationUser/quests/${quest.id}/complete`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    pwExpect(completeRes.status()).toBe(200);
    const completeBody = await completeRes.json();

    pwExpect(completeBody.quest.status).toBe('complete');
    pwExpect(completeBody.quest.progress).toBe(100);
    pwExpect(completeBody.worldState.progress).toBeGreaterThanOrEqual(worldStateBefore.progress);
    pwExpect(completeBody.profile.userId).toBe('integrationUser');

    const worldAfter = await apiContext.get('/game-profile/integrationUser/world-state');
    pwExpect(worldAfter.status()).toBe(200);
    const worldStateAfter = await worldAfter.json();
    pwExpect(worldStateAfter.seed).toBe(completeBody.worldState.seed);
    pwExpect(worldStateAfter.progress).toBe(completeBody.worldState.progress);
  });

  pwTest('process restart persistence for game profile flows', async () => {
    const registryDir = join(process.cwd(), 'tmp');
    await fs.mkdir(registryDir, { recursive: true });
    const registryPath = join(registryDir, 'api-game-profile-persist.json');
    if (existsSync(registryPath)) await fs.unlink(registryPath);

    const startServer = async (port: number) => {
      const proc = startApiServer(port, registryPath);
      await waitForHealth(`http://localhost:${port}`);
      return proc;
    };

    let serverProc = await startServer(4444);

    const registerContext = await pwRequest.newContext({ baseURL: 'http://localhost:4444/api' });
    const registerRes = await registerContext.post('/auth/register', {
      data: { email: 'persist@example.com', password: 'Test1234!', username: 'persistUser' },
    });
    pwExpect(registerRes.status()).toBe(201);

    const loginRes = await registerContext.post('/auth/login', {
      data: { email: 'persist@example.com', password: 'Test1234!' },
    });
    pwExpect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    const token = loginBody.accessToken;

    const activityRes = await registerContext.post('/game-profile/persistUser/activity', {
      data: { userId: 'persistUser', activityType: 'work', intensity: 3 },
      headers: { Authorization: `Bearer ${token}` },
    });
    pwExpect(activityRes.status()).toBe(200);

    await registerContext.dispose();
    await stopApiServer(serverProc);

    serverProc = await startServer(4445);

    const secondContext = await pwRequest.newContext({ baseURL: 'http://localhost:4445/api' });
    const loginRes2 = await secondContext.post('/auth/login', {
      data: { email: 'persist@example.com', password: 'Test1234!' },
    });
    pwExpect(loginRes2.status()).toBe(200);
    const loginBody2 = await loginRes2.json();
    const token2 = loginBody2.accessToken;

    const profileRes = await secondContext.get('/game-profile/persistUser', {
      headers: { Authorization: `Bearer ${token2}` },
    });
    pwExpect(profileRes.status()).toBe(200);
    const profile = await profileRes.json();
    pwExpect(profile).toHaveProperty('userId', 'persistUser');
    pwExpect(profile).toHaveProperty('avatar', 'default');

    await secondContext.dispose();
    await stopApiServer(serverProc);

    if (existsSync(registryPath)) await fs.unlink(registryPath);
  });
});