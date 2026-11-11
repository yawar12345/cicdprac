// tests/ui/shopping.spec.js
//
// LEVEL 2 — POM (Page Object Model) ke through wahi tarah ka flow,
// lekin zyada "real" scenario: login -> cart mein items dalna ->
// cart check karna -> sorting check karna.
//
// Is file ko login.spec.js ke sath COMPARE karein:
// wahan locators test ke andar the, yahan sab pages/*.js mein chupe hain.
// Test file ab sirf "kahani" (story) parh raha hai.

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage } from '../../pages/CartPage.js';

test.describe('Saucedemo — Shopping flow (POM)', () => {
  // beforeEach = har test se PEHLE yeh chalega.
  // Isse "login" wala code baar baar likhna nahi padta (DRY principle).
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('add two products to cart and verify them', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');

    // Cart icon par badge "2" dikhna chahiye
    await inventoryPage.expectCartBadgeCount(2);

    await inventoryPage.openCart();

    const cartPage = new CartPage(page);
    await cartPage.expectItemCount(2);
    await cartPage.expectItemInCart('Sauce Labs Backpack');
    await cartPage.expectItemInCart('Sauce Labs Bike Light');
  });

  test('sorting products price low to high works correctly', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('lohi'); // lohi = "Price: Low to High"

    const prices = await inventoryPage.getAllProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);

    // Assertion: jo order mila, woh sorted order ke barabar hona chahiye.
    expect(prices).toEqual(sortedPrices);
  });
});
