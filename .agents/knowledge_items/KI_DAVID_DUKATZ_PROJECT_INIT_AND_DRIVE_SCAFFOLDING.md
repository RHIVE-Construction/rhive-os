# KNOWLEDGE ITEM: DAVID DUKATZ PROJECT INITIALIZATION & GOOGLE DRIVE LIFECYCLE
**ID:** `KI-DUKATZ-DRIVE-20260820`  
**Category:** Customer Onboarding & Cloud Drive Architecture  
**Author:** RHIVE Execution Builder & Lead Architect  
**Commit Hash:** `58c67db`  
**Date:** 2026-08-20  

---

## 📌 1. EXECUTIVE SUMMARY
This Knowledge Item preserves the complete project setup, communications audit, property geometry, and Google Drive 5-tier architecture established for **David DuKatz** (`11689 S Country Brook Ct, South Jordan, UT 84095`).

---

## 🏛️ 2. CUSTOMER & PROPERTY PROFILE
* **Customer Name:** David DuKatz
* **Contact Line:** `+1 (801) 647-5525` | **Email:** `dukatz5432@aol.com`
* **Lead Source:** BidMailers Direct Mail Campaign (Custom QR Code Scan)
* **Salt Lake County APN:** `27-19-476-013-0000` (Country Brook Sub Phase 1, Lot 13)
* **Permit Authority:** City of South Jordan Building & Safety Division
* **Google Drive Target:** [`17uo1T6T9lOvXEFNM8K41RFh53cDnpenP`](https://drive.google.com/drive/folders/17uo1T6T9lOvXEFNM8K41RFh53cDnpenP)

---

## 📐 3. PROPERTY GEOMETRY & ROOFR TAKEOFF SPECIFICATION
* **Structure 1 (Primary Residence):**
  * Footprint: 1,630 sq ft | Pitched Area: 2,445 sq ft (**24.45 Net Squares**)
  * Pitch Distribution: `6/12` (18.35 SQ across 7 facets) & `7/12` (6.10 SQ across 3 facets).
  * Linear Footages: Ridges `64 LF`, Hips `42 LF`, Valleys `38 LF` (2 runs W-metal), Eaves `136 LF`, Rakes `106 LF`, Step Flashing `34 LF`.
* **Structure 2 (Detached Back Garage):**
  * Footprint: 580 sq ft | Pitched Area: 820 sq ft (**8.20 Net Squares**)
  * Pitch Distribution: `6/12` (8.20 SQ across 4 facets) + 2 Skylights (`24 LF` curb flashing).
* **Total Combined Net Squares:** **32.65 SQ (3,265 sq ft across 14 facets)**.
* **Instant Estimate v2 Waste Orders:**
  * Structure 1 (+12% Standard): 28 SQ (83 bundles)
  * Structure 2 (+10% Base): 10 SQ (28 bundles)
  * Blended Combined Order (+11.5%): **37 Squares (111 bundles)**.

---

## 🗂️ 4. DEPLOYED GOOGLE DRIVE HIERARCHY
```
David DuKatz/ (17uo1T6T9lOvXEFNM8K41RFh53cDnpenP)
│
├── 📂 01_Communications & Audio/
│   ├── 📄 00_DAVID_DUKATZ_CONTACT_DATA.md
│   ├── 🎵 Incoming Call with David DuKatz.wav
│   └── 📝 Transcription-Incoming Call with David DuKatz.txt
│
├── 📂 02_Measurements & Takeoffs/
│   ├── 📄 01_DAVID_DUKATZ_PROPERTY_DATA.md
│   ├── 📑 Roofr.pdf
│   ├── 📊 Main House Beta template (Current Quote Tool)
│   └── 📊 Additional Structure Beta template (Current Quote Tool)
│
├── 📂 03_Permits & HOA/
│   └── 📑 HOA_Country_Brook_Subdivision_Rules.md
│
├── 📂 04_Photos & Videos/
│   ├── 📁 01_Before/
│   ├── 📁 02_During/
│   └── 📁 03_After/
│
└── 📂 05_Proposals & Contracts/
```

---

## 🧠 5. PERSISTED SYSTEM BEHAVIORS (`/learn`)
1. **Direct Google Drive API Scaffolding (`rhive-bid-init`):** Automates the 5-tier project folder initialization and media sync via Service Account backend (`scripts/drive-automation/service-account.json`).
2. **Property & Takeoff Invariants (`rhive-quantum-os.md`):** Mandates separate structure numbering, pitch distribution tables (pitch, angle, sqft, squares, facets), and v2 waste formulas (+10% Simple, +12% Standard, +11.5% Blended).
3. **Mermaid Rendering Rule:** Invariant prohibiting `timeline` in favor of standard `flowchart TD` / `flowchart LR` formatting.
