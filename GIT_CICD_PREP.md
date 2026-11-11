# Git + CI/CD — Cheat Sheet (isi repo ko use karte hue)

Yeh document samjhata hai ke Git aur CI/CD kaise kaam karte hain — har
concept ke sath wahi **actual commands/files** diye gaye hain jo abhi isi
project (`cicdprac` repo) par chalaye gaye. Goal: interview-ready samajh,
expert-level nahi.

---

## 1. Git kya hai, aur kyun chahiye?

Git ek **version control system** hai — code ki har change ka "history"
save karta hai, taake:
- Purani state par wapas jaaya ja sake.
- Multiple log (commits) dekh kar samjha ja sake ke kya, kab, kyun badla.
- Multiple log (branches) par alag-alag kaam ho sake bina ek dusre ko
  disturb kiye.
- Multiple logon ka kaam (collaboration) ek jagah (GitHub) merge ho sake.

**Local vs Remote:**
- **Local repo** — aapke computer par `.git` folder (history yahan save
  hoti hai). Hum ne banaya: `git init`.
- **Remote repo** — GitHub par hosted copy. Hamara remote:
  `https://github.com/yawar12345/cicdprac` (naam `origin`).

---

## 2. Buniyadi Git commands (jo hum ne is project mein use kiye)

### `git init`
Current folder ko ek git repo banata hai (`.git` folder create hota hai).
```bash
git init
```

### `git status`
Batata hai: konsi files modified/untracked/staged hain. **Sabse zyada use
hone wala command** — jab bhi confused ho, `git status` chalao.

### `git add`
Files ko **"staging area"** mein daalna — matlab "agle commit mein yeh
shamil hongi".
```bash
git add pages/InventoryPage.js tests/ui/logout.spec.js
# ya sab kuch: git add .
```

### `git commit`
Staged changes ko history mein **permanently save** karna, ek message ke
sath (kyun badla, yeh likhte hain).
```bash
git commit -m "Add logout test and InventoryPage.logout() helper"
```

### `git diff`
Dekhna ke exactly kya line-by-line badla hai (commit se pehle review).
```bash
git diff pages/InventoryPage.js
```

### `git log`
Commit history dekhna.
```bash
git log --oneline
```

### `git remote add`
Local repo ko ek remote (GitHub) se connect karna.
```bash
git remote add origin https://github.com/yawar12345/cicdprac.git
```

### `git push`
Local commits ko remote (GitHub) par bhejna.
```bash
git push -u origin main   # -u: is branch ko "origin/main" se link kar do
```

### `git pull`
Remote se naye commits apne local mein le aana (jab team ke doosre log
kuch push karein).

### `git clone`
Kisi existing remote repo ki poori copy apne computer par download karna
(pehli baar jab kisi project par kaam shuru karte hain).

### `.gitignore`
Woh files/folders jo git track **NAHI** karega — jaise `node_modules/`,
test outputs (`test-results/`, `playwright-report/`). Is project ki
`.gitignore` file dekhein.

---

## 3. Branching — alag kaam, alag branch

**Problem:** Agar sab log seedha `main` branch par kaam karein, to ek ka
adhoora/buggy code doosre ko turant affect karega.

**Solution:** Har naye feature/fix ke liye ek **naya branch** banao, wahan
kaam karo, phir wapas `main` mein **merge** karo jab ready ho.

```bash
git checkout -b feature/logout-test   # naya branch banao aur usi par switch karo
```

Is project mein humne yehi kiya:
1. `main` branch par initial, poora-tested project commit + push kiya.
2. `feature/logout-test` branch banaya.
3. Usi par ek chhota naya feature add kiya: `InventoryPage.logout()` +
   `tests/ui/logout.spec.js`.
4. Usay commit + push kiya — `main` abhi tak **untouched** hai.

```bash
git branch        # dekho konse branches hain, kis par ho
git checkout main # wapas main par jao
```

---

## 4. Pull Request (PR) — code review ka pul

**PR kya hai?** Ek request GitHub par: *"mera `feature/logout-test` branch
`main` mein merge kar do"*. PR ka asal fayda: koi **review** kar sakta hai
(ya khud bhi dobara dekh sakta hai), aur **CI automatically chal kar verify
karta hai ke code tootha to nahi**, merge hone se PEHLE.

```bash
gh pr create --base main --head feature/logout-test \
  --title "Add logout test" --body "..."
```
Humne yeh real PR banaya: **PR #1** — `https://github.com/yawar12345/cicdprac/pull/1`

Jab yeh PR merge hoga, `feature/logout-test` ka code `main` mein chala
jayega. Yeh **merge commit** banata hai — ek commit jo dono branches ki
history ko jodta hai.

---

## 5. CI/CD kya hai?

- **CI (Continuous Integration)** — har push/PR par **automatically**
  tests chalana, taake jaldi pata chale agar kuch tootha hai — insaan ko
  manually test nahi karna padta.
- **CD (Continuous Deployment/Delivery)** — agar tests pass ho jayen, to
  code **automatically deploy/release** ho jaye. (Is project mein hum sirf
  CI kar rahe hain — "CD" part add nahi kiya, kyunki deploy karne ke liye
  koi live server/hosting nahi hai. Interview mein yeh farak bolna important
  hai.)

### Is project ka CI kahan define hai?

`.github/workflows/playwright.yml` — GitHub ko "GitHub Actions" kehte hain
jab woh `.github/workflows/*.yml` files ko dekh kar automatically kaam
chalata hai.

```yaml
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
```
**Trigger** — yeh workflow KAB chalega: jab `main`/`master` par push ho, YA
jab koi PR `main`/`master` ki taraf khula ho. Isi wajah se humara pehla
`git push -u origin main` aur phir PR #1 banana — **dono** ne automatically
ek-ek CI run start kiya (koi manual button nahi dabaya).

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
```
**Job + Runner** — GitHub apna ek **virtual machine** (Ubuntu Linux) spin up
karta hai, jahan neeche wale steps chalte hain.

```yaml
steps:
  - uses: actions/checkout@v4          # repo ka code is VM par copy karo
  - uses: actions/setup-node@v4         # Node.js install karo
  - run: npm ci                         # exact dependencies install karo
  - run: npx playwright install --with-deps   # browsers install karo
  - run: npx playwright test            # HAMARE TESTS CHALAO
  - uses: actions/upload-artifact@v4     # HTML report ko save karo
```
Har `step` ek command/action hai, upar se neeche chalta hai. Agar koi step
fail ho (jaise `npx playwright test` kisi test ke fail hone par), **poora
job fail** ho jata hai aur GitHub par ek ❌ dikhta hai.

**Artifact** — `playwright-report/` folder ko GitHub save kar leta hai
(`upload-artifact`), taake run khatam hone ke baad bhi aap HTML report
download kar ke dekh sako ke exactly kya fail hua, bina khud local mein
dobara run kiye.

### Isi repo par real CI runs dekhna

```bash
gh run list --repo yawar12345/cicdprac     # sab CI runs ki list
gh pr checks 1 --repo yawar12345/cicdprac   # PR #1 ke CI checks ka status
```
Ya browser mein: `https://github.com/yawar12345/cicdprac/actions`

---

## 6. Poora cycle — jo humne abhi isi repo par kiya

```
git init
  -> git remote add origin <url>
  -> git add + git commit         (initial project)
  -> git push origin main          --> CI run #1 trigger hota hai (push)
  -> git checkout -b feature/logout-test
  -> (naya code likha: logout feature)
  -> git add + git commit
  -> git push origin feature/logout-test
  -> gh pr create                  --> CI run #2 trigger hota hai (pull_request)
  -> CI pass hone ke baad: PR merge main mein
```

Yehi **real-world workflow** hai jo tagreeban har software team follow
karti hai: **branch -> commit -> push -> PR -> CI check -> merge**.

---

## 7. Rapid-fire Q&A

**Q: `git add` aur `git commit` mein farak?**
A: `add` = staging area mein rakhna ("agli commit mein shamil karo"),
`commit` = us staged cheez ko permanently history mein save karna.

**Q: Merge conflict kya hota hai?**
A: Jab do branches ne **ek hi line** ko alag tarah se badla ho, Git khud
faisla nahi kar pata konsi version rakhein — insaan ko manually choose
karna padta hai.

**Q: CI kyun zaroori hai, agar main khud local mein test chala sakta hoon?**
A: Kyunki (1) yeh har push/PR par **automatic** hota hai, bhool nahi
sakte, (2) ek "neutral" machine par chalta hai (sirf "mere computer par to
chal raha tha" wala issue nahi hota), (3) team ke sab logon ke liye same
check hota hai PR merge hone se pehle.

**Q: Branch protection kya hoti hai?**
A: GitHub ki ek setting jo `main` branch par direct push rokti hai, aur
mandatory karti hai ke pehle PR banay aur CI pass ho. (Is repo mein abhi
set nahi ki — lekin interview mein yeh concept bolna important hai.)

**Q: `main` vs `master`?**
A: Dono default branch ke naam hain — purane projects `master` use karte
the, naya convention `main` hai. Humari workflow file dono ko support
karti hai (`branches: [ main, master ]`).
