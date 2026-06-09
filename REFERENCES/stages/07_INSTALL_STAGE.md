# 7. INSTALL (LIVE CONSTRUCTION EXECUTION)

> [!IMPORTANT]
> **Master Stage Document (MSD)**: This is the "One True Source" for Stage 7.
> **Vision**: The "Construction Command Center" — real-time field transparency and frictionless financial modifications.
> **QCI Rating**: 1,000,000 (Targeting Signal Density & Brand Resonance).

## 1. Stage Mission & Core Metrics
- **Mission**: Execute the physical installation while providing the customer with a "Front-Row Seat" through live updates and immediate change-order approvals.
- **Success Criteria**: 100% "No-Surprise" billing (all change orders approved before the roof is finished).
- **Key KPIs**: Change Order Approval Speed, Photo Stream Density, Time-to-Draft (40% Invoice).

## 2. Integrated App Page Inventory
*Linked from Master Page Registry (APP PAGES.xlsx.csv)*

| Page ID | Name | Route / Component | Primary Function | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **E-32** | Install Stage Page | `/ops/install` | Mobile-first Crew Hub & Live Photo Stream. | Critical |
| **C-03** | Project Profile | `/portal/project` | Customer "Live Feed" View & AWO Signatures. | High |
| **E-11** | Company Calendar | `/ops/calendar` | Real-time "Crew Check-In/Check-Out" tracking. | High |

## 3. Logic Engines: The Construction Command

### The "Live Construction Feed" (E-32 -> C-03)
- **Mechanism**: Integrated mobile camera access for Crew Leads.
- **Categorization**: Photos are tagged by stage: `TEAR_OFF`, `DRY_IN`, `FLASHING`, `COMPLETION`.
- **Sync**: Uploads instantly appear as a "Story Mode" style slider for the customer in C-03.
- **Trust Factor**: AI auto-captions the photos (e.g., "Your old shingles have been removed! Readiness 100%").

### Change Order Triage (The "Frictionless AWO")
- **Field Step**: Crew identifies rotten decking or extra flashing. They snap a photo via E-32 and enter the dimensions (e.g., "3 Sheets of Plywood").
- **Office Step**: PM receives a push notification -> PM verifies the unit price (Admin can override) -> PM clicks "Send for Approval."
- **Client Step**: Customer receives an SMS link to a **Mini-Sign Page**.
- **The "No-Stop" Rule**: Work continues while the link is in the air. If the customer hasn't approved within 15 mins, the AI Bot (Twilio) triggers a "Courtesy Call" to explain the necessity of the fix.

### The "40% Draw" Automated Trigger
- **Condition**: Once the PM clicks the **"Verify Substantial Completion"** button (Roof is watertight/done).
- **Logic**: 
  - 1. Sum original contract balance (Draw 2).
  - 2. Sum all *Approved* AWOs.
  - 3. Generate Invoice.
- **Action**: Invoice is pushed to the Customer Portal and emailed instantly. The status moves toward Stage 8 (Punch List) if items like Gutters remain.

## 4. The "Trade Handoff" Wizard
- **Logic**: Upon completion of the primary trade (Roofing), the Crew Lead fills out the **Trade Handoff Form**.
- **Selections**: 
  - `READY_FOR_GUTTER`: Notifies the Gutter Crew + Schedules MS-4 Logistics.
  - `PUNCH_LIST_NEEDED`: Routes to Stage 8 (E-33) with specific defect tags.

---
**Version**: 1.1 (Indexed Draft)  
**Status**: ACTIVE  
**Last Sync**: 2026-02-09
