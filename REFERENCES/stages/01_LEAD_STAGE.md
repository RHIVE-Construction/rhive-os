# 1. LEAD (INTAKE & TRIAGE)

> [!IMPORTANT]
> **One True Source (OTS)**: This document governs the logic, UI mapping, and operational mandates for Stage 1. It bridges the public website, internal intake tools, and the triage AI.

## 1. Stage Mission & Core Metrics
- **Mission**: Convert "Curious Visitors" and "Action Seekers" into structured Property Leads.
- **Success Criteria**: Every lead must have a verified address, a Timeline (Shopping vs Ready), and a Path Assignment (A-E).
- **Key KPIs**: Lead Capture Rate, Triage Accuracy, Time to Response.

## 2. App Page Inventory (Blueprint Mapping)
*Mapping from Master Page Registry (APP PAGES.xlsx.csv)*

| Page ID | Name | Route / Component | Primary Function | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **P-01** | About Us | `/about` | Tech-Noir Identity & Trust Building | High |
| **P-02** | Our Services | `/services` | Capability Catalog (Residential vs Commercial) | High |
| **P-03** | Our Process | `/process` | 10-Stage Visualization (Anxiety Reduction) | Critical |
| **P-04** | Financing | `/financing` | RPSP Logic & Payment Terms Disclosure | High |
| **P-05** | Contact | `/contact` | Directory & Direct Founder Access | High |
| **P-08** | Public Estimate Tool | `/estimate` | Instant Ballpark (Path A/B Generation) | High |
| **E-02** | Global Lookup | `(Internal)` | Universal Property/Customer Entry Point | High |
| **E-02a** | Customer Input | `/customer-input` | Dynamic Intake, Routing & Photo Capture | High |
| **E-26** | Lead Stage Page | `/admin/leads` | Employee Holding Pen / Triage Management | High |

## 3. Logic Engines & Gates

### Universal Triage Engine (Paths A-E)
*Governed by [IntakeTriage.tsx](file:///c:/Users/mjrob/OneDrive/Desktop/App%20Repo s/RHIVE-OS-1.0/components/IntakeTriage.tsx)*

| Path | Profile | Action Gate | Resulting State |
| :--- | :--- | :--- | :--- |
| **Path A (Ballpark)** | Curious / Shopping | Timeline: "Shopping" | Ungated Estimate (P-08) |
| **Path B (Action)** | "Ready to Roll" | Timeline: "Ready" | Certified Quote + Sched (E-02a) |
| **Path C (Inspector)** | Damage / Emergency | Toggle: "Leak" or "Insurance" | Forced Inspection Workflow |
| **Path D (Specialist)** | Manual / High Touch | Selection: "Call me ASAP" | Priority CRM Callback |
| **Path E (Referrer)** | Abundance Network | Param: `?ref=...` | Referral Tracker Activation |

### Commercial/Government Mandate
- **Input**: If Property Use = "Commercial" or "Government".
- **Rule**: Bypass "Ballpark" automation.
- **Output**: Lock pricing; direct user to "Schedule On-Site Inspection" (E-02a).

## 4. UI/UX "Tech-Noir" Directives
- **Visual Hooks**: Neon-pink progress indicators, high-contrast imagery, and the **Transparency Grid** on the estimate results.
-Terminologies: The phrase **"Lifetime Installer No-Leak Guarantee"** must be visible on P-01, P-02, and P-08.

## 5. Operational Commands (Human/AI)
1. **AI Assistant (E-03)**: Must interpret rough intake notes and map them to the proper triage path.
2. **SOP**: "Never reveal pricing to a Commercial lead without an inspection signature." 
3. **Escalation**: Triage failures or "IDK" paths are routed to **Lead Stage Page (E-26)** for manual oversight by Maureen (Admin).

## 6. Integration & External Sync
- **APIs**: Google Maps (Address Verification), Google Static Maps (Visual Intake).
- **Webhooks**: Zoho CRM (Lead Creation), Twilio (SMS Callback Alerts).

---
**Version**: 2.6 (Indexed Enterprise)  
**Status**: ACTIVE  
**Last Sync**: 2026-02-09
