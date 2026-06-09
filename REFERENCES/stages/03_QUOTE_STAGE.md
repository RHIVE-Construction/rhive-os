# 3. QUOTE (CERTIFIED PROPOSAL & PORTAL)

> [!IMPORTANT]
> **Master Stage Document (MSD)**: This is the "One True Source" for Stage 3.
> **Vision**: The "Zero-Resistance Checkout" — transforming uncertainty into a legally binding, high-trust automated transaction.
> **QCI Rating**: 1,000,000 (Targeting Signal Density & Brand Resonance).

## 1. Stage Mission & Core Metrics
- **Mission**: Transition estimate data into a precision-verified "Certified Quote" and secure a signed contract + 50% initial investment.
- **Success Criteria**: Quote-to-Contract conversion > 40%.
- **Key KPIs**: Time-to-Sign, RPSP Usage Rate, Average Upsell (Gutter/HT).

## 2. Integrated App Page Inventory
*Linked from Master Page Registry (APP PAGES.xlsx.csv)*

| Page ID | Name | Route / Component | Primary Function | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **E-23** | Quote Builder Tool | `/sales/builder` | Employee side: Manual input + PDF Handoff. | Critical |
| **E-28** | Quote Stage Page | `/sales/quote` | The Closing Room: Roofr integration & Kiosk Mode. | Critical |
| **E-29** | Sign & Verify | `/checkout` | The Checkout: 50% Deposit + Contract Signature. | Critical |
| **C-01** | Customer Homepage | `/portal` | The Digital Lobby: 72hr Loading Bar Tracker. | High |
| **C-03** | Project Profile | `/portal/project` | Single Project Tracker (Stage 03 specific UI). | High |
| **C-04** | My Profile | `/portal/profile` | Personal/Financial Wallet & Comm Preferences. | Medium |

## 3. Logic Engines: The Promotion Engine (RPSP)

### The Dynamic Pricing Timer (The "Urgency Engine")
Prices automatically update based on the `quote_viewed_at` timestamp.

1. **Phase 1: Zero-Profit Intensity (0 - 24 Hours)**
   - **Logic**: Strategic market entry. `RetailPrice = CostBasis (Material + Labor + Overhead)`.
   - **Internal Frame**: No profit is taken. This is a volume-building "Turnkey Acceleration" move.
   - **Visual**: Global Red "0% PROFIT" Banner + 24h Countdown.

2. **Phase 2: RHIVE Efficiency Credit (24 - 72 Hours)**
   - **Residential**: 10% Credit (Max $1,000). Strips out "The Chase" admin costs.
   - **Commercial**: Tiered Matrix:
     - <$50k: $1,000 Credit.
     - >$50k: $1,500 + $500 per additional $50k.
   - **Explainer**: Tooltip linking to [RPSP Protocol](file:///c:/Users/mjrob/OneDrive/Desktop/App%20Repo%20s/assistant_bot/inputs/RHIVE%20Project%20Savings%20Promotion).

3. **Phase 3: Standard Retail (72+ Hours)**
   - **Logic**: Full "Walmart of Premium" margins applied.
   - **Frame**: "Market Volatility" lock expires. Prices revert to standard catalog rates.

### The "Ghost Link" & Account Lifecycle
- **Step 1: The Ghost Link**: Post-Estimate intake sent via SMS Token. Allows question answering with **Zero Friction** (Anonymous).
- **Step 2: The Gated Reveal**: To view the high-precision "Certified Quote," user must verify Phone (SMS) and set a Password.
- **Step 3: Portal Activation**: Account is 100% active with the quote pre-loaded in the shopping cart.

### Price Match Protocol ($50 Credit)
- **Delight Logic**: Automated $50 "Peace of Mind" credit applied *instantly* upon successful PDF/Photo upload of a competitor bid.
- **Audit**: Employee is alerted to perform "Apples-to-Apples" comparison but the customer sees the reward immediately.

## 4. Employee Closing Tools (E-28)

### Visual Audit & Scaling Measurement
- **Roofr Integration**: Automatic retrieval of CAD/3D measurements.
- **Image Markup**: SVG-based scaling tool. PM sets 1ft scale on a known object (window/door), allowing "Drawing" of gutters/flashings to calculate auto-priced linear footage.
- **Street View Sync**: Comparison of Google Street View vs. Inspection Photos for discrepancy detection.

### Kiosk Mode
Toggles the dashboard into a customer-facing "Shopping Cart" where the Rep can modify options live.
- **Actions**: Add/Remove Gutters, Heat Trace, Flat Sections.
- **Real-time Recalculate**: Updates the 50% Investment amount instantly.

## 5. Status Transitions & Automations
| Status | Trigger | Action |
| :--- | :--- | :--- |
| **Quote Requested** | Stage 2 Conversion | SMS "Ghost Link" sent to intake questions. |
| **Quote Ready** | Employee Submits | Notification: "Your Certified Quote is ready - Timer Started!" |
| **Contract Signed** | Digital Sign (E-29) | Automatic transition to **Stage 4: Sign & Verify**. |
| **Deposit Paid** | 50% Payment (Stripe) | Moves to Schedule; Alert PM for material ordering. |

---
**Version**: 1.1 (Indexed Draft)  
**Status**: ACTIVE  
**Last Sync**: 2026-02-09
