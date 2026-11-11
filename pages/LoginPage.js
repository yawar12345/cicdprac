// pages/LoginPage.js
//
// Login page ka Page Object. "extends BasePage" likhne ka matlab:
// yeh class BasePage ke saare methods (goto, getTitle) ko "inherit"
// kar rahi hai — dobara likhne ki zaroorat nahi (OOP: Inheritance).
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  constructor(page) {
    // super() zaroori hai — pehle parent class (BasePage) ka
    // constructor chalta hai, tabhi 'this.page' set hota hai.
    super(page);

    // ENCAPSULATION: yeh locators is class ke "private details" hain.
    // Test file ko in exact locators se koi matlab nahi — woh bas
    // `loginPage.login(...)` bulata hai.
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // super vs this — yahan 'super' isliye zaroori hai kyunki is method
  // ka naam ('goto') PARENT (BasePage) mein bhi same hai — yeh OVERRIDE hai.
  // 'this.goto('/')' likhte to yeh khud ko hi dobara bulata (infinite loop),
  // kyunki JS pehle LoginPage mein hi 'goto' dhoondti, aur yahin mil jata.
  async goto() {
    await super.goto('/'); // saucedemo ka login page hi homepage hai
  }

  // COMPARISON (sirf samajhne ke liye, use nahi ho raha):
  // Agar naam badal kar 'openLoginPage' rakhte (koi override nahi),
  // to 'super' ki zaroorat hi na padti — 'this.goto' seedha
  // prototype chain se BasePage tak khud pahunch jata:
  //
  //   async openLoginPage() {
  //     await this.goto('/');   // yeh bhi chal jata, kyunki naam takra nahi raha
  //   }
  //
  // Rule: naam takra raha ho (override) -> 'super' chahiye.
  //       naam alag ho (koi override nahi) -> 'this' hi kaafi hai.

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectErrorMessage(text) {
    await expect(this.errorMessage).toContainText(text);
  }
}
