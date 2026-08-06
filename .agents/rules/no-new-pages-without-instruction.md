# RULE: Never Create New Pages Without Explicit Instruction

**Scope:** All agents working on rhive-os  
**Priority:** HIGH — enforced on every user request

## The Rule

When a user asks to add a feature, update functionality, or "make something work" on a page — **always work within the existing page**. Do NOT create a new page or new nav entry unless the user explicitly says: _"create a new page"_ or _"build a new page for X"_.

## Required Pre-Work Before Any Feature Build

1. **Search `constants.ts`** for the nav group and page name the user mentioned
2. **Check `pageRegistry.tsx`** for the page ID → component file mapping
3. **Read the existing component file** fully before writing any code
4. Only then: add the feature to that existing component

## Trigger Examples (What the user says → What agent must do)

| User says | Correct action |
|---|---|
| "make the calendar sync to Google" | Find the existing Calendar page (E-04 in Core Command), modify it |
| "add event feature to calendar" | Modify the existing E-04 Calendar page |
| "check the calendar page and add sync" | Open and edit `EmployeeTimeoffPage.tsx` |
| "update the pipeline page" | Find `EmployeePipelinePage.tsx`, edit it |

## Violations (Never do these without explicit instruction)

- ❌ Creating `MyCalendarPage.tsx` when "Calendar" (E-04) already exists
- ❌ Adding a new nav entry when the feature should go in an existing page
- ❌ Assuming a page doesn't exist without searching `constants.ts` and `pageRegistry.tsx` first
- ❌ Registering a new page ID (E-40, E-41, etc.) for a feature that belongs in an existing page
