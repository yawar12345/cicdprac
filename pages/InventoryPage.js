// pages/InventoryPage.js
//
// Product listing page (/inventory.html) ka Page Object.
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class InventoryPage extends BasePage {
  constructor(page) {
    super(page);

    this.pageTitle = page.locator('.title'); // "Products" heading
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');

    // Hamburger menu (top-left) ke andar Logout link hota hai.
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  // Product naam se us product ka "Add to cart" button dhoondna.
  // Yeh ek helper method hai — isi mein POM ki asli value hai:
  // test file ko yeh janne ki zaroorat nahi ke DOM structure kaisa hai.
  async addProductToCart(productName) {
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async expectCartBadgeCount(count) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  // Dropdown se sort karna, e.g. 'lohi' = Price: Low to High
  async sortBy(value) {
    await this.sortDropdown.selectOption(value);
  }

  // Sab products ke naam ek array mein wapas karta hai —
  // sorting assertions ke liye useful.
  async getAllProductNames() {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  // Sab products ki prices numbers ke array mein wapas karta hai
  // (e.g. "$29.99" -> 29.99), sorting assertions ke liye.
  async getAllProductPrices() {
    const texts = await this.page.locator('.inventory_item_price').allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }
}
