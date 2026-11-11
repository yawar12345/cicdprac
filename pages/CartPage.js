// pages/CartPage.js
//
// Shopping cart page (/cart.html) ka Page Object.
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page);

    this.cartItemNames = page.locator('.inventory_item_name');
    this.checkoutButton = page.locator('#checkout');
  }

  async expectItemInCart(productName) {
    await expect(this.cartItemNames.filter({ hasText: productName })).toBeVisible();
  }

  async expectItemCount(count) {
    await expect(this.cartItemNames).toHaveCount(count);
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
