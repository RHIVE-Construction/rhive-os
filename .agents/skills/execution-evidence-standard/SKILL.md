---
name: execution-evidence-standard
description: >-
  Enforces a strict, high-fidelity proof-of-work documentation protocol for all frontend and routing updates, requiring a minimum of 3-5 screenshots representing key visual states (Public, Login, Dashboard view of active roles, and Pipeline paths), a Playwright test runner report, and localhost routing links for live user interaction.
---

# Execution Evidence Standard

## Overview
This skill defines the mandatory protocol for providing proof-of-work verification whenever UI elements, layout routing, or frontend components are created, modified, or refactored. The standard requires the agent to deliver actionable localhost interaction links and multiple visual screenshots directly embedded in the execution reports.

## Dependencies
None.

## Quick Start
To trigger this skill, the agent must output a structured `walkthrough.md` containing:
1. Clickable localhost routing links (port 3000).
2. Minimum of 3-5 embedded screenshots of key states.
3. E2E validation test runner table.
4. Autopsy Patch (`[Jargon] -> [Business Impact]`).
5. 1-3-1 Momentum Handoff.

## Workflow

### Step 1: Clean Port 3000 & Start Dev Server
Find and terminate any stale processes occupying local port 3000 to ensure Vite binds exactly to the standard URL.
```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
npm run dev
```

### Step 2: Execute E2E Tests
Run the project's Playwright/Puppeteer test scripts against the local server to verify that no layout modifications break existing user stories.
```bash
node test_intake_pipeline.mjs
```

### Step 3: Capture High-Fidelity Screenshots
Capture a minimum of 3-5 screenshots of the interface in different states using Playwright/Puppeteer:
- Public Landing Page (`P-00`)
- Credentials Form (`P-06`)
- Active Dashboard view of each authenticated role (e.g. `A-01` for Admin, `E-01` for Employee)
- Specific persona/scenario states being tested (e.g., the geocoder lookup state for Rick Vance)

### Step 5: Write walkthrough.md Execution Report
Write a `walkthrough.md` file in the artifacts directory. You must include:
* **Interactive Localhost Links:** Clickable links targeting the active local server (e.g., `http://localhost:3000/?bypass=Admin&page=A-01`).
* **Autopsy Patch:** Explain bugs or updates using the exact `[Jargon] -> [Business Impact]` format.
* **Embedded Image Proofs:** Use absolute path embeds: `![caption](/C:/Users/.../screenshot.png)`. Do not use relative paths or simple file links.
* **1-3-1 Momentum Handoff:**
  - 1 Problem we need to solve next.
  - 3 Technical Options to solve it.
  - 1 Recommendation (Chosen path).

## Common Mistakes
- **Single Screenshot:** Only providing one image. The standard strictly requires 3-5 images showing different pages, menus, or collapsed cards.
- **Wrong Port Links:** Providing links with wrong port numbers. Always confirm the local server is bound on port 3000 before publishing links.
- **Silent Patches:** Explaining technical modifications without linking them to direct business/customer outcomes.
