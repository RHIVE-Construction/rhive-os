# RHIVE OS — SYSTEM RULES
> **Status: ALWAYS ACTIVE.** These rules apply to every feature, fix, commit, and push — no exceptions.
> This file is the authoritative reference for all development in this project.

---

## 0. CORE BEHAVIOUR RULES

These rules govern agent and developer behaviour at the highest level. They override defaults.

### 0.1 No Subheadings Unless Explicitly Instructed

- **Do NOT create page-level subheadings, section headers, or UI heading elements** (`<h2>`, `<h3>`, subtitle text, etc.) unless the user has **explicitly asked** for them in that specific request.
- A page should have at most one `<h1>` title. Sub-sections within a page must use visual separation (cards, dividers, spacing) — not additional heading levels.
- This rule applies to all pages, modals, panels, and components.

```tsx
// ❌ WRONG — adding unsolicited subheadings
<h2>Personal Information</h2>
<h3>Contact Details</h3>

// ✅ CORRECT — use card/section grouping instead
<section className="...">
  {/* Group content visually without heading tags */}
</section>
```

### 0.2 No IDs or User IDs Visible on Any Page

- **Never display Firestore document IDs, user IDs, or any internal identifier** to the user anywhere in the UI.
- This includes: record cards, tables, detail views, tooltips, modals, audit logs, URL slugs shown in UI, and debug overlays.
- IDs may exist in the data layer and URL paths (for routing), but must **never be rendered as visible text**.
- If a reference number is needed for the user, generate a human-readable identifier (e.g., a project code or sequential number) — not a raw Firestore ID.

```tsx
// ❌ WRONG
<p>ID: xK9mP3qLvT...</p>
<span>{user.uid}</span>

// ✅ CORRECT — show a name, code, or formatted reference
<p>Project: RC-2026-001</p>
<p>{record.name}</p>
```

### 0.3 Notifications for Every User Action

- **Every event or action a user performs MUST trigger a notification.** No exceptions.
- This includes: creating a record, editing a record, deleting a record, restoring a record, permanently deleting a record, changing a stage, saving a quote, scheduling a follow-up, and any other data-modifying action.
- Notifications must appear in the notification bell within seconds of the action.
- See **Section 7** for the full logging and notification specification.

### 0.4 All CRUD Actions Must Be Server-Side

- **All Create, Read, Update, and Delete operations must be executed server-side** — via Firebase Cloud Functions, not directly from the client.
- Client code must call a Cloud Function endpoint; the Cloud Function performs the Firestore write/read.
- **Direct Firestore SDK writes from the client (`setDoc`, `addDoc`, `updateDoc`, `deleteDoc`) are strictly prohibited** for any CRUD action.
- Reads may use Firestore real-time listeners on the client for live updates, but writes must always go through a Cloud Function.

```ts
// ❌ WRONG — direct client write
await setDoc(doc(db, 'leads', id), data);

// ✅ CORRECT — call a Cloud Function
await httpsCallable(functions, 'updateLead')({ id, data });
```

### 0.5 Commit Message Format

- All commit messages **must** use the format: `feature-(functionality)` for feature work, or the type-prefixed format defined in **Section 4.2**.
- Keep the message short — one line, under 60 characters.
- Use present tense. No period at the end.

```
// Examples
feature-(lead-notifications)
feature-(server-side-crud)
fix-(stage-change-logging)
```

### 0.6 Always Run Tests Before Committing or Pushing

- **No commit or push may happen without first running the full test suite.**
- Run `npm run build` and confirm zero errors.
- Run `npx tsc --noEmit` and confirm zero TypeScript errors.
- Manually verify the feature in the dev server.
- Only after all checks pass is a commit or push allowed.
- See **Section 3** for the complete pre-commit and pre-push checklists.

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

All branches **must** follow this format exactly:

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/<function-name>` | `feature/trash-record` |
| Bug fix | `fix/<function-name>` | `fix/password-modal` |
| UI / Design | `ui/<function-name>` | `ui/button-cleanup` |
| Rules / Config | `rules/<name>` | `rules/system-update` |
| Hotfix | `hotfix/<function-name>` | `hotfix/deploy-crash` |

> **Rules:**
> - Use **lowercase** only. No uppercase letters.
> - Use **hyphens** (`-`) to separate words. No underscores, no spaces.
> - Keep names **short and descriptive** — describe what the branch does, not who made it.
> - The prefix (`feature/`, `fix/`, etc.) is **mandatory** — bare names like `trash-record` are not allowed.

### 4.2 Commit Message Convention

Commit messages must be **one line only**. No body. No paragraph. No multi-line description.

```
<type>: <short plain description>
```

**Types:** `feat` | `fix` | `ui` | `chore` | `refactor` | `docs` | `test` | `deploy`

**Rules:**
- **One line only** — no body, no multi-line block, no `-m` chaining.
- Use **present tense** — write what the commit *does*, not what it *did*.
- Keep the description **under 60 characters**.
- No period at the end.
- No file paths, no function names, no implementation details.
- No conjunctions (`and`, `also`) — if you need `and`, split into two commits.

**✅ Correct:**
```
feat: add password history modal
fix: restore address autocomplete on estimate tool
ui: move website nav after pipeline stages
chore: update system rules
deploy: push hosting to firebase
```

**❌ NEVER do this:**
```
feat: add edit/delete icons to lead detail view and move trash bin to admin section
fix: correct the firestoreService.softDeleteDocument() filter not applying deleted:true
merge: fix useMockDB missing import in UserManagementPage - caused blank screen
Updated stuff and also fixed the nav
WIP
temp
```

> **STRICT:** A commit message that reads like a sentence or paragraph will be rejected.
> If it takes more than 5 seconds to read, it is too long.

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
2. BRANCH — create feature/<function-name> off main
   ↓
3. DEVELOP — build the feature following UI/component standards
   ↓
4. TEST — run full pre-commit checklist (Section 3.1)
   ↓
5. COMMIT — short plain commit message
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

## 7. EVENT LOGGING STANDARD — MANDATORY

> **Every user action that changes data MUST be logged.** No exceptions.
> This applies to all pipeline records, user records, property records, and any editable document.

### 7.1 What Must Be Logged

Every one of the following events **must** produce:
1. A `user_log` entry (for audit trail and Admin view)
2. A notification entry (surfaced in the notification bell for Admins and the acting user)

| Event | Action Type Key | Description Template |
|-------|----------------|----------------------|
| Record created | `RECORD_CREATED` | `"[Name] was created"` |
| Record edited | `EDIT_RECORD` | `"[Name] was edited by [User]"` |
| Record moved to trash | `DELETE_RECORD` | `"[Name] was moved to trash by [User]"` |
| Record restored | `RESTORE_RECORD` | `"[Name] was restored from trash by [User]"` |
| Record permanently deleted | `PERMANENT_DELETE` | `"[Name] was permanently deleted by [User]"` |
| Stage changed | `STAGE_CHANGE` | `"[Name] moved to [Stage]"` |
| Quote saved | `SAVE_QUOTE` | `"Quote saved for [Name]"` |
| Follow-up scheduled | `MEETING_SCHEDULED` | `"Follow-up scheduled for [Name]"` |

### 7.2 Log Payload Required Fields

Every `user_log` entry for a record event must include these fields in its `payload`:

```ts
{
  recordId: string;       // Firestore document ID
  recordName: string;     // Human-readable name of the record
  collection: string;     // Firestore collection (e.g., 'leads', 'projects', 'deals')
  stage?: string;         // Current pipeline stage (if applicable)
  reason?: string;        // Deletion reason (for DELETE_RECORD events)
  changes?: string[];     // List of changed field names (for EDIT_RECORD events)
}
```

### 7.3 Record Audit Fields — Display in Frontend

Every record document that is **edited** must have these fields written back to Firestore:

```ts
{
  modified_by: string;      // User's display name
  modified_by_id: string;   // User's Firestore ID
  modified_at: string;      // ISO timestamp of the edit
}
```

These fields must be **displayed in the record detail view** as a subtle audit line:

```
Edited by Victor V. · Jul 30, 2026, 3:45 PM
```

**Display rules:**
- Use muted/gray text, small font — this is metadata, not primary content.
- Always show both the user name and the date.
- If `modified_by` is not set, do not render this line at all.
- Place it at the **bottom of the record card**, below all other fields.

### 7.4 Notification Filter Rule

The `NotificationContext` `PROJECT_ACTION_TYPES` set must include **all record-level events**:

```ts
// Required in PROJECT_ACTION_TYPES:
'EDIT_RECORD', 'DELETE_RECORD', 'RESTORE_RECORD', 'PERMANENT_DELETE',
'RECORD_CREATED', 'STAGE_CHANGE', 'SAVE_QUOTE', 'MEETING_SCHEDULED',
```

All of these must appear in the notification bell and notification feed.

### 7.5 Implementation Checklist

When adding any new action that modifies a record:

- [ ] Call `userLogService.logAction(actionType, description, payload)` immediately after the Firestore write.
- [ ] Write `modified_by`, `modified_by_id`, `modified_at` back to the document.
- [ ] Ensure the `actionType` is in `PROJECT_ACTION_TYPES` in `NotificationContext.tsx`.
- [ ] Verify the notification bell shows the event within a few seconds.
- [ ] Verify the admin user log feed shows the event.

---

## 8. ENFORCEMENT

These rules are **permanent and non-negotiable**. They apply:
- To every agent (AI or human) working on this project.
- On every branch, every commit, every push.
- Before every Firebase deploy.

When in doubt, **check this file first.**

---

*Last updated: 2026-08-01 | Branch: system-rules | Maintained in `.agents/rules/SYSTEM_RULES.md`*
