import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: 'http://localhost:4200',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'nx serve wjt',
    port: 4200,
    reuseExistingServer: true,
  },
});
