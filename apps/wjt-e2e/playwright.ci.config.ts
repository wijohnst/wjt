import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: 'http://localhost:4200',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command:
      'docker image ps && docker run -p 4200:4200 --name wjt-e2e-latest --rm -d wijohnst/wjt',
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'teardown',
    //   testMatch: /global\.teardown\.ci\.ts/,
    // },
  ],
});
