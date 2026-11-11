# Playwright Interview Prep — Cheat Sheet

Yeh document un **sabse zyada pooche jaane wale concepts** ko cover karta hai
jo Playwright + automation testing interviews mein common hain. Goal:
**expert-level nahi, lekin confident-level.** Har concept ke sath is project
ki actual file/line ka reference diya gaya hai taake sirf "ratta" na lage,
asal code mein dekh sakein.

---

## 1. Locators (sabse zyada pooche jaane wala topic)

**Locator kya hai?** Ek "address"/pointer jo batata hai page par element
kahan hai. Khud kuch nahi karta jab tak action (`.click()`, `.fill()`) na ho.
Locators **lazy** hote hain aur **auto-waiting** karte hain — jab tak element
na mile ya actionable na ho, Playwright retry karta rehta hai (default 30s).

### Playwright ki recommended priority (interview mein yeh order bolna important hai)

1. **`getByRole()`** — accessibility role + name se dhoondta hai. Sabse
   recommended kyunke yeh wahi cheez check karta hai jo ek real user
   (ya screen-reader) dekhta hai.
   ```js
   page.getByRole('button', { name: 'Sign In' })
   ```
2. **`getByLabel()`** — form input jiska ek `<label>` ho.
   ```js
   page.getByLabel('Password')
   ```
3. **`getByPlaceholder()`**, **`getByText()`** — visible text/placeholder se.
4. **`getByTestId()`** — jab app `data-test` / `data-testid` attribute deta
   ho (is project mein saucedemo `[data-test="error"]` use karta hai —
   dekhein `tests/ui/login.spec.js`). **Best practice** jab available ho,
   kyunke UI text/style badlega to bhi yeh nahi tootega.
5. **CSS locator (`page.locator('#id')` / `.class`)** — jab upar wale na
   milein. Is project mein `pages/LoginPage.js` mein `#user-name`,
   `#password` CSS id locators hain.
6. **XPath** — **last resort**. Fragile hota hai (DOM structure change hote
   hi tootta hai). Interview mein pucha jaye "XPath kab use karoge?" —
   jawab: "jab koi aur stable locator available hi na ho."

### Locator chaining & filtering (real-world pattern)

```js
// pages/InventoryPage.js mein dekhein:
const item = this.page.locator('.inventory_item').filter({ hasText: productName });
await item.getByRole('button', { name: 'Add to cart' }).click();
```
Yeh pattern bohot common hai: pehle ek **container** dhoondo (jaise ek
product card), phir us container ke **andar** specific element dhoondo.
Isse "Add to cart" jaisa generic text safely target hota hai, har product
ke apne button ke liye.

---

## 2. Assertions

Playwright ki assertions **"web-first"** hoti hain — matlab yeh khud retry
karti hain jab tak condition true na ho ya timeout (default 5s) na ho jaye.
Isi liye manual `wait`/`sleep` likhne ki zaroorat nahi.

### UI assertions (`tests/ui/*.spec.js` mein use hui hain)

| Assertion | Kab use karein |
|---|---|
| `toBeVisible()` | element dikh raha hai ya nahi |
| `toHaveText(x)` | exact text match |
| `toContainText(x)` | partial text match |
| `toHaveURL(x)` | page navigate hui ya nahi |
| `toHaveValue(x)` | input field ki value |
| `toHaveCount(n)` | kitne elements match hue (e.g. cart items) |
| `toBeChecked()` / `toBeEnabled()` / `toBeDisabled()` | checkbox/button state |

### API assertions (`tests/api/posts.spec.js` mein use hui hain)

```js
expect(response.status()).toBe(200);   // status code check
expect(response.ok()).toBeTruthy();     // 200-299 range
const body = await response.json();     // JSON parse karo
expect(body).toHaveProperty('id', 1);   // field check
```

### Soft vs Hard assertion (common interview question)

- **Hard assertion** (`expect(x).toBe(y)`) — fail hote hi test **turant
  ruk jata hai**, baaki steps skip ho jate hain.
- **Soft assertion** (`expect.soft(x).toBe(y)`) — fail ho to bhi test
  **chalta rehta hai**, sab failures end mein ek sath report hoti hain.
  Useful jab ek hi test mein multiple independent checks karne hon.

---

## 3. Page Object Model (POM)

**Problem jo POM solve karta hai:** Agar locators seedhe test files mein
likhe hon, to UI ka ek chhota sa change (button ka naam badalna) **dusan
files** mein jaa kar fix karna padta hai.

**POM ka rule:** Har page ke liye ek class banao. Us class ke andar us page
ke locators + actions rakho (`login()`, `addProductToCart()`). Test file
sirf in methods ko bulaye.

### Is project mein comparison

**Bina POM** — `tests/ui/login.spec.js`:
```js
await page.locator('#user-name').fill('standard_user');
await page.locator('#password').fill('secret_sauce');
await page.locator('#login-button').click();
```

**POM ke sath** — `tests/ui/shopping.spec.js`:
```js
const loginPage = new LoginPage(page);
await loginPage.login('standard_user', 'secret_sauce');
```

**POM ke 3 fayde (interview mein yeh teeno bolna):**
1. **Maintainability** — UI badle to sirf Page Object file fix karo.
2. **Readability** — test "story" ki tarah parha jata hai.
3. **Reusability** — ek class (jaise `LoginPage`) sab tests mein reuse hoti hai.

---

## 4. OOP Concepts (POM ke andar use hue)

Interview mein bohot common question: **"POM mein OOP concepts kaise use
hote hain?"** — is project ke files se seedha jawab milta hai:

### a) Encapsulation
Locators aur internal logic class ke andar "band" (hidden) hain. Test file
ko yeh janne ki zaroorat nahi ke locator kya hai — bas method bulana hai.
→ `pages/LoginPage.js` mein `usernameInput`, `passwordInput` private detail hain.

### b) Abstraction
Test file sirf **"WHAT"** (kya karna hai) jaanta hai: `login()`,
`addProductToCart()`. **"HOW"** (kaise karna hai — konsa locator, konsa
click) Page Object ke andar chupa hua hai.

### c) Inheritance
`pages/BasePage.js` ek parent class hai jisme common methods hain (`goto`,
`getTitle`). `LoginPage`, `InventoryPage`, `CartPage` — teeno
`extends BasePage` karte hain, matlab yeh methods unhe automatically mil
jate hain, dobara likhne ki zaroorat nahi.
```js
export class LoginPage extends BasePage {
  constructor(page) {
    super(page); // pehle parent (BasePage) ka constructor chalao
    ...
  }
}
```

### d) Polymorphism (chhota example)
`LoginPage` apna `goto()` method **override** karta hai (BasePage ke generic
`goto(path)` ko use karte hue, lekin apna fixed path dete hue):
```js
async goto() {
  await super.goto('/'); // parent ka method bula rahe hain, apne context mein
}
```
`super.goto(...)` — parent class ka method bulana, child se.

---

## 5. API Testing Concepts

### UI testing vs API testing — farak (bohot common interview question)

| | UI Testing | API Testing |
|---|---|---|
| Kya test hota hai | Browser + visual elements | Seedha server/backend |
| Speed | Slow (browser render hota hai) | Fast (koi browser nahi) |
| Fragility | UI change se toot sakta hai | Zyada stable |
| Is project mein | `tests/ui/*.spec.js` | `tests/api/posts.spec.js` |

### HTTP methods (CRUD ke sath map karke yaad rakhein)

| Method | Kaam | CRUD | Is project mein |
|---|---|---|---|
| `GET` | data padhna | Read | `GET /posts/1`, `GET /posts` |
| `POST` | naya data banana | Create | `POST /posts` |
| `PUT` | poora record update karna | Update | `PUT /posts/1` |
| `PATCH` | sirf kuch fields update karna | Update (partial) | — |
| `DELETE` | data mitana | Delete | `DELETE /posts/1` |

### Common status codes

| Code | Matlab |
|---|---|
| `200 OK` | Request successful |
| `201 Created` | Naya resource ban gaya (POST ke baad) |
| `400 Bad Request` | Client ne galat data bheja |
| `401 Unauthorized` | Login/token missing ya galat |
| `404 Not Found` | Resource exist nahi karta |
| `500 Internal Server Error` | Server ke andar kuch toota |

### Playwright mein API test kaise likhte hain

```js
const response = await request.get(`${BASE_URL}/posts/1`);
expect(response.status()).toBe(200);
const body = await response.json();
```
`request` ek **fixture** hai (Playwright khud deta hai) — isse browser khole
bina direct HTTP calls ki ja sakti hain. Yeh `tests/api/posts.spec.js` mein
poora dekha ja sakta hai.

---

## 6. Rapid-fire Q&A (jo aksar poochte hain)

**Q: Playwright mein auto-waiting kya hai?**
A: Action/assertion ke pehle Playwright khud element ke "actionable" hone
ka wait karta hai (visible, enabled, stable) — manual `sleep()` ki zaroorat
nahi.

**Q: `page.click()` vs `locator.click()` mein farak?**
A: Modern Playwright mein `locator` approach recommended hai — locator
lazy hota hai (re-query karta hai action ke waqt), jabke purana
`page.click(selector)` turant ek element dhoondta tha. Is project mein
hum hamesha `locator`-based approach use karte hain.

**Q: Trace Viewer kya hai?**
A: Ek recording tool — fail hone par (`trace: 'on-first-retry'` config mein,
dekhein `playwright.config.js`) step-by-step screenshots + network + console
save hote hain. `npx playwright show-trace <file>` se dekh sakte hain.

**Q: Fixtures kya hote hain?**
A: Test function ko milne wale ready-made objects — jaise `page` (browser
tab) aur `request` (HTTP client). Playwright khud create/cleanup karta hai.

**Q: `test.beforeEach` ka use kya hai?**
A: Har test se pehle common setup chalana (jaise login) — code repeat nahi
karna padta. Dekhein `tests/ui/shopping.spec.js`.

**Q: Parallel execution kaise hoti hai?**
A: `fullyParallel: true` (dekhein `playwright.config.js`) se alag-alag test
files alag workers mein ek sath chalti hain — speed badhti hai.

**Q: Flaky test kya hoti hai, aur kaise handle karte hain?**
A: Jo test kabhi pass kabhi fail ho, bina code change ke — aksar timing
issues ki wajah se. Solution: proper web-first assertions use karo (manual
sleep nahi), aur `retries` config set karo CI par.
