// tests/ui/logout.spec.js
//
// Yeh file FEATURE BRANCH (feature/logout-test) par likhi gayi hai —
// git/CI-CD seekhne ke liye example ke taur par, taake dekh sakein
// ke ek chhota sa naya feature kaise branch -> PR -> CI -> merge
// cycle se guzarta hai.

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';

test('user can log out and return to the login page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.logout();

  // Logout ke baad wapas login page par aana chahiye.
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.locator('#login-button')).toBeVisible();
});
