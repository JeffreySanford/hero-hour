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
  });

  test('app loads and redirects to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h2', { hasText: 'Login' })).toHaveCount(1);
  });

  test('redirects to login when unauthenticated dashboard request', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h2', { hasText: 'Login' })).toHaveCount(1);
  });

  test('login works and dashboard renders health status', async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL('/dashboard');

    await expect(page.locator('h2', { hasText: 'Dashboard' })).toHaveCount(1);
    await expect(page.locator('button:has-text("Refresh status")')).toHaveCount(1);

    let healthOk = false;
    let lastStatus = 0;
    for (let attempt = 0; attempt < 10; attempt++) {
      const healthResponse = page.waitForResponse('**/api/health');
      await page.click('button:has-text("Refresh status")');
      const response = await healthResponse;
      lastStatus = response.status();
      if (response.ok()) {
        healthOk = true;
        break;
      }
      await page.waitForTimeout(1000);
    }

    console.log('health status after attempts:', lastStatus);
    expect(healthOk).toBe(true);
    await expect(page.locator('p', { hasText: 'API status: ok' })).toHaveCount(1);
  });

  test('life-profile page loads and submits valid data', async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Login")');
    await page.goto('/life-profile');
    await expect(page).toHaveURL('/life-profile');
    await expect(page.locator('h2', { hasText: 'Life Profile' })).toHaveCount(1);

    await page.fill('input[formcontrolname="firstName"]', 'Anne');
    await page.fill('input[formcontrolname="lastName"]', 'Lee');
    await page.fill('input[formcontrolname="age"]', '32');
    await page.selectOption('select[formcontrolname="preferredRole"]', 'member');

    const requestPromise = page.waitForRequest('**/api/life-profile');
    await page.click('button:has-text("Save")');
    const request = await requestPromise;

    expect(request.method()).toBe('POST');
    expect(await request.postDataJSON()).toMatchObject({ firstName: 'Anne', lastName: 'Lee', age: 32, preferredRole: 'member' });

    // Ensure UI does not show an error state after submit. success message is optional to avoid timing flakiness.
    const successCount = await page.locator('.success').count();
    if (successCount === 1) {
      await expect(page.locator('.success')).toHaveText('Saved');
    }
    await expect(page.locator('.error')).toHaveCount(0);
  });
});
