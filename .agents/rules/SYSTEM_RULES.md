# RHIVE OS — SYSTEM RULES
> **Status: ALWAYS ACTIVE.** These rules apply to every feature, fix, commit, and push — no exceptions.
> This file is the authoritative reference for all development in this project.

---

## 1. BUTTON & LABEL CONVENTIONS

All interactive buttons across the entire application must follow this naming standard strictly.

### ✅ Allowed Button Labels

| Intent | Allowed Labels |
|--------|----------------|
| Affirmative confirmation | `Yes`, `Confirm` |
| Negative confirmation | `No` |
| Form submission / primary action | `Submit`, `Save`, `Send`, `Create`, `Apply` |
| Closing / backing out | `Cancel`, `Close`, `Back` |
| Destructive action (after confirmation) | `Delete`, `Remove` |

### ❌ Strictly Prohibited Button Labels

| Prohibited | Use Instead |
|------------|-------------|
| `Abort` | `Cancel` |
| `Quit` | `Cancel` or `Close` |
| `Terminate` | `Cancel` or `Stop` |
| `OK` (standalone) | Use the specific action label (e.g., `Save`, `Confirm`) |
| `Proceed` (as primary CTA alone) | Use a specific label like `Submit` or `Confirm` |
| `Dismiss` | `Close` |

### Examples

```tsx
// ❌ WRONG
<Button>Abort</Button>
<Button>OK</Button>

// ✅ CORRECT
<Button>Cancel</Button>
<Button>Confirm</Button>
<Button>Submit</Button>
<Button>Send</Button>
```

---

## 2. MODAL & DIALOG STANDARDS

- Every modal must have a **title** — always clear and descriptive.
- Subtitles are **optional** — only include them if they add genuine value. Never add technical jargon as a subtitle (e.g., `Google Calendar API v3 — OAuth 2.0` is not user-facing copy).
- Every modal must have at minimum **one dismiss action** (`Cancel` or `Close` button).
- Destructive actions (delete, remove) must be behind a **confirmation step** before executing.
- Do not display internal/implementation details in user-facing modals (e.g., Firestore paths, API version strings, env var references).

---

## 3. TESTING PROTOCOL — MANDATORY BEFORE EVERY COMMIT & PUSH

> **ALL features MUST be tested before any commit or push.** No exceptions.

### 3.1 Pre-Commit Checklist

Before running `git commit`, the following must be verified:

- [ ] **Build passes** — Run `npm run build` and confirm `✓ built in Xs` with no errors.
- [ ] **No TypeScript errors in the changed file(s)** — Run `npx tsc --noEmit 2>&1 | Select-String "<filename>"` and confirm zero new errors.
- [ ] **Feature works as intended** — Manually verify the feature in the running dev server (`npm run dev`).
- [ ] **Edge cases tested** — Test empty states, error states, and boundary conditions.
- [ ] **No regression in related features** — Verify that the surrounding UI/flow still works correctly.
- [ ] **No conflict markers** — Run `git diff HEAD` and confirm no `<<<<<<<`, `=======`, or `>>>>>>>` markers.

### 3.2 Pre-Push Checklist

Before running `git push`, the following must be verified:

- [ ] **All pre-commit checks passed** (see 3.1).
- [ ] **Branch is up to date** — Run `git pull origin <branch>` to ensure no divergence.
- [ ] **REFERENCES/ is shielded** — Confirm `.gitignore` has `REFERENCES/` uncommented before push.
- [ ] **Verify shield** — Run `git check-ignore REFERENCES/*`.
- [ ] **No sensitive data staged** — Review `git diff --staged` for any secrets, keys, or `.env` values.

### 3.3 Pre-Deploy Checklist (Before Firebase Deploy)

Before running `firebase deploy`, the following must be verified:

- [ ] **Merge to `main` is clean** — No unresolved conflicts.
- [ ] **`npm run build` passes on `main`** — Always re-run the build after merging.
- [ ] **REFERENCES/ is shielded** — Restore shield after merge if it was removed.
- [ ] **Deploy only what changed** — Use `--only hosting` or `--only functions` unless a full deploy is required.

---

## 4. BRANCH & COMMIT WORKFLOW

### 4.1 Branch Naming Convention

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/<short-name>` | `feature/calendar-sync` |
| Bug fix | `fix/<short-name>` | `fix/password-modal` |
| UI / Design | `ui/<short-name>` | `ui/button-cleanup` |
| Rules / Config | `rules/<short-name>` or named | `system-rules` |
| Hotfix | `hotfix/<short-name>` | `hotfix/deploy-crash` |

### 4.2 Commit Message Convention

Use **conventional commit** format:

```
<type>: <short description>

Types: feat | fix | ui | chore | refactor | docs | test | deploy
```

**Examples:**
```
feat: add Google Calendar sync to user management
fix: remove calendar sync button from password modal
ui: clean up sync modal header — remove subtitle
chore: shield REFERENCES before push
deploy: firebase hosting — v1.4.2
```

### 4.3 Merge Protocol

1. Always push the feature branch first.
2. Merge into `main` with `--no-ff` to preserve history.
3. Resolve all conflicts by taking the intended (newer) changes.
4. Run `npm run build` again on `main` after merge.
5. Push `main`, then deploy to Firebase.

---

## 5. UI / COMPONENT STANDARDS

These apply to every component built or modified in this project.

### 5.1 Design System

- Follow the **RHIVE Design System** defined in `rhive-branding-code.md` at all times.
- Use the `CircuitryCard` widget frame for all card-style components.
- Use `PlexusShape` as background for feature cards where appropriate.
- Colors must come from the design token set — no arbitrary hex codes.
- Typography: **Rubik** for sans-serif, **EB Garamond** for serif.

### 5.2 Forbidden Patterns

- ❌ **No plain HTML checkboxes** — Use `Switch` or `Toggle` components instead.
- ❌ **No hardcoded hex colors** outside of the design token set.
- ❌ **No inline `style={}` for layout** — use Tailwind classes.
- ❌ **No `console.log` left in committed code** — Remove all debug logs before committing.
- ❌ **No user-facing technical jargon** — Keep all copy clean and human-readable.
- ❌ **No placeholder text or Lorem Ipsum** in committed UI — All content must be real or representative.

### 5.3 Accessibility Minimums

- All interactive elements must have a unique `id` attribute.
- All icon-only buttons must have an `aria-label`.
- Color alone must not be the sole conveyor of information (pair with text or icons).

---

## 6. FEATURE DEVELOPMENT WORKFLOW

Every new feature follows this exact sequence:

```
1. REVIEW system rules (this file)
   ↓
2. BRANCH — create a named branch off main
   ↓
3. DEVELOP — build the feature following UI/component standards
   ↓
4. TEST — run full pre-commit checklist (Section 3.1)
   ↓
5. COMMIT — conventional commit message
   ↓
6. TEST again — run pre-push checklist (Section 3.2)
   ↓
7. PUSH — push feature branch to origin
   ↓
8. MERGE → main (--no-ff)
   ↓
9. BUILD — npm run build on main
   ↓
10. DEPLOY — firebase deploy --only hosting
```

---

## 7. ENFORCEMENT

These rules are **permanent and non-negotiable**. They apply:
- To every agent (AI or human) working on this project.
- On every branch, every commit, every push.
- Before every Firebase deploy.

When in doubt, **check this file first.**

---

*Last updated: 2026-07-14 | Branch: system-rules | Maintained in `.agents/rules/SYSTEM_RULES.md`*
