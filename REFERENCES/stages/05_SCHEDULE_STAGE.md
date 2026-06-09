# 5. SCHEDULE (AIR TRAFFIC CONTROL)

> [!IMPORTANT]
> **Master Stage Document (MSD)**: This is the "One True Source" for Stage 5.
> **Vision**: The "Domino's Tracker of Construction" — eliminating the "Black Box" of scheduling through rigorous dependency management.
> **QCI Rating**: 1,000,000 (Targeting Signal Density & Brand Resonance).

## 1. Stage Mission & Core Metrics
- **Mission**: Orchestrate the exact convergence of Permit, Material, and Labor while keeping all stakeholders informed via modular AI automation.
- **Success Criteria**: 0% "Empty Site" days (materials present when crew arrives).
- **Key KPIs**: Permit Lead Time, Schedule Accuracy, AI Update Engagement.

## 2. Integrated App Page Inventory
*Linked from Master Page Registry (APP PAGES.xlsx.csv)*

| Page ID | Name | Route / Component | Primary Function | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **E-30** | Schedule Stage Page | `/ops/schedule` | Logistics Sequencer: Permit -> Material -> Labor. | Critical |
| **E-22** | Calendar Widget | `/global/calendar` | Blocks Crew scheduling < Material Delivery Date. | High |
| **C-03** | Project Profile | `/portal/project` | "Transparency Toggle" (Domino's Tracker) for Client. | High |
| **E-11** | Internal Calendar | `/ops/calendar` | Syncs Inspection Times & Pickup Logistics. | High |

### Page-Function Alignment Matrix
*Ensuring 100% parity with [APP PAGES.xlsx.csv](file:///c:/Users/mjrob/OneDrive/Desktop/App%20Repo%20s/assistant_bot/inputs/APP%20PAGES.xlsx.csv)*

- **Logistics Sequencer (E-30)**: Houses the "Traffic Light" system for MS-1 through MS-5.
- **Dependency Guard (E-22)**: Enforces "Labor Order" blocking logic until Permit + Material are confirmed.
- **AI Dispatch Bot (E-30)**: Triggers auto-calls/texts to sub-crews in native language (as per registry).
- **Transparency Toggle (C-03)**: Flips the internal ATC view to a clean, "Domino’s Tracker" style for the client.

## 3. Logic Engines: The Micro-Step Chain

To ensure modularity for AI automation, the project moves through these five internal micro-states:

| Step | Status Name | Technical Trigger | Dependency | Hard Gate |
| :--- | :--- | :--- | :--- | :--- |
| **MS-1** | **Permit Pull** | Permit App Submitted | Stage 4 Verified | Upload Receipt/Doc |
| **MS-2** | **Material Verify** | Earliest delivery confirmed | Permit Approval | Order Confirmation # |
| **MS-3** | **Labor Verify** | Sub pricing & date confirmed | Permit + MS-2 | Signed Work Order |
| **MS-4** | **Solidify Logistics** | Inspection Times + Orders | MS-3 Complete | Calendar Sync |
| **MS-5** | **Deploy Prep** | Customer Briefing sent | MS-4 Complete | Customer Ack |

### The "Drift-Timer" Incentive (Urgency Logic)
- **Logic**: The "Earliest Install Date" is a moving target.
- **Mechanism**: For every 24 hours that pass without MS-3 (Labor Verify) approval, the system auto-increments the Installation Date by +1 day.
- **UI**: Displayed as a "Velocity Warning" in both the Employee and Customer Portals: *"Act now to lock in [Date]. Delaying approval will push your install window to [Date + 1]."*

### The "Receipt-Gated" Handoff
- **Rule**: Steps cannot be marked "Done" via a simple checkbox.
- **Enforcement**: You must **Drag & Drop** the corresponding document (Permit PDF, Material Receipt, Sub-Work Order) into the step-box to trigger the status transition.
- **Data Capture**: These documents are auto-parsed for indices like "Shingle Color" vs. "Initial Proposal" to detect discrepancies before the truck arrives.

### Optimal Delay Logic (The Heartbeat Protocol)
- **Problem**: Dead silence during city permit delays.
- **Solution**: 3-Day Automated Heartbeat.
  - **Logic**: If status is `Permit Pull` and no update in 72h, AI sends SMS: "Still working with the city on your permit. No action needed from you, we're just keeping you in the loop! [2-1-2 Trace]"

### Price Integrity Gate (MS-3)
- **Rule**: If Subcontractor Quote > Projected Direct Cost (from 0% Profit window).
- **Action**: Trigger `ADMIN_OVERRIDE_REQUIRED`.
- **Logic**: PM is blocked from scheduling labor until an Admin approves the margin squeeze or renegotiates.

## 4. The "AI Status Window" Logic (Omni-Bird Automated Updates)

The AI Bot (Twilio/Voice/SMS) follows the **[2-1-2] Window Protocol**. Every update is structured as follows:

> **"[Past-2] & [Past-1] were completed. Currently, we are [CURRENT STEP]. Next, we will [Future+1] and [Future+2]."**

### Example: Current Status = Permit Pull (MS-1)
- **Script Data**: 
  - **Past**: `[Signature Signed]`, `[Initial Investment Received]`
  - **Current**: `[Pulling Permit]`
  - **Future**: `[Verifying Material Orders]`, `[Solidifying Labor Dates]`
- **AI Output**: "We've successfully secured your signature and investment. We are currently pulling your local permit. Once approved, we'll verify your material orders and solidify your labor dates."

### Example: Current Status = Labor Verify (MS-3)
- **Script Data**:
  - **Past**: `[Permit Approved]`, `[Materials Dated]`
  - **Current**: `[Verifying Subcontractor Pricing/Dates]`
  - **Future**: `[Solidifying Inspections]`, `[Monitoring Weather for Install Day]`

## 5. Automation: Weather Watchdog & Inspections
- **The "Dynamic Weather Header"**: 
  - **Widget**: A 10-day forecast widget in E-30 and C-03.
  - **Auto-City Logic**: The widget automatically detects the project's zip code and swaps the forecast to the local City weather.
  - **Thresholds**: Rain > 40% OR Wind > 25mph on Install Date = Automatic "Weather Watch" notification.
- **Inspection Transparency**: 
  - **Visibility**: Final inspection window is **PUBLIC** on the Customer Portal (C-03).
  - **Call to Action**: Portal tells homeowner: "The city will be out between [Time Window]. No need to be home for outside work, but gates must be unlocked."

---
**Version**: 2.1 (Indexed Instant Estimate)  
**Status**: ACTIVE  
**Last Sync**: 2026-02-09
