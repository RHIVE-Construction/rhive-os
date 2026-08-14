---
description: Full RHIVE pipeline QA protocol — runs automatically when user says "activate the team". Covers Stage 1 Lead Intake through Sign & Verify, email delivery, and all-pages black screen sweep.
---

# Activate the Team — Full Pipeline QA Protocol

Invoke this workflow whenever the user says **"activate the team"**, requests a full system test, or asks to verify the pipeline before a deploy.

---

## Pre-Flight

1. **Read SYSTEM_RULES** — Open `.agents/rules/SYSTEM_RULES.md` and confirm you understand the active rules before any action.
2. **Check active branch** — Run `git branch` and confirm you are NOT on `main`. If on `main`, create a test branch: `git checkout -b test/<feature-name>`.
3. **Start dev server** — Run `npm run dev -- --port 3001` as a background daemon if not already running. Confirm `http://localhost:3001` is responding.

---

## Phase 1 — Build Verification

// turbo
4. **Run production build** — `npm run build`. Must pass with `✓ built in Xs` and zero TypeScript errors. Fix any errors before continuing.

---

## Phase 2 — Pipeline E2E Test

// turbo
5. **Run the full pipeline test** — `node tests/pipeline-e2e.cjs`

   This test covers:
   - **Login** as Admin via DevNavigator bypass
   - **Global Search → New Lead** — search modal, address typing, Tab navigation
   - **Address verification map modal** — satellite popup must appear
   - **Stage 1 fields** — contact info, scope type, project category, property details
   - **Lead saved** — appears in Stage 1 (LeadPage E-26)
   - **Contacts & Accounts** views load without crash
   - **Convert to Estimate** (Stage 2) — field carry-over from Stage 1
   - **Convert to Quote** (Stage 3) — page loads, quote fields present
   - **Sign & Verify (E-29)** — internal admin page loads with project data
   - **Email delivery** — `sendSignVerifyEmail` Cloud Function called; temp mail inbox checked
   - **Customer portal** — `CUSTOMER-SIGN-VERIFY` page loads via public link
   - **All-pages sweep** — every registered page visited; black screens and React crashes detected

6. **Review test results** — If any test **FAILS**:
   - Read the error and screenshot at `test_screenshots/pipeline/`
   - Fix the issue
   - Re-run `node tests/pipeline-e2e.cjs` until all critical tests pass
   - Warnings (`⚠️`) are acceptable — do not block deployment

7. **Report email result** — Check the temp mail inbox URL printed at the end of the test output. Confirm the Sign & Verify email was received.

---

## Phase 3 — Commit & Push to Feature Branch

// turbo
8. **Stage changes** — `git add <changed files>`
9. **Commit** — One-line commit following SYSTEM_RULES §4.2:
   ```
   git commit -m "test: pipeline e2e — all stages pass"
   ```
10. **Push feature branch** — `git push origin <branch-name>`

---

## Phase 4 — Merge to Main & Deploy

11. **Checkout main** — `git checkout main`
12. **Merge with --no-ff** — `git merge <branch-name> --no-ff -m "feat: <description>"`
13. **Build on main** — `npm run build` — must pass clean
14. **Push main** — `git push origin main`
15. **Deploy** — `npx -y firebase-tools@latest deploy --only hosting`
16. **Confirm live** — Visit `https://rhive-os.web.app` and spot-check the pipeline manually

---

## Phase 5 — Post-Deploy Confirmation

17. **Inform the user** — Report:
    - ✅ Tests passed (X/Y)
    - ✅ Build clean
    - ✅ Deployed to `https://rhive-os.web.app`
    - 📧 Test email inbox link
    - 📁 Screenshots location

---

## Quick Reference — Key Test Commands

```powershell
# Start dev server (background)
npm run dev -- --port 3001

# Build validation
npm run build

# Full pipeline E2E test
node tests/pipeline-e2e.cjs

# Deploy
npx -y firebase-tools@latest deploy --only hosting
```

## Key Page IDs for Manual Verification

| Page | ID | Description |
|------|----|-------------|
| New Lead / Intake | `E-02a` | Stage 1 — CustomerInputPage |
| Lead List | `E-26` | LeadPage — all leads |
| Estimate | `E-27` | Stage 2 — EstimateToolPage |
| Quote | `E-28` | Stage 3 — QuotePage |
| Sign & Verify | `E-29` | Stage 4 — SignAndVerifyPage |
| Pipeline | `E-05` | EmployeePipelinePage |
| Admin Dashboard | `A-01` | AdminDashboardPage |
| Contacts | `E-24` | ContactsVendorsPage |
| Accounts | `E-08` | CompanyPage |
