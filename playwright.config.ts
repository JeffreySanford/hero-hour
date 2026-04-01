import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

const webPort = process.env['WEB_PORT'] || '4200';
const apiPort = process.env['API_PORT'] || '3000';
const baseURL = process.env['BASE_URL'] || `http://localhost:${webPort}`;

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: 'apps/admin-console-e2e/src' }),
  testDir: 'apps/admin-console-e2e/src',
  testMatch: /.*\.spec\.ts$/,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `pnpm nx run-many --target=serve --projects=api,admin-console --parallel -- --port ${webPort}`,
    url: `http://localhost:${webPort}`,
    reuseExistingServer: true,
    cwd: workspaceRoot,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
