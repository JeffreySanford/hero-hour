import { test, expect } from '@playwright/test';

test.describe('Admin console end-to-end', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/health', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'ok', uptime: 9999 }),
      }),
    );

    await page.route('**/api/life-profile**', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        const payload = request.postDataJSON() as any;
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            userId: payload.userId ?? 'demo-user',
            firstName: payload.firstName ?? '',
            lastName: payload.lastName ?? '',
            age: payload.age ?? 0,
            preferredRole: payload.preferredRole ?? 'member',
            roles: [],
            schedule: {},
            priorities: [],
            frictionPoints: [],
            habitAnchors: [],
          }),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            userId: 'demo-user',
            firstName: 'Anne',
            lastName: 'Lee',
            age: 32,
            preferredRole: 'member',
            roles: [],
            schedule: {},
            priorities: [],
            frictionPoints: [],
            habitAnchors: [],
          }),
        });
      }
    });

    let worldState = { seed: 1, color: 'blue', icon: '🌱', progress: 0 };
    const sideQuests = [
      { id: 'sq-1', userId: 'demo-user', title: 'Quick setup', type: 'quick-win', completed: false, rewardXp: 10 },
      { id: 'sq-2', userId: 'demo-user', title: 'Daily streak', type: 'daily', completed: false, rewardXp: 20 },
      { id: 'sq-3', userId: 'demo-user', title: 'Bonus explorer', type: 'bonus', completed: false, rewardXp: 15 },
    ];
    const quests = [] as Array<{ id: string; userId: string; title: string; lifeArea: string; status: string; progress: number }>;


    await page.route('**/api/game-profile/demo-user/quests', async (route) => {
      if (route.request().method() === 'POST') {
        const payload = route.request().postDataJSON();
        console.log('[QUICK-QUEST-POST-BODY]', payload);
        const newQuest = {
          id: `q-${Date.now()}`,
          userId: 'demo-user',
          title: payload.title,
          lifeArea: payload.lifeArea,
          status: payload.status,
          progress: payload.progress,
        };
        quests.push(newQuest);
        return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(newQuest) });
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(quests) });
    });

    await page.route('**/api/game-profile/demo-user/world-state', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(worldState) }),
    );

    await page.route('**/api/game-profile/demo-user/side-quests', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(sideQuests) }),
    );

    await page.route('**/api/game-profile/demo-user/side-quests/*/claim', async (route) => {
      const url = new URL(route.request().url());
      const id = url.pathname.split('/').pop();
      const quest = sideQuests.find((q) => q.id === id);
      if (!quest) {
        return route.fulfill({ status: 404 });
      }
      quest.completed = true;
      worldState = { ...worldState, progress: Math.min(100, worldState.progress + 5), seed: worldState.seed + quest.rewardXp };
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(quest) });
    });

    await page.route('**/api/auth/login', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ accessToken: 'fake-token', refreshToken: 'fake-refresh' }),
      }),
    );

    await page.route('**/api/auth/logout', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      }),
    );

    await page.route('**/api/game-profile/demo-user/activity', async (route) => {
      const payload = await route.request().postDataJSON();
      const weights: Record<string, number> = { exercise: 10, work: 6, social: 8, rest: 4 };
      const weight = (weights[payload.activityType] ?? 2) * payload.intensity;
      worldState = {
        ...worldState,
        seed: worldState.seed + weight,
        color: ['blue', 'green', 'gold', 'purple'][worldState.seed % 4],
        icon: ['🌱', '⚡', '🔥', '🌟'][worldState.seed % 4],
        progress: Math.min(100, (worldState.seed % 101) + 1),
      };
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(worldState) });
    });
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('app loads and redirects to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h2', { hasText: 'Sign In' })).toHaveCount(1);
  });

  test('redirects to login when unauthenticated dashboard request', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h2', { hasText: 'Sign In' })).toHaveCount(1);
  });

  test('login works and dashboard renders health status', async ({ page }) => {
    await page.goto('/login');

    await Promise.all([
      page.waitForResponse('**/api/auth/login'),
      page.click('button:has-text("Enter the Forge")'),
      page.waitForURL('**/dashboard', { timeout: 20000 }),
    ]);

    await expect(page.locator('h2', { hasText: 'Dashboard' })).toBeVisible();
    await expect(page.locator('button:has-text("Refresh status")')).toBeEnabled();

    await page.click('button:has-text("Refresh status")');
    await expect(page.locator('span.status-chip')).toHaveText('ok', { timeout: 30000 });
    // ensure we check one match only to avoid strict locator ambiguity
    await expect(page.locator('p', { hasText: 'Connection:' }).first()).toBeVisible({ timeout: 30000 });
  });

  test('logout redirects to login and protects dashboard route', async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Enter the Forge")');
    await expect(page).toHaveURL('/dashboard');

    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL('/login');

    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  test('dashboard action navigates to life-profile', async ({ page }) => {
    await page.goto('/login');

    await Promise.all([
      page.waitForResponse('**/api/auth/login'),
      page.click('button:has-text("Enter the Forge")'),
      page.waitForURL('**/dashboard', { timeout: 20000 }),
    ]);

    await page.click('button:has-text("Life Profile")');
    await expect(page).toHaveURL('/life-profile');
    await expect(page.locator('h2', { hasText: 'Life Profile' })).toHaveCount(1);
  });

  test('dashboard and data persist across reload', async ({ page }) => {
    await page.goto('/login');

    await Promise.all([
      page.waitForResponse('**/api/auth/login'),
      page.click('button:has-text("Enter the Forge")'),
      page.waitForURL('**/dashboard', { timeout: 20000 }),
    ]);

    await expect(page.locator('h2', { hasText: 'Dashboard' })).toBeVisible();

    await page.reload();
    await page.waitForURL('**/dashboard', { timeout: 20000 });
    await expect(page.locator('h2', { hasText: 'Dashboard' })).toBeVisible();

    await page.click('button:has-text("Refresh status")');
    await expect(page.locator('span.status-chip')).toHaveText('ok', { timeout: 30000 });
  });

  test('dashboard card hierarchy matches content priority', async ({ page }) => {
    await page.goto('/login');

    await Promise.all([
      page.waitForResponse('**/api/auth/login'),
      page.click('button:has-text("Enter the Forge")'),
      page.waitForURL('**/dashboard', { timeout: 20000 }),
    ]);

    const headings = await page.locator('article.hero-card .hero-card__title').allTextContents();
    expect(headings[0]).toBe('API Status');
    expect(headings[1]).toBe('World Seed State');
    expect(headings[2]).toBe('Sync Status');
  });

  test('quick-add form uses uniform field styling and shows helper/error text', async ({ page }) => {
    await page.goto('/login');

    await Promise.all([
      page.waitForResponse('**/api/auth/login'),
      page.click('button:has-text("Enter the Forge")'),
      page.waitForURL('**/dashboard', { timeout: 20000 }),
    ]);

    await expect(page.locator('input.hero-input')).toHaveCount(1); // quest title
    await expect(page.locator('select.hero-select')).toHaveCount(1);
    await page.locator('input#questTitle').focus();
    await expect(page.locator('input#questTitle')).toBeFocused();

    await page.fill('input#questTitle', '');
    await page.click('button:has-text("Add Quest")');

    await expect(page.locator('input#questTitle')).toHaveValue('');
    await expect(page.locator('p.form-helper')).toHaveText('Tip: choose a suggested quest to tap instantly');
  });

  test('life-area quest and world-state responds to activity', async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Enter the Forge")');
    await expect(page).toHaveURL('/dashboard', { timeout: 20000 });

    await expect(page.locator('h3', { hasText: 'World Seed State' })).toBeVisible({ timeout: 20000 });
    await expect(page.locator('div.world-state')).toBeVisible({ timeout: 20000 });

    // create a quest in life area
    await page.fill('input[placeholder="New quest title"]', 'Write unit tests');
    await page.selectOption('select', 'career');
    await page.click('button:has-text("Add Quest")');

    // Wait for the refreshed quest list from the backend.
    await page.waitForResponse('**/api/game-profile/demo-user/quests');

    // log activity once to mutate world seed and verify world-state update from backend
    const seedLocator = page.locator('div.world-state p').first();
    await expect(seedLocator).toBeVisible({ timeout: 20000 });

    const activityResponse = await Promise.all([
      page.waitForResponse('**/api/game-profile/demo-user/activity', { timeout: 20000 }),
      page.click('button:has-text("Exercise")'),
    ]).then(([response]) => response);

    expect(activityResponse.ok()).toBe(true);

    const activityJson = await activityResponse.json();
    expect(activityJson).toMatchObject({});
    expect(activityJson.seed).toEqual(51);

    await expect(page.locator('div.world-state')).toBeVisible({ timeout: 20000 });

    expect(activityJson).toMatchObject({
      seed: expect.any(Number),
      color: expect.any(String),
      icon: expect.any(String),
      progress: expect.any(Number),
    });
  });

  test('dashboard visual snapshot for light/dark mode', async ({ page }) => {
    await page.goto('/login');

    await Promise.all([
      page.waitForResponse('**/api/auth/login'),
      page.click('button:has-text("Enter the Forge")'),
      page.waitForURL('**/dashboard', { timeout: 20000 }),
    ]);

    await expect(page.locator('h2', { hasText: 'Dashboard' })).toBeVisible();
    await expect(page.locator('span.status-chip')).toBeVisible();
    await expect(page.locator('button:has-text("Dark Mode")')).toBeVisible();

    await page.click('button:has-text("Dark Mode")');
    await expect(page.locator('body.hero-hour-dark-mode')).toHaveCount(1);
  });

  test('realm activity chips should activate and persist selection', async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Enter the Forge")');
    await expect(page).toHaveURL('/dashboard');

    const exerciseButton = page.locator('button.realm-chip-btn', { hasText: 'Exercise' });
    const workButton = page.locator('button.realm-chip-btn', { hasText: 'Work' });

    await exerciseButton.click();
    await expect(exerciseButton).toHaveClass(/chip-active/);
    await expect(page.evaluate(() => localStorage.getItem('hero-hour-selected-activity'))).resolves.toBe('exercise');

    await workButton.click();
    await expect(workButton).toHaveClass(/chip-active/);
    await expect(page.evaluate(() => localStorage.getItem('hero-hour-selected-activity'))).resolves.toBe('work');
  });

  test('life-profile page loads and submits valid data', async ({ page }) => {

    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('hero-hour-token', 'fake-token');
      localStorage.setItem('hero-hour-refresh-token', 'fake-refresh');
      localStorage.setItem('hero-hour-authenticated', 'true');
    });

    await page.goto('/life-profile');
    await expect(page).toHaveURL('/life-profile', { timeout: 20000 });
    await expect(page.locator('h2', { hasText: 'Life Profile' })).toHaveCount(1);

    await page.fill('input[formcontrolname="firstName"]', 'Anne');
    await page.fill('input[formcontrolname="lastName"]', 'Lee');
    await page.fill('input[formcontrolname="age"]', '32');
    await page.selectOption('select[formcontrolname="preferredRole"]', 'member');

    const submit = async () => {
      const [request, response] = await Promise.all([
        page.waitForRequest('**/api/life-profile'),
        page.waitForResponse('**/api/life-profile'),
        page.click('button:has-text("Save")'),
      ]);

      expect(request.method()).toBe('POST');
      expect(await request.postDataJSON()).toMatchObject({ userId: 'demo-user', firstName: 'Anne', lastName: 'Lee', age: 32, preferredRole: 'member' });

      console.log('life-profile response status', response.status());
      const body = await response.text().catch(() => '');
      console.log('life-profile response body', body);

      return response;
    };

    const response = await submit();

    expect(response.status()).toBeLessThan(500);
    expect(response.ok()).toBe(true);

    // Ensure UI does not show an error state after submit.
    await expect(page.locator('.error')).toHaveCount(0);
  });
});
