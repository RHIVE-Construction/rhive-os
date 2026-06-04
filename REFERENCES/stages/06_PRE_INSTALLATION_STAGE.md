# 6. PRE-INSTALLATION (ANXIETY MANAGEMENT)

> [!IMPORTANT]
> **Master Stage Document (MSD)**: This is the "One True Source" for Stage 6.
> **Vision**: The "Waiting Room" — transforming project anxiety into excitement through visual confirmation and pro-active updates.
> **QCI Rating**: 1,000,000 (Targeting Signal Density & Brand Resonance).

## 1. Stage Mission & Core Metrics
- **Mission**: Prepare the homeowner for the job site arrival, verify all material specifications, and maintain narrative momentum during the wait.
- **Success Criteria**: 0% "Wrong Color" disputes upon truck arrival.
- **Key KPIs**: Prep-Guide Completion Rate, Heartbeat Engagement, Manifest Verification Speed.

## 2. Integrated App Page Inventory
*Linked from Master Page Registry (APP PAGES.xlsx.csv)*

| Page ID | Name | Route / Component | Primary Function | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **E-31** | Pre-Install Page | `/ops/pre-install` | Readiness Meter & Product Manifest review. | Critical |
| **C-03** | Project Profile | `/portal/project` | Customer "Readiness" View & Manifest Approval. | High |
| **E-22** | Calendar Widget | `/global/calendar` | Displays the "Soft Schedule" vs. "Hard Install Date". | High |

## 3. Logic Engines: The Readiness Framework

The project is held in a "Soft Schedule" until these three gates are cleared:

1. **Gate 1: Material Watchdog (E-31)**
   - **Mechanism**: Email parser scans Supplier inboxes for "Delivery Scheduled" triggers.
   - **Internal Triage (Strict)**: If "Backorder" is detected, trigger an **Internal PM Alert**. The homeowner is not contacted until the PM defines a resolution path.

2. **Gate 2: Product Manifest (Kiosk Mode)**
   - **Mechanism**: Visual grid of Shingles, Gutters, and Accents.
   - **User Action**: **Verification Only**.
   - **Warning Logic**: If the customer attempts to change a color/spec, the UI displays a **"Delay/Fee Warning"**: *"Changing specifications now will result in project delays and potential administrative restocking fees. Contact your PM to initiate a Move-Back request."*

3. **Gate 3: Prep Guide (The Installation Contract)**
   - **Requirement**: Detailed terms (grass, car movement, gate access).
   - **Execution**:
     - **Portal**: Full Digital Signature required from customer.
     - **Employee Proxy**: Employees can "Mark Signed" if verbal approval is given; however, the **Call Recording** must be uploaded/linked to the file as legal proof.

## 4. The "Wednesday Heartbeat" (Modular Cron Logic)

Every Wednesday at 9:00 AM, the system fires a pro-active "Status Anchor":

- **Phase A (>1 Week Out)**: **Educational Stability**. SMS: "Everything is still on schedule for [Date]! We are currently monitoring [Weather/Supply]. No action needed. Watch this 1-min video on how we protect your landscaping during install."
- **Phase B (Install Week)**: **Logistical Blitz**. SMS: "It's Install Week! Your crew is confirmed for [Date]. Requirement Check: Move cars by 7 AM. Readiness: [100%]."
- **Delay Protocol**: If a weather setback occurs, the heartbeat pro-actively explains the new "Sliding Window" to keep the customer anchored.

## 5. Automation: The Readiness Meter
- **UI Component**: A Circular progress bar on E-31 and C-03.
- **Weighted Steps**:
  - Permit Approved (33%)
  - Material Landed (33%)
  - Prep Guide Signed (34%)
- **Threshold**: Deployment cannot move to Stage 7 (Install) until Meter = 100%.

---
**Version**: 2.1 (Indexed Draft)  
**Status**: ACTIVE  
**Last Sync**: 2026-02-09
