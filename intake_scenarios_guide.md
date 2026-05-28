# RHIVE CRM Intake Pipeline: Manual Testing Guide

This document contains **all 13 customer practice scenarios** to manually verify the intake form, automated lookup auto-formatting, dynamic data mapping, AI-assisted notes optimization, boundary checks, billing lockdowns, and automatic stage triaging.

---

## 🏗️ Triage Stage Logic Matrix

When submitting any intake project, the system automatically triages the record into one of two pipeline buckets on the Sales Pipeline Board (`E-18`):

1. **Estimate Bucket (Ballpark Estimate)**
   * **Trigger:** Customer is looking for a ballpark price (`purchaseIntent === 'Exploring'` / **"Need A Ballpark Price"** selected in UI) **AND** has no active leaks, emergency tarps, or requested inspections.
   * **Stage Assigned:** `Estimate`

2. **Quote Bucket (Firm Quote / Inspection / Emergency)**
   * **Trigger:** Customer is ready for a firm quote (`purchaseIntent === 'Ready'` / **"Need A Firm Quote"** selected in UI) **OR** needs an inspection scheduled (`isInspectionRequired` is true) **OR** has an active leak/needs an emergency tarp (`emergencyTarp` is true).
   * **Stage Assigned:** `Quote`

---

## 🚀 General Setup for Manual Testing

1. **Host Address:** Open your web browser and navigate to the application URL:
   * **URL:** `http://localhost:3003/?bypass=Employee&page=E-02a`
   * *Note: The `bypass=Employee` parameter ensures you are logged in with correct administrative permissions to access the pipeline.*
2. **Resetting Database State:** To ensure clean database runs, open the DevTools console (`F12`) and run:
   ```javascript
   localStorage.clear();
   location.reload();
   ```
   *(This ensures zero collisions or duplicate records from previous runs).*
3. **The Global/Universal Search Modal:** In the top navigation bar, click the **New Project** button. This opens the top-middle **Universal Intake Search** overlay modal where all lookups are performed.

---

## 📋 The 13 Manual Testing Scenarios

```
┌────────────────────────────────────────────────────────────────────────┐
│                              INDEX OF TEST CASES                       │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. Rick Vance (DISC-EAGLE-01)      │ 8. Gomez Proxy (OPER-RES-PROXY)    │
│ 2. Jenny Miller (DISC-PARROT-01)  │ 9. BuildWest (OPER-COMM-BUILDER)   │
│ 3. Robert Chen (DISC-DOVE-01)     │ 10. Sarah Kensington (COMM-MULTI)  │
│ 4. Arthur Pendleton (DISC-OWL-01) │ 11. Valley View (OPER-FIN-LIT)     │
│ 5. Vanguard PM (OPER-COMM-LEAK)   │ 12. Hansen Collision (OPER-DUP)    │
│ 6. Apex Group (OPER-COMM-REGIONAL)│ 13. Gail Rasmussen (OPER-GEO-BOUND)│
│ 7. Thomas Henderson (RES-OWNER)   │                                    │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

### 🦅 Scenario 1: DISC-EAGLE-01 (Rick Vance)
* **Goal:** Verify Eagle personality compatibility, dynamic auto-formatting phone number behavior, address lookup autofinding, and ballpark triage.
* **Testing Steps:**
  1. Open **New Project** search.
  2. Click into the search field and type: `2085550192` (Type rapidly without parentheses or hyphens).
     * *Verification:* Confirm the input automatically formats to `(208) 555-0192` and displays a banner saying **"No matching record found. Database search returned zero collisions."**
  3. Clear the search field, then type: `1420 Pine St`
     * *Verification:* Confirm the address triggers a search and returns **"No matching record found."**
  4. Click the pink **Initiate New Project** button.
  5. Fill in the Property details:
     * Address: `1420 Pine St`
  6. Fill in the Primary Contact details:
     * First Name: `Rick`
     * Last Name: `Vance`
     * Phone Number: `(208) 555-0192`
     * Email: `rick.vance@gmail.com`
  7. Click the pink **Save Contact** button.
  8. Scroll down to **Select Project Category**, and click **Replacement**.
  9. For customer's intent, click **Need A Ballpark Price**.
  10. Click **Submit Project** at the bottom.
* **Expected Outcome:** Project is saved and you are redirected to the Pipeline Board. Rick Vance appears in the **Estimate** bucket.

---

### 🦜 Scenario 2: DISC-PARROT-01 (Jenny Miller)
* **Goal:** Verify Parrot personality compatibility, transcript paste, and AI-assisted notes optimization.
* **Testing Steps:**
  1. Open **New Project** search.
  2. Type: `555-0231` (Verify "No matching record" banner).
  3. Click **Initiate New Project**.
  4. Fill in the Property details:
     * Address: `350 Meadow Lane`
  5. Fill in the Primary Contact details:
     * First Name: `Jenny`
     * Last Name: `Miller`
     * Phone Number: `(208) 555-0231`
     * Email: `jenny.miller@gmail.com`
  6. Click **Save Contact**.
  7. Under **Project Category**, select **Replacement**.
  8. Under customer's intent, select **Need A Firm Quote**.
  9. Find the **Rough Notes / Transcript** box and paste the following phone call transcript:
     > "Hey there! Oh my gosh, I was talking to my neighbor Sarah and she was raving about how you guys replaced her roof, and I really want to check pricing for my home. My name is Jenny Miller, my number is 555-0231, and I am looking for standard dark gray/charcoal asphalt shingles."
  10. Click the **Optimize Notes** button below the text area.
      * *Verification:* Verify that the AI banner displays: **"Mapped Jenny Miller - Dark Gray/Charcoal shingle specs successfully."** and has auto-populated the details.
  11. Click **Submit Project**.
* **Expected Outcome:** Saved successfully. Jenny Miller is triaged and placed in the **Quote** bucket on the board.

---

### 🕊️ Scenario 3: DISC-DOVE-01 (Robert Chen)
* **Goal:** Verify Dove personality compatibility, process reassurance logging, and ballpark price triage.
* **Testing Steps:**
  1. Open **New Project** search.
  2. Type: `555-0344` (Verify "No matching record").
  3. Click **Initiate New Project**.
  4. Fill in the Property details:
     * Address: `100 South 200 East`
  5. Fill in the Primary Contact details:
     * First Name: `Robert`
     * Last Name: `Chen`
     * Phone Number: `(208) 555-0344`
     * Email: `robert.chen@gmail.com`
  6. Click **Save Contact**.
  7. In the notes section, type: `Small spot on living room ceiling. Needs process reassurance.`
  8. Under **Project Category**, select **Replacement**.
  9. Under customer's intent, select **Need A Ballpark Price**.
  10. Click **Submit Project**.
* **Expected Outcome:** Saved successfully. Robert Chen is placed in the **Estimate** bucket.

---

### 🦉 Scenario 4: DISC-OWL-01 (Arthur Pendleton)
* **Goal:** Verify Owl personality compatibility, detailed specifications itemization toggle, and custom material rules.
* **Testing Steps:**
  1. Open **New Project** search.
  2. Type: `555-0455` (Verify "No matching record").
  3. Click **Initiate New Project**.
  4. Fill in the Property details:
     * Address: `450 North Temp St`
  5. Fill in the Primary Contact details:
     * First Name: `Arthur`
     * Last Name: `Pendleton`
     * Phone Number: `(208) 555-0455`
     * Email: `arthur@domain.com`
  6. Click **Save Contact**.
  7. Under the Project Details, look for **Detailed Specs Itemization** and click the toggle button to switch it **ON**.
     * *Verification:* Confirm additional fields are exposed (Underlayment, Ice Shield, Compliance).
  8. Choose the following specs:
     * Underlayment Type: Select **Heavy Synthetic Underlayment**
     * Ice Shield Required: Toggle **ON**
     * License Compliance: Toggle **ON**
  9. Under **Project Category**, select **Replacement** -> **Need A Ballpark Price**.
  10. Click **Submit Project**.
* **Expected Outcome:** Saved successfully. Arthur Pendleton is placed in the **Estimate** bucket with all technical specs recorded.

---

### 🏢 Scenario 5: OPER-COMM-LEAK (Vanguard PM / Gary Kowalski)
* **Goal:** Verify commercial project initiation, multiple contact routing with role responsibility assignments, and active leak quote routing.
* **Testing Steps:**
  1. Open **New Project** search.
  2. Type: `4505 Industrial Parkway` (Verify "No matching record").
  3. Click **Initiate New Project**.
  4. On the Project Type dialog, select **Commercial** and click **Confirm Selection**.
  5. Fill in the Property details:
     * Address: `4505 Industrial Parkway`
  6. Fill in the first Contact (Primary):
     * First Name: `Brooke`
     * Last Name: `Stone`
     * Phone Number: `(208) 555-9999`
     * Email: `brooke.stone@vanguard.com`
     * Responsibilities: Toggle **Billing / Invoice** to ON.
     * Click **Save Contact**.
  7. Click the **Add Project Contact** button to add the onsite site manager.
  8. Fill in the second Contact:
     * First Name: `Gary`
     * Last Name: `Kowalski`
     * Phone Number: `(208) 555-8888`
     * Email: `gary@vanguard.com`
     * Responsibilities: Toggle **Site Access** to ON.
     * Click **Save Contact**.
  9. Scroll to Project Details, select **Repair**.
  10. Under the active leak question, click **Yes** (to trigger active leak/emergency tarp routing).
  11. Click **Submit Project**.
* **Expected Outcome:** Saved successfully. Vanguard PM/Gary Kowalski is placed in the **Quote** bucket (due to active leak).

---

### 🏬 Scenario 6: OPER-COMM-REGIONAL (Apex Storage)
* **Goal:** Verify commercial corporate parent company registry, site name details, and no-leak repair ballpark estimation routing.
* **Testing Steps:**
  1. Open **New Project** search.
  2. Type: `8800 S Redwood Road` (Verify "No matching record").
  3. Click **Initiate New Project**.
  4. Select **Commercial** and click **Confirm Selection**.
  5. Fill in the Property details:
     * Address: `8800 S Redwood Road`
  6. In the Commercial Hierarchy inputs:
     * Parent Company: `Apex Storage Solutions Group`
     * Property Site Name: `Apex Redwood Site`
  7. Fill in the first Contact (Primary):
     * First Name: `Douglas`, Last Name: `Sterling`, Phone: `(208) 555-7777`, Email: `douglas@apex.com`.
     * Click **Save Contact**.
  8. Click **Add Project Contact**.
  9. Fill in the second Contact:
     * First Name: `Melissa`, Last Name: `Pratt`, Phone: `(208) 555-6666`, Email: `melissa@apex.com`.
     * Click **Save Contact**.
  10. Scroll down, select **Repair**.
  11. Under the active leak question, select **No** (confirming no immediate emergency).
  12. Click **Submit Project**.
* **Expected Outcome:** Saved successfully. Apex Storage is placed in the **Estimate** bucket.

---

### 🏠 Scenario 7: OPER-RES-OWNER-ASPHALT (Thomas Henderson)
* **Goal:** Verify residential owner firm quote routing and single material selection.
* **Testing Steps:**
  1. Open **New Project** search.
  2. Type: `555-1212` (Verify "No matching record").
  3. Click **Initiate New Project**.
  4. Fill in the Property details:
     * Address: `1124 East Meadow Creek Lane`
  5. Fill in the Primary Contact:
     * First Name: `Thomas`, Last Name: `Henderson`, Phone: `(208) 555-1212`, Email: `thomas.h@gmail.com`.
     * Click **Save Contact**.
  6. Select **Replacement** -> **Need A Firm Quote**.
  7. Select **Asphalt Shingles** as the requested roofing material.
  8. Click **Submit Project**.
* **Expected Outcome:** Saved successfully. Thomas Henderson is triaged into the **Quote** bucket.

---

### 🔗 Scenario 8: OPER-RES-PROXY-MULTIMAT (Gomez)
* **Goal:** Verify multi-material selection (Asphalt + Flat roof combo) and dual contact payer vs resident billing routing.
* **Testing Steps:**
  1. Open **New Project** search.
  2. Type: `342 Hope Avenue` (Verify "No matching record").
  3. Click **Initiate New Project**.
  4. Fill in the Property details:
     * Address: `342 Hope Avenue`
  5. Fill in the first Contact (Payer/Primary):
     * First Name: `Christian`, Last Name: `Gomez`, Phone: `(208) 555-5555`, Email: `christian@gomez.com`.
     * Responsibilities: Toggle **Billing / Invoice** to ON.
     * Click **Save Contact**.
  6. Click **Add Project Contact**.
  7. Fill in the second Contact (Resident/Secondary):
     * First Name: `Maria`, Last Name: `Gomez`, Phone: `(208) 555-4444`, Email: `maria@gomez.com`.
     * Click **Save Contact**.
  8. Select **Replacement** -> **Need A Firm Quote**.
  9. Material Selection: Click **BOTH** the **Asphalt Shingles** button and the **TPO/Membrane** button to enable both.
  10. Click **Submit Project**.
* **Expected Outcome:** Saved successfully. The Gomez project is placed in the **Quote** bucket.

---

### 📧 Scenario 9: OPER-COMM-BUILDER-EMAIL (BuildWest)
* **Goal:** Verify builder commercial profile registration and firm quote routing.
* **Testing Steps:**
  1. Open **New Project** search.
  2. Type: `10400 S State Street` (Verify "No matching record").
  3. Click **Initiate New Project**.
  4. Select **Commercial** and click **Confirm Selection**.
  5. Fill in the Property details:
     * Address: `10400 S State Street`
  6. In the Commercial Hierarchy inputs:
     * Parent Company: `BuildWest Construction Partners`
  7. Fill in the Contact:
     * First Name: `Frank`, Last Name: `Garrison`, Phone: `(208) 555-3333`, Email: `frank@buildwest.com`.
     * Click **Save Contact**.
  8. Select **Replacement** -> **Need A Firm Quote**.
  9. Click **Submit Project**.
* **Expected Outcome:** Saved successfully. BuildWest is placed in the **Quote** bucket.

---

### 🏢 Scenario 10: OPER-COMM-MULTIPROP (Sarah Kensington)
* **Goal:** Verify multi-property corporate management ballpark quote routing.
* **Testing Steps:**
  1. Open **New Project** search.
  2. Type: `555-5000` (Verify "No matching record").
  3. Click **Initiate New Project**.
  4. Select **Commercial** and click **Confirm Selection**.
  5. Fill in the Property details:
     * Address: `400 South Main Street`
  6. In the Commercial Hierarchy inputs:
     * Parent Company: `Summit Horizon Real Estate`
  7. Fill in the Contact:
     * First Name: `Sarah`, Last Name: `Kensington`, Phone: `(208) 555-5000`, Email: `sarah.k@summithorizon.com`.
     * Click **Save Contact**.
  8. Select **Replacement** -> **Need A Ballpark Price**.
  9. Click **Submit Project**.
* **Expected Outcome:** Saved successfully. Summit Horizon is placed in the **Estimate** bucket.

---

### 🔒 Scenario 11: OPER-FIN-LITIGATION (James Patton / Valley View)
* **Goal:** Verify Escrow Account billing lockdown rules. Attempts to override billing configurations must be completely blocked.
* **Testing Steps:**
  1. Open **New Project** search.
  2. Type: `775 Canyon Breeze Lane` (Verify "No matching record").
  3. Click **Initiate New Project**.
  4. Fill in the Property details:
     * Address: `775 Canyon Breeze Lane`
  5. Fill in the Contact:
     * First Name: `James`, Last Name: `Patton`, Phone: `(208) 555-1111`, Email: `james.patton@escrow.com`.
     * Click **Save Contact**.
  6. Scroll down to find the **Billing Confirmation Required** accordion and click it to expand it.
  7. Find the **Escrow Account Billing Rules** toggle and click it to turn it **ON** (`#switch-escrow-billing`).
     * *Verification:* Observe that the billing input fields become visually grayed out and blocked.
  8. Try to click or type into any billing input fields (e.g. deductible, carrier).
     * *Verification:* Confirm that clicking the area triggers a red error banner at the top of the section: **"Billing parameters locked under escrow rules"**.
  9. Select **Replacement** -> **Need A Ballpark Price**.
  10. Click **Submit Project**.
* **Expected Outcome:** Saved successfully. Valley View is placed in the **Estimate** bucket with billing locks preserved in DB.

---

### 💥 Scenario 12: OPER-DUP-COLLISION (Hansen duplicate collision)
* **Goal:** Verify that looking up a property with an existing project in the database triggers duplicate protection warnings and offers profile merging.
* **Testing Steps:**
  * **Part A: Create Initial Profile**
    1. Open **New Project** search.
    2. Search for: `1290 East Appledale Rd` (Verify "No matching record").
    3. Click **Initiate New Project**.
    4. Set Address: `1290 East Appledale Rd`.
    5. Set Contact: `Linda Hansen`, `(208) 555-2222`, `linda.hansen@gmail.com`. Click **Save Contact**.
    6. Select **Replacement** -> **Need A Ballpark Price** -> Click **Submit Project**.
  * **Part B: Trigger and Verify Collision**
    7. Once redirected to the board, click the **New Project** button again.
    8. In the search box, type: `1290 East Appledale Rd`
       * *Verification:* A flashing amber warning card appears inside the lookup modal: **"Existing Record Found - Address Collision Detected (Linda Hansen)"**.
    9. Click the green **Merge / Relate to Existing** button (`#btn-merge-profiles`).
* **Expected Outcome:** The system successfully merges Tyler Hansen's new inquiry with Linda's existing property profile instead of generating a duplicate project card.

---

### 🗺️ Scenario 13: OPER-GEO-BOUNDARY (Gail Rasmussen Boise ID Out of Boundary)
* **Goal:** Verify that inputting an address outside the defined service boundary (e.g. Boise, Idaho) blocks calendar scheduling and redirects to a referral module.
* **Testing Steps:**
  1. Open **New Project** search.
  2. Type: `402 W Jefferson St` (Verify "No matching record").
  3. Click **Initiate New Project**.
  4. Fill in the Property details:
     * Address: `402 W Jefferson St, Boise, ID`
  5. Fill in the Primary Contact:
     * First Name: `Gail`, Last Name: `Rasmussen`, Phone: `(208) 555-1234`, Email: `gail.rasmussen@gmail.com`.
     * Click **Save Contact**.
  6. Select **Repair** -> Roof Age: **Yes (<15 Years)** -> **No photos yet**.
  7. Under the inspection scheduling section:
     * *Verification:* Confirm a warning banner is displayed: **"Out of Service Boundary: Scheduling blocked"** and the calendar date selector is locked.
  8. Click **Submit Project**.
     * *Verification:* Confirm a modal pops up detailing the third-party provider referral instructions. Click OK.
* **Expected Outcome:** Saved successfully. The project is created and routes the lead correctly.

---
*RHIVE-OS Version 1.0 sovereign execution build.*
