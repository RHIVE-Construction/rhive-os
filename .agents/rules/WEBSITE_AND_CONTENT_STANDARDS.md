# RHIVE OS — Website, Commercial & Blog Content Standards

> **Status: ALWAYS ACTIVE.** These rules apply to all website pages, commercial landing pages, marketing collateral, blog articles, intake CTAs, and referral systems — no exceptions.

---

## 1. Commercial RPSP Strict Prohibition
- **NEVER advertise or include RPSP (Project Savings Promotion) for commercial, industrial, or government projects.**
- RPSP is strictly an internal residential pricing tool (10% up to $1,000 efficiency credit with a 3-day statutory rescission window).
- Commercial and government procurement cycles involve multi-stakeholder and institutional approvals; tiered 72-hour or 7-day RPSP credits do not apply to commercial projects.
- Commercial financial terms must strictly cite **Institutional 50/40/10 Milestone Terms** and **Master Service Agreements (MSAs)** (progress billing, AIA G702/G703, Net-30 for qualifying accounts).

---

## 2. Commercial Engineering: Full Tear-Off vs. 1-Layer Re-Cover Standard
- Use a polished, professional engineering tone at all times. **Never use the words "cheap" or "cheap contractors".**
- **Best Practice (Full Tear-Off):** Tearing all the way down to the structural decking (steel, concrete, or wood) is always best practice and is legally mandatory under IBC Chapter 15 whenever there are 2+ existing roof layers or wet/damaged insulation.
- **How RHIVE Executes a 1-Layer Re-Cover:** When an existing roof has strictly 1 existing layer and passes non-destructive infrared/core moisture testing, RHIVE does NOT simply slit or lay over the old membrane. RHIVE tears off the top membrane down to the polyiso substrate, inspects 100% of the substrate, replaces any damaged/wet polyiso, and installs new fanfold cover board and a brand-new membrane (100% manufacturer-warrantable system over verified substrate and structural decking).

---

## 3. Unified Intake Flow & Smart CTA Pre-Selection
- **All intake CTAs site-wide must route into the single unified Intake Form (`pages/CustomerInputPage.tsx` / `E-02a` via `lib/intakeRouting.ts`).**
- **Smart Pre-Selection Rules:**
  - Clicking "Request Certified Quote" / "Request Quote" ➔ Pre-selects Purchase Intent = Certified Quote (`'Ready'`).
  - Clicking "Instant Estimate" ➔ Pre-selects Purchase Intent = Instant Estimate (`'Exploring'`).
  - Clicking "Request Inspection" / "Schedule Inspection" ➔ Pre-selects Purchase Intent = `'Inspection'`.
  - Clicking "Emergency Leak" ➔ Pre-selects Scope = `'Repair'` with `activeLeak = true`.
  - Clicking any CTA on Commercial pages ➔ Pre-selects Property Category = `'Commercial'`.
- Standalone unintegrated modals (such as `CapExDiagnosticLightbox`) are prohibited; all inquiries must persist to the unified database.
- Informational links:
  - "Configure Commercial Finance" routes to `/financing` (`P-04`).
  - "Insurance Data Hub" routes to `/insurance` (`P-13`).
  - "View Moisture Scan" opens the non-destructive infrared verification modal.

---

## 4. Contact Information & Phone Numbers
- **RHIVE Primary Phone Number:** `(435) 417-6637` (`435-41-ROOFS`).
- **NEVER use the typo area code `453`** (e.g. `4534176637` is strictly forbidden; always use `4354176637`).
- **Button Labels:** Label call buttons as `📞 Call (435) 417-6637` or `📞 Click to Call`. Never use `📞 Click to Call Tech Office`.
- **No broken `/estimator` links:** All primary pink estimation buttons must route through `navigateToIntake()`.

---

## 5. Deprecated Entities, Internal SKUs & Copy Rules
- **No "Qubit Turnkey" references:** Never reference "Qubit Turnkey" or obsolete external entities. Use "RHIVE OS digital precision" or "remote-first master-craftsman operations".
- **No internal SKU codes in customer-facing text:** Never display internal SKU codes like `ELEC-DET-RES`, `ELEC-DET-COM`, `SOLAR-PANEL-STORAGE`, or `SOLAR-PANEL-CANCEL` in public copy.
- **No duplicate or uninspected commercial square-foot pricing:** Do not anchor commercial flat roofs with raw "$5.50–$9.50/sq ft" or "$7.00–$12.00/sq ft" figures. Commercial roof pricing requires an on-site core/substrate inspection.
- **Zero SEO keyword stuffing:** Never write awkward local SEO phrases like "company near me" in prose. Always use natural phrasing like "Utah roof and seamless gutter contractor".
- **Spelling & capitalization standards:**
  - Always spell "Endorsements" correctly (never "endorsem*nts").
  - Capitalize sentence beginnings (e.g., "Neighborhood recently experienced...", "Hailstorms can strike...").

---

## 6. Abundance Network & Referral Compliance
- **Utah Insurance Deductible Law:** Never advertise or imply "$0 Deductible" or deductible waiving. In Utah, waiving deductibles is prohibited by insurance law. Always use "100% Code-Upgrade Approved" or "Insurance Code Advocacy".
- **No nonexistent pages:** Never reference "Zoho Thrive" or "C-10 My Home Vault". All referral and project data lives in the RHIVE Client Portal.
- **Referral Domain:** Always use the official domain `rhiveconstruction.com/ref/...` (never fake domain `rhive.com/ref/...`).
- **Referral Actions:** All referral widgets must have working Text Link (`sms:`) and Email Link (`mailto:`) share buttons with copy-to-clipboard functionality.
