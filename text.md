# RHIVE Quantum OS: Unified Intake & Page Flow Specification

## 1. The "Universal Gateway" Philosophy
Instead of disparate forms for quotes, repairs, and inquiries, RHIVE OS uses a **Universal Intake Funnel**. This ensures that every piece of data captured is high-fidelity and address-anchored from the moment of entry.

### Primary Entry Points (Call-to-Actions)
- **"Instant Estimate"** (P-12): Focuses on anonymous, ballpark pricing.
- **"Start Project" / "Get My Quote"**: Focuses on high-intent, certified pricing.
- **"Schedule a Call"**: Focuses on immediate contact for leaks or repairs.
- **"Contact Us" / "Inquiry"**: A general triage entry into the same system.

Regardless of where the user starts, they are channeled into the same logic engine to ensure data consistency.

---

## 2. The Public-Facing Intake Flow (The Funnel)

### Phase A: Address & Verification (The Anchor)
1. **Address Identification**: Autocomplete via Google Places.
2. **Visual Verification**: A Map/Street View light-box pops up. 
   - *User Question*: "Is this your project address?"
   - *System Benefit*: We capture the precise geolocation and property data before any contact info is requested.

### Phase B: Triage Branching (Determining Intent)
The system asks exact, high-authority questions to route the user:
1. **Active Leak?**
   - **Yes**: Offer **Emergency Tarping ($150-$1000)** -> Route to **Inspection (Stage 3/4)**.
   - **No**: Continue to next.
2. **Insurance Claim?**
   - **Yes**: Capture Status (Approved/In-Process/Interested), Damage Type, and Date -> Route to **Certified Quote / Inspection**.
3. **Project Scope**:
   - **Repair**: Request Photos or **Inspection**.
   - **Replacement**: Proceed to Phase C.
4. **Sector**: Residential vs. Commercial vs. Government.

### Phase C: Dual-Path Pricing
1. **Ballpark Estimate (Tire Kicker Path)**
   - **Configurator**: User answers 4-5 questions (Layers, Chimneys, Skylights, Swamp Coolers).
   - **Calculation**: Google Solar API sizes the roof; System applies "Dual-Math" retail logic.
   - **Output**: Interactive "Shopping Cart" view.
   - **Upsell**: "Create Login to save this work and lock in a Certified Quote."
2. **Certified Quote (Serious Buyer Path)**
   - **Validity**: Locked for **15 Days**.
   - **Detail Capture**: Structures, roof access (ladder/drone), specify materials.
   - **Conversion**: Enforced Account Creation (to prevent lost data).

---

## 3. The "Six Worlds" Topology

### World 1: Public (P-Series)
- **Role**: Brand Indoctrination & Discovery.
- **Pages**: About Us, Services, Process, Financing.
- **Goal**: Convert visitors into the Intake Funnel.

### World 2: Customer (C-Series)
- **Role**: The "Pizza Tracker" for roofs.
- **Account Creation**: Automatically triggered by requesting a Certified Quote or saving an Estimate.
- **Key Function**: Review/Approve Proposals, View Progress Photos (from K-Pages), Real-time Chat with Project Managers, Payments (50/40/10).

### World 3: Employee (E-Series)
- **Role**: The "Command Center".
- **Income Actionator**: A dashboard sorted by **Project Value** (revenue-first prioritization).
- **Manual Intake**: Used for phone-in leads; it mirrors the public funnel but allows employees to search for existing data first.

### World 4: Admin (A-Series)
- **Role**: Financial & System Configuration.
- **Dual-Math**: Configures the "Floor" (Material + Labor + Overhead) vs. "Ceiling" (Retail Price).

### World 5: Contractor (K-Series)
- **Role**: Field Crew execution.
- **Offline-First**: Crucial for rural roof sites.
- **Photo Engine**: Uploads live install photos directly into the Customer Portal.

### World 6: Supplier (S-Series)
- **Role**: Inventory & PO Management.

---

## 4. The 11-Stage State Machine (The Life Cycle)
Every project follows this path. Any "Public Page" or "Inquiry" is simply an entry point into Stage 1 or 2:
1. **LEAD**: Anonymous capture.
2. **ESTIMATE**: Ballpark logic applies.
3. **QUOTE**: Human-verified proposal.
4. **SIGN & VERIFY**: Contract & Deposit.
5. **SCHEDULE**: Logistics activated.
6. **PRE-INSTALL**: Site staging.
7. **INSTALL**: Field work & photo stream.
8. **PUNCH LIST**: Quality vetting.
9. **INVOICING**: Balancing the books.
10. **COMPLETED**: Project closed, warranties issued.
11. **PAST CUSTOMER**: Referral/Loyalty loop.

---

## 5. Visual Identity (Tech-Noir)
- **Void (#000000)**: Premium black backgrounds.
- **RHIVE Pink (#ec028b)**: Electric pink for primary actions and "glows".
- **Glassmorphism**: Semi-transparent, frosted-glass cards floating over animated circuitry.
- **24px Chamfer**: 45-degree angle corner cuts on all containers (clip-path).
