# KNOWLEDGE ITEM: GOOGLE SOLAR API ENGINE & CANVASS APP TOOL SPECIFICATION

**ID:** KI-SOLAR-CANVASS-20260725  
**Category:** Core Engine & Field Automation Architecture  
**Author:** RHIVE Omni-Clone Lead Architect & Execution Builder  
**Last Updated:** 2026-07-25  

---

## 📌 EXECUTIVE SUMMARY
This Knowledge Item preserves the complete mathematical, architectural, and developer delegation specification for the **Google Solar API Engine** and the **Canvass & Door-to-Door Lead Entry Tool** (`Michaelrhive/Canvas-Tool`).

---

## 📐 1. GOOGLE SOLAR API MATHEMATICAL FORMULAS

### Pitch Rise/Run Conversion ($X/12$)
$$\text{pitchIn12} = \text{round}\left(12 \times \tan\left(\text{pitchDegrees} \times \frac{\pi}{180}\right)\right)$$

### Sloped Surface Multiplier ($M_{\text{pitch}}$)
$$M_{\text{pitch}} = \frac{1}{\cos\left(\text{pitchDegrees} \times \frac{\pi}{180}\right)}$$

$$\text{Sloped Area (Sq Ft)} = \text{Ground Area (Sq Ft)} \times M_{\text{pitch}}$$

### Slope Separation Rules
* **Flat Roof Facets ($\text{pitchIn12} < 3$ / Slope $< 14.04^\circ$):** Routed to TPO / PVC Membrane system calculations.
* **Pitched Roof Facets ($\text{pitchIn12} \ge 3$):** Routed to Asphalt Shingle System calculations.

---

## 🏷️ 2. 4-TIER SHINGLE PACKAGE RATES

1. **Base Package:** Owens Corning TruDefinition® Duration® ($100.00 / SQ$)
2. **FLEX Upgrade:** Owens Corning TruDefinition® Duration FLEX® ($125.00 / SQ$)
3. **Woodland Upgrade:** GAF Woodland® Designer Shingles ($150.00 / SQ$)
4. **Sequoia Upgrade:** GAF Grand Sequoia® Premium Designer ($175.00 / SQ$)

---

## 🗺️ 3. RHIVE OS CRM INTEGRATION LOCATION
* **Target Feature:** Employee Portal -> Map Section (`#/crm/map`).
* **Multi-Mode Map View Switcher:** Toggles between:
  1. `Canvass Lead Tool` (Satellite map tapping, instant lead entry, door knock conversion calculator).
  2. `Active Jobs Map` (Install crew locations, job sites, staging photo pins).
  3. `Territory & Storm Map` (Storm damage overlays, hail swaths, canvassing assignment zones).

---

## 👥 4. DEVELOPER DELEGATION MATRIX

| Developer | Feature Assignment | Code Base & Location |
| :--- | :--- | :--- |
| **James Gimena** | Satellite Map Pin-Dropping & UI | Connect Google Maps satellite pin-dropping from `Michaelrhive/Canvas-Tool` to `PrePrintCanvassDesk.tsx`. |
| **Victor Villero** | Backend Geocoding & Persistence | Build geocoded address collision lookup and lead persistence API route (`POST /api/leads/canvass-entry`) in FastAPI. |
| **Sheena Lestano** | Document Output & Video QR | Connect printable 4-page proposal booklet generator to Sheena's QR Video Embedder. |
| **Vanessa Poligratis** | Admin & Playbook Indexing | Index canvass playbooks (Exhibits A/B/C) and PVC cover alignment checklists into Executive Training Hub. |
| **Maureen Gonzales** | QA & Persona Test Suite | Run door-to-door lead intake tests against USR-101 to USR-116 test personas. |

---

## 📁 5. REFERENCE REPOSITORIES & DOCUMENTATION
* **Documentation File:** [docs/GOOGLE_SOLAR_API_CALCULATION_ENGINE_SPECIFICATION.md](file:///c:/Users/mjrob/OneDrive/Desktop/App%20Repo%20s/MJR_EPA/docs/GOOGLE_SOLAR_API_CALCULATION_ENGINE_SPECIFICATION.md)
* **Master Blueprint:** [docs/RHIVE_OS_WORKSPACE_CONSOLIDATION_AND_CLEANUP_PLAN.md](file:///c:/Users/mjrob/OneDrive/Desktop/App%20Repo%20s/MJR_EPA/docs/RHIVE_OS_WORKSPACE_CONSOLIDATION_AND_CLEANUP_PLAN.md)
* **GitHub Repository:** [`Michaelrhive/Canvas-Tool`](https://github.com/Michaelrhive/Canvas-Tool)
