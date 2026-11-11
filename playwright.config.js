// @ts-check
import { defineConfig, devices } from '@playwright/test';

// Playwright ki central settings file — sab tests isi se guide hote hain.
export default defineConfig({
  testDir: './tests',

  // Sab test files ek sath, parallel mein chalao (fast).
  fullyParallel: true,

  // CI (GitHub Actions) par agar koi `.only` reh gaya ho to build fail karo.
  forbidOnly: !!process.env.CI,

  // CI par fail hone par 2 dafa retry karo (flakiness ke liye safety net).
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    // baseURL set hone se test files mein sirf relative path likhna kaafi hai,
    // jaise page.goto('/') — pura 'https://www.saucedemo.com/' likhne ki zaroorat nahi.
    baseURL: 'https://www.saucedemo.com',

    // Test fail ho (retry par) to ek "trace" (step-by-step recording) save hoti hai —
    // `npx playwright show-trace` se dekh sakte ho exactly kahan/kyun fail hua.
    trace: 'on-first-retry',

    // Fail hone par screenshot bhi save ho taake jaldi pata chale kya dikh raha tha.
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
