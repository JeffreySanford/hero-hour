// Playwright integration test moved from apps/api/src/app/app.integration.spec.ts
import { request as pwRequest, APIRequestContext, expect as pwExpect, test as pwTest } from '@playwright/test';

pwTest.describe('Vertical Slice Integration (Playwright)', () => {
  let apiContext: APIRequestContext;
  let accessToken: string;
  const baseURL = process.env.PLAYWRIGHT_API_BASE_URL || 'http://localhost:3333/api';

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
  });
});