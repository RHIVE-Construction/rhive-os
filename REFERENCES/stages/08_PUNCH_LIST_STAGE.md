# 8. PUNCH LIST (QUALITY & ACCOUNTABILITY)

> [!IMPORTANT]
> **Master Stage Document (MSD)**: This is the "One True Source" for Stage 8.
> **Vision**: The "Zero-Defect Standard" — using data to penalize neglect and reward craftsmanship.
> **QCI Rating**: 1,000,000 (Targeting Signal Density & Brand Resonance).

## 1. Stage Mission & Core Metrics
- **Mission**: Identify every final detail (leaks, trash, paint touch-ups) and ensure completion before final billing can occur.
- **Success Criteria**: 0% Post-Final-Payment callbacks (The job is DONE).
- **Key KPIs**: Average Days to Clear Punch, Contractor Radar Score, Defect Rate per 100sq.

## 2. Integrated App Page Inventory
*Linked from Master Page Registry (APP PAGES.xlsx.csv)*

| Page ID | Name | Route / Component | Primary Function | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **E-33** | Punch List Page | `/ops/punch-list` | Defect Assignment & Verification Gate. | Critical |
| **E-10** | Vendor Profile | `/ops/vendors` | Houses the Contractor Radar results. | High |
| **C-03** | Project Profile | `/portal/project` | Customer view of open fix-items (Transparency). | High |

### Page-Function Alignment Matrix
- **Defect Tracker (E-33)**: Central hub for identifying and assigning "Hotspots" (Defects).
- **Vendor Scoring (E-10)**: Real-time update of the "Radar Chart" upon punch list completion.
- **Verification Window (E-33)**: Dual-signature gate (Contractor Fix + PM Audit).

## 3. Logic Engines: The Quality Ledger

### The "Defect Proposal" (E-32 -> E-33)
- **Field Capture**: Crews flag defects (or Admins create them).
- **Logic**: Every defect MUST have a photo + category + pinpointed location on the Roofr report.
- **Assignment**: PM selects the responsible Subcontractor. This auto-updates their "Radar Score."

### The "Contractor Radar" (The Scoring Engine)
- **Multi-Axis Performance Chart**:
  - **Quality**: Ratio of jobs without punch items.
  - **Punctuality**: Average time to arrival vs. scheduled window.
  - **Resilience**: Speed of fix (Average hours to clear punch list).
- **The "No-Show" Penalty**: Every unannounced no-show triggers an automatic -10 point drop on the public leaderboard.
- **Tiered Access**: Contractors with Score < 80 are restricted to "Repair Only" leads; Score > 90 unlocks "Enterprise" high-margin deployments.

### The "Dual-Verification Gate"
- **Step 1: Contractor Fix**: Contractor uploads a GPS-tagged photo of the fix.
- **Step 2: PM Audit**: PM reviews photo or performs site visit.
- **Action**: Only when BOTH signatures/verifications are complete does the item status flip to `PURGED`.
- **System Lock**: Stage 9 (Invoicing) is strictly gated. The "Generate Final Invoice" button is disabled if `OPEN_PUNCH_COUNT > 0`.

## 4. Automation: The Reschedule Tracker
- **Logic**: If a contractor requests a reschedule >24h in advance, no penalty occurs.
- **Logic**: If <24h, the AI Bot records the "Reason for Delay" and prompts the PM for approval. The reason is archived for annual vendor review.

## 5. UI Directive: The Quality Anchor
- **Visuals**: A red pulse (Hotspot) on the roof map showing exactly where the defect is located.
- **Assurance**: The portal tells the customer: "We've spotted [X] items that don't meet our standard. We've already assigned your crew to fix them before we send your final bill."

---
**Version**: 2.1 (Indexed Draft)  
**Status**: ACTIVE  
**Last Sync**: 2026-02-09
