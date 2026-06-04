# 4. SIGN & VERIFY (LEGAL & CAPITAL SECUREMENT)

> [!IMPORTANT]
> **Master Stage Document (MSD)**: This is the "One True Source" for Stage 4.
> **Vision**: The "Point of No Return" — where trust is codified into a binding commitment via automated legal friction.
> **QCI Rating**: 1,000,000 (Targeting Signal Density & Brand Resonance).

## 1. Stage Mission & Core Metrics
- **Mission**: Codify the quote into a signed contract and secure the 50% initial investment to trigger production logistics.
- **Success Criteria**: 100% of projects in this stage have verified signatures and deposit entries.
- **Key KPIs**: Deposit Lag Time, Approval Turnaround, Billing Contact Accuracy.

## 2. Integrated App Page Inventory
*Linked from Master Page Registry (APP PAGES.xlsx.csv)*

| Page ID | Name | Route / Component | Primary Function | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **E-29** | Sign & Verify Page | `/sales/sign-verify` | The Checkout: Live Cart Editing + Sign + Payment. | Critical |
| **A-01** | Admin Dashboard | `/admin` | Approval Queue for price/term modifications. | High |
| **C-04** | My Profile | `/portal/profile` | Contact Management & Wallet updates. | Medium |
| **E-G-01**| Global Nav | `/search` | Add/Associate new contacts mid-flow. | High |

## 3. Logic Engines: The Governance Engine

### Permission-Based Price Control (The Governance Engine)
- **Full Admin**: Direct modification of `LineItemCount` or `RetailTotal`. Automatically regenerates the Digital Contract.
- **Sales Rep**: Modifications create a `Proposed_Change` object.
- **Action**: Triggers a **Global Admin Queue** notification (A-01) with optional SMS escalation to the Manager on duty.
- **Status**: Signature/Payment links are **LOCKED** until Admin approval.

### Associated Contact & Billing Forge
- **Problem**: The Lead is the property owner, but a parent or business partner is the payer.
- **Solution**: "Associated Contact" panel in E-29.
  - **Contact Creation**: Add unlimited associated contacts (Name, Email, Phone, Role).
  - **The Magic Payload**: Ability to send the **Investment Link** (50% Deposit) to a different contact than the **Signature Link**.
  - **Portal Access**: Every associated contact receives a tokenized "Magic Link" for portal entry with a high-visibility "Reset Password" CTA.

### The "Frozen Frame" Policy (Timer Logic)
- **Logic**: To prevent "Close Anxiety," the 24h/72h RPSP timer **FREEZES** the moment the project enters Stage 4.
- **Trust Frame**: The price is locked during the "Review & Verify" window, ensuring the customer feels the "Earned Discount" is safe while they handle logistics.

### The "Fast Track" Rescission Logic (E-29)
- **Problem**: Compliance vs. Velocity.
- **Solution**: A binary "Choice Architecture" for the 3-Day Right of Rescission.
  - **Default State**: **Unselected**. The UI must explicitly display: **"FAST TRACK: NOT SELECTED"**.
  - **Unselected Info**: "Your project is currently on wait. Permitting and scheduling will begin after the mandatory 3-business-day rescission period."
  - **Action**: User manually checks the box to "Fast Track."
  - **Selected Info**: "Fast Track Active: We will begin pulling permits immediately upon receipt of your initial investment. You acknowledge the waiving of the 3-day wait period to accelerate production."
  - **Visual**: Use a high-density "Urgency Badge" (Yellow/Pink) when selected vs. a "Safe Grey" when waiting.

## 4. The "Easy Link" Suite
Automated one-click payloads sent via SMS (Twilio) or Email (SendGrid):

1. **The Signature Link**: Direct bypass to the **Integrated Signature Canvas**. Captures IP, Timestamp, and Device ID for the Audit Trail.
2. **The Investment Link**: Direct bypass to Stripe Checkout (pre-filled 50% amount). Supports **Split Tender** (multiple contacts paying portions toward the 50% goal).
3. **The Portal Link**: Tokenized "Magic Link" for entry + 1-click Password Reset. Ends "I can't log in" friction.

## 5. Status Transitions & Automations
| Status | Trigger | Action |
| :--- | :--- | :--- |
| **Awaiting Signature** | Stage 3 Close | Link sent to Primary Contact. |
| **Awaiting Deposit** | Signature Verified | Link sent to Billing Contact. |
| **Approval Pending** | Sales Modification | Alert Admin A-01; Lock Link functionality. |
| **Verified & Paid** | Sign + 50% Pay | **Transition to Stage 5: Schedule**. |

---
**Version**: 2.1 (Indexed Instant Estimate)  
**Status**: ACTIVE  
**Last Sync**: 2026-02-09
