// pages/BasePage.js
//
// OOP CONCEPT: INHERITANCE
// -------------------------------------------------------------
// Yeh ek "parent/base class" hai. Isme woh cheezein rakhi hain jo
// HAR page mein common hoti hain (jaise navigate karna, title padhna).
//
// Neeche LoginPage, InventoryPage, CartPage — yeh sab is class ko
// "extend" karenge (child classes). Matlab woh sab is class ke
// methods automatically mil jayenge, bina dobara likhe.
//
// Interview mein agar pucha jaye "POM mein OOP kaise use hota hai?"
// to yeh file seedha jawab hai: Inheritance.

export class BasePage {
  constructor(page) {
    // 'page' har child class ko bhi mil jata hai (super() ke zariye).
    this.page = page;
  }

  async goto(path) {
    await this.page.goto(path);
  }

  async getTitle() {
    return this.page.title();
  }
}
