import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : (parseInt(process.env.RETRY_COUNT || '0') || 0),
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : (process.env.PARALLEL_TESTS === 'false' ? 1 : (parseInt(process.env.MAX_WORKERS || '1') || undefined)),
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Global timeout for each action */
    actionTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
    
    /* Global timeout for navigation */
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '60000'),

    permissions: ['geolocation'],
    geolocation: { latitude: 33.1972, longitude: -96.6398 }, // McKinney, TX
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },  
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Global setup/teardown for authentication */
  globalSetup: require.resolve('./tests/auth.setup.ts'),

  /* Test timeout */
  timeout: parseInt(process.env.DEFAULT_TIMEOUT || '60000'),

  /* Expect timeout */
  expect: {
    timeout: parseInt(process.env.DEFAULT_TIMEOUT || '15000'),
  },

  /* Global timeout for all operations */
  globalTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '120000'),

  /* Output directory for test artifacts */
  outputDir: 'test-results/',
});
