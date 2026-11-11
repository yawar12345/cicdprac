// tests/ui/login.spec.js
//
// LEVEL 1 — "Raw" Playwright, bina Page Object ke.
// Maqsad: buniyadi (fundamental) concepts seekhna:
//   - locators (getByRole, getByPlaceholder, locator with CSS)
//   - actions (fill, click)
//   - assertions (toBeVisible, toHaveURL, toContainText)
//
// Site: https://www.saucedemo.com — yeh QA automation practice ke liye
// khaas banayi gayi site hai (industry mein bohot common interview demo).

import { test, expect } from '@playwright/test';

test.describe('Saucedemo — Login', () => {
  test('valid login shows the products page', async ({ page }) => {
    await page.goto('/');

    // CSS id locator — jab element ka koi unique, stable id ho to
    // yeh sabse simple/fast locator hota hai.
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Assertion #1: URL badal gaya (login successful navigate hua)
    await expect(page).toHaveURL(/inventory.html/);

    // Assertion #2: page par "Products" heading dikh raha hai
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('invalid password shows an error message', async ({ page }) => {
    await page.goto('/');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('wrong_password');
    await page.locator('#login-button').click();

    // Login fail hua, isliye URL badalna NAHI chahiye.
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // '[data-test="..."]' locator — saucedemo har important element par
    // ek stable 'data-test' attribute deta hai, testing ke liye best practice.
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match'
    );
  });

  test('locked out user cannot log in', async ({ page }) => {
    await page.goto('/');

    await page.locator('#user-name').fill('locked_out_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });
});
