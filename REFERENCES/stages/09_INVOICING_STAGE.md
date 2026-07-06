# 9. INVOICING (FINAL SETTLEMENT)

> [!IMPORTANT]
> **Master Stage Document (MSD)**: This is the "One True Source" for Stage 9.
> **Vision**: The "Cash Register" — ensuring 100% financial resolution through absolute transparency and compliance.
> **QCI Rating**: 1,000,000 (Targeting Signal Density & Brand Resonance).

## 1. Stage Mission & Core Metrics
- **Mission**: Reconcile all project costs, secure final payment, and ensure all legal/compliance paperwork is executed.
- **Success Criteria**: 0% "Unresolved Balance" at 30 days post-install.
- **Key KPIs**: Average Collection Time, AWO Recovery Rate, Compliance Audit Pass Rate.

## 2. Integrated App Page Inventory
*Linked from Master Page Registry (APP PAGES.xlsx.csv)*

| Page ID | Name | Route / Component | Primary Function | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **E-34** | Invoicing Page | `/ops/invoicing` | Final Billing, Ledger, & AWO Reconciliation. | Critical |
| **E-35** | Payments Page | `/global/payments` | Multi-tender Register (Split Pay / Financing). | High |
| **C-03** | Project Profile | `/portal/project` | Customer "Visual Ledger" & Payment Gateway. | High |

### Page-Function Alignment Matrix
- **Ledger Sync (E-34)**: Bidirectional updates between field AWOs and the final invoice.
- **Compliance Shield (E-34)**: Blocks "Send" if Job = Commercial AND `Lien_Waiver` == NULL.
- **Split-Pay Register (E-35)**: Manages partial payments across multiple methods (Cash/CC/Financing).

## 3. Logic Engines: The Financial Resolver

### The "Visual Ledger" (E-34 -> C-03)
- **T-Account Architecture**:
  - **Left (Charges)**: Original Contract + Approved AWOs (Post-Install work).
  - **Right (Credits)**: Deposits + Draws + Efficiency Credits (RPSP).
- **Interactive Drill-down**: Clicking any AWO line item opens the photo/signature of that specific field fix.

### Commercial Compliance Gating (The "Paperwork Shield")
- **The Gov/Commercial Protocol**:
  - **Trigger**: Job metadata includes `COMM_TAG` or `GOV_TAG`.
  - **Hard Gate**: System blocks "Invoice Send" link until:
    1. **Final Lien Waiver** is digitally signed by Owner.
    2. **G702/G703** AIA documents are generated and attached.
    3. **Certificate of Insurance** (COI) is verified as current.

### The "Collections Bot" (Omni-Bird Finance)
- **Urgency Engine**:
  - **Phase 1 (Day 1-3)**: "Congratulations on your new roof! Your final invoice is ready for review." (Email/Push).
  - **Phase 2 (Day 7)**: "Still waiting on the final polish. Pay today to unlock your Warranty Vault." (SMS + Link).
  - **Phase 3 (Day 14)**: **AI Voice Call**. AI identifies as "Rhive Accounts" and offers a one-time "Early Settlement" credit of $50 or an Enhancify financing bridge to close the file.

## 4. Payment Actions (E-35)
- **Split-Tender Designer**: Allows homeowner to pay e.g., $10k via Check and $2,450 via Credit Card Fees.
- **Fee Protector**: System auto-calculates the 3% Swipe Fee for card portions and prompts for Rep/Client approval to add it as a line item.

## 5. UI Directive: The Settlement Anchor
- **Visuals**: A "Green Shield" (Resolution Badge) appears on the ledger once Balance = $0.
- **CTA**: "Payment Received! Your Warranty Vault is now being prepared for Stage 10."

---
**Version**: 2.1 (Indexed Draft)  
**Status**: ACTIVE  
**Last Sync**: 2026-02-09
