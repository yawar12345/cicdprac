# Playwright Learning Project — UI + API

Yeh ek chhota, simple project hai jo Playwright ke zyada important concepts
(na ke expert-level cheezein) interview-prep ke liye cover karta hai:
**locators, assertions, POM, OOP, aur API testing.**

Detailed concept explanations ke liye **[INTERVIEW_PREP.md](./INTERVIEW_PREP.md)**
padhein — woh is project ka sabse important document hai.

Git + GitHub Actions (CI/CD) concepts isi repo ke real commits/branches/PR
ke sath samajhne ke liye **[GIT_CICD_PREP.md](./GIT_CICD_PREP.md)** dekhein.

---

## Test sites (koi setup/login ki zaroorat nahi)

- **UI:** https://www.saucedemo.com — QA automation practice ke liye banayi
  gayi site, interviews mein bohot common.
- **API:** https://jsonplaceholder.typicode.com — free fake REST API, bina
  login/API-key ke.

---

## Project structure

```
pages/
  BasePage.js         <- parent class (OOP: inheritance ka base)
  LoginPage.js         <- Login page POM, BasePage extend karta hai
  InventoryPage.js     <- Products/cart-badge page POM
  CartPage.js           <- Shopping cart page POM

tests/
  ui/
    login.spec.js       <- LEVEL 1: raw Playwright (bina POM)
    shopping.spec.js     <- LEVEL 2: POM ke through flow
  api/
    posts.spec.js         <- API testing: GET/POST/PUT/DELETE
```

## Run karne ka tarika

```bash
npm install                # pehli baar
npx playwright install     # pehli baar: browsers download

npm test                   # sab tests (UI + API)
npm run test:ui            # interactive mode — SEEKHNE ke liye best
npm run test:headed        # browser dikhte hue
npm run report             # HTML report
npm run codegen            # record-and-generate locator code
```

**Suggestion:** `npm run test:ui` chalayein aur `login.spec.js`,
`shopping.spec.js`, aur `posts.spec.js` — teeno ko timeline mein dekhein.
UI tests mein browser steps dikhenge, API tests mein sirf request/response
JSON dikhega — yehi dono ka basic farak hai.
