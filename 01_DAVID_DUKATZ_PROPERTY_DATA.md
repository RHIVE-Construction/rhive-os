# 🏛️ PROPERTY DATA & ROOF GEOMETRY SPECIFICATION
**Project ID:** `PRJ-DUKATZ-2026-08`  
**Property Address:** 11689 S Country Brook Ct, South Jordan, UT 84095  
**Salt Lake County APN:** [`27-19-476-013-0000`](https://slco.org/assessor/)  
**County Plat Document Search:** [Salt Lake County Recorder Search](https://recorder.saltlakecounty.gov/)  
**County Plat Map Directory:** [Salt Lake County Plat Map Portal](https://slco.org/recorder/research/plat-maps/) (Plat `27-19-476`, Lot 13)  
**Permit Authority:** [City of South Jordan Building & Safety Division](https://www.sjc.utah.gov/175/Building)  
**Google Drive Master Folder:** [David DuKatz Drive Project Folder](https://drive.google.com/drive/folders/17uo1T6T9lOvXEFNM8K41RFh53cDnpenP)  

---

## 🛰️ 1. Structure Numbering & Pitch-by-Pitch Breakdown

```
========================================================================================
PROPERTY ROOF OVERVIEW: 2 STRUCTURES | 14 TOTAL FACETS | 32.65 TOTAL NET SQUARES
========================================================================================
```

### 🏠 STRUCTURE 1: Primary Residence
* **Classification:** Single-Family Residential (2-Story w/ Finished Basement)
* **Ground Footprint:** `1,630 sq. ft.`
* **Total Pitched Roof Area:** `2,445 sq. ft.` (**24.45 Net Squares**)
* **Total Facet Count:** **10 Facets**
* **Dominant Slope:** `6/12 (26.6°)`

#### Structure 1 Pitch Distribution Matrix
| Pitch (Rise/Run) | Slope Angle (°) | Roof Area (Sq Ft) | Roof Squares (SQ) | Facet Count | Primary Location / Orientation |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **6 / 12** | 26.57° | 1,835 sq. ft. | **18.35 SQ** | 7 Facets | Main Front, Rear & Side Gables |
| **7 / 12** | 30.26° | 610 sq. ft. | **6.10 SQ** | 3 Facets | Front Entry Accent & Bay Projections |
| **SUBTOTAL** | — | **2,445 sq. ft.** | **24.45 SQ** | **10 Facets** | **Structure 1 Complete** |

#### Structure 1 Linear Takeoff Footages
* **Ridges:** `64 Linear Feet` (Continuous VentSure® Ridge Vent Run)
* **Hips:** `42 Linear Feet` (ProEdge® Hip & Ridge Cap)
* **Valleys:** `38 Linear Feet` (2 Valleys: South Front Door 20 LF, North Bay Window 18 LF)
* **Eaves:** `136 Linear Feet` (5" Seamless Gutters & Drip Edge)
* **Rakes:** `106 Linear Feet` (T-Style Gable Drip Edge Metal)
* **Step / Wall Flashing:** `34 Linear Feet` (Wall & Chimney/Stucco Interfaces)

---

### 🏚️ STRUCTURE 2: Detached Back Garage
* **Classification:** Detached Accessory Outbuilding (~10 Years Old)
* **Ground Footprint:** `580 sq. ft.`
* **Total Pitched Roof Area:** `820 sq. ft.` (**8.20 Net Squares**)
* **Total Facet Count:** **4 Facets**
* **Dominant Slope:** `6/12 (26.6°)`
* **Appurtenances:** **2 Skylights** (24" × 48" standard curbs, `24 LF` curb perimeter)

#### Structure 2 Pitch Distribution Matrix
| Pitch (Rise/Run) | Slope Angle (°) | Roof Area (Sq Ft) | Roof Squares (SQ) | Facet Count | Primary Location / Orientation |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **6 / 12** | 26.57° | 820 sq. ft. | **8.20 SQ** | 4 Facets | East & West Main Gable Slopes |
| **SUBTOTAL** | — | **820 sq. ft.** | **8.20 SQ** | **4 Facets** | **Structure 2 Complete** |

#### Structure 2 Linear Takeoff Footages
* **Ridges:** `24 Linear Feet`
* **Eaves:** `48 Linear Feet` (Eave Drip Edge)
* **Rakes:** `40 Linear Feet` (Gable Drip Edge)
* **Skylight Step Flashing:** `24 Linear Feet` (2 × 12 LF step kits)

---

## 📊 2. Instant Estimate Formula v2 Waste Factor Schedule

> **Instant Estimate v2 Rules Engine:**  
> • **Simple Gable (<6 facets, 0 valleys, slope ≤ 6/12):** Base waste = `10.0%` (Applied to Structure 2)  
> • **Standard Hip & Valley (6–12 facets, 1–2 valleys, slope 6/12–7/12):** Standard waste = `12.0%` (Applied to Structure 1)  
> • **Complex Multi-Structure Cut (12+ facets, valleys, skylights):** Maximum waste = `15.0%`  

### Structure-by-Structure & Blended Material Order
| Structure / Tier | Net Squares | Formula v2 Waste % | Gross Calculated SQ | Bundles (3/SQ) | Material Order Target |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Structure 1 (Main House)** | 24.45 SQ | **+12.0% (Standard)** | 27.38 SQ | 83 Bundles | **28 Squares** |
| **Structure 2 (Garage)** | 8.20 SQ | **+10.0% (Simple)** | 9.02 SQ | 28 Bundles | **10 Squares** |
| **Total Property (Combined)** | **32.65 SQ** | **+11.5% (Blended)** | **36.40 SQ** | **111 Bundles** | **Order 37 Squares (Formula Default)** |
| **Alternative: +10% Min Cut** | 32.65 SQ | +10.0% (Tight) | 35.91 SQ | 108 Bundles | Order 36 Squares |
| **Alternative: +15% Max Cut** | 32.65 SQ | +15.0% (Safety) | 37.55 SQ | 114 Bundles | Order 38 Squares |

---

## 🛰️ 3. Google Solar API vs. Roofr Precision CAD Takeoff

| Measurement Parameter | Google Solar API Engine | Roofr Aerial CAD Takeoff | Delta / Variance | Functional Takeoff Role |
| :--- | :---: | :---: | :---: | :--- |
| **Structure 1 Area** | 2,420 sq. ft. (24.20 SQ) | **2,445 sq. ft. (24.45 SQ)** | +25 sq. ft. (+1.0%) | Main house tear-off base |
| **Structure 2 Area** | 820 sq. ft. (8.20 SQ) | **820 sq. ft. (8.20 SQ)** | 0 sq. ft. (0.0%) | Detached garage separate line |
| **Total Property Area** | **3,240 sq. ft. (32.40 SQ)** | **3,265 sq. ft. (32.65 SQ)** | **+25 sq. ft. (+0.8%)** | **Certified Total Bid Surface** |
| **Structure 1 Pitch Range** | 6.5/12 Average | **6/12 (75%) & 7/12 (25%)** | Granular separation | Accurate labor tiering |
| **Structure 2 Pitch** | 6/12 Average | **6/12 (100%)** | Exact match | Standard walkability |
| **Total Facet Count** | 12 planes modeled | **14 distinct CAD facets** | +2 micro-facets | High-fidelity facet takeoff |
| **Total Ridges** | ~80 LF | **88 LF** | +8 LF | VentSure® Ridge Vent run |
| **Total Hips** | ~40 LF | **42 LF** | +2 LF | ProEdge® Hip & Ridge Cap |
| **Total Valleys** | ~36 LF | **38 LF** | +2 LF | **Heavy W-Valley Metal (2 runs)** |
| **Total Eaves** | ~180 LF | **184 LF** | +4 LF | **5" Seamless Gutters + Drip Edge** |
| **Total Rakes** | ~140 LF | **146 LF** | +6 LF | T-Style Rake Drip Edge Metal |
| **Step Flashing** | Unresolved | **34 LF** | +34 LF (Unique) | Wall & transition metal |
| **Skylights** | Modeled as flat | **2 Units (24 LF curb)** | 2 Units (Unique) | Step-flashing curb kits |

---

## 📷 4. High-Resolution Low Aerial Satellite Imagery & Geometry

* **Satellite Coordinates:** `40.540103° N, -111.956712° W`
* **Elevation:** `4,495 ft ASL`
* **Google Maps High-Res Aerial Link:** [Google Maps 11689 S Country Brook Ct (75m Zoom)](https://www.google.com/maps/place/11689+Country+Brook+Ct,+South+Jordan,+UT+84095/@40.540103,-111.956712,75m/data=!3m1!1e3)
* **Solar Potential / Annual Flux:** `1,820 kWh/m²/year` (Peak thermal stress on South and West roof planes)

```
                              [NORTH]
                                ▲
                                │
                 Structure 2 (Detached Back Garage)
                 ┌─────────────────────────────┐
                 │  4 Facets 6/12 | 8.20 SQ    │  [2 Curb Skylights]
                 │  48 LF Eaves   | 40 LF Rakes│
                 └──────────────┬──────────────┘
                                │
         Structure 1            │
     (Primary Residence)        │
   ┌────────────────────────────┴────────────────────────────┐
   │                                                         │
◄──┼── 10 Facets (6/12: 18.35 SQ | 7/12: 6.10 SQ)           ──┼──► [EAST]
[WEST] 24.45 Net Squares | 64 LF Ridges | 42 LF Hips         │
   │   2 Drainage Valleys (38 LF Heavy W-Valley Metal)       │
   │   136 LF Eaves (5" Seamless Gutters + Drip Edge)        │
   │   34 LF Wall Step Flashing                              │
   └────────────────────────────┬────────────────────────────┘
                                │
                                ▼
                             [SOUTH]
                 Peak Convective Wind & Storm Axis
                 (Basement Window Well Protection Zone)
```

---

## 🌪️ 5. Historical Weather & Storm Events Log (South Jordan, UT)

| Date of Event | Event Type | Severity / Metrics | Roof Impact & Risk Profile |
| :--- | :---: | :--- | :--- |
| **July 29, 2026** | Severe Thunderstorm | 60 mph Microburst Wind | Edge uplift and fastener stress |
| **July 21, 2026** | Severe Wind Event | 60+ mph Sustained Gusts | Shingle tear-off hazard |
| **August 14, 2026** | Flash Flood Advisory | 1.2"+ Intense Cloudburst | Basement window well overflow on South eave |
| **May 19, 2025** | Hail & High Wind | Pea to Quarter-sized hail | Surface granule loss |
| **Summer 2024 Storm** | Wind & Hail (Ins. Claim) | Shingle damage / $250 payout | Policy shifted to ACV by insurance company |

---

## 🏛️ 6. Subdivision Governance, Building Codes & Color Options

**Subdivision:** Country Brook Subdivision (Phase 1, South Jordan, UT)  
**County APN:** [`27-19-476-013-0000`](https://slco.org/assessor/)  
**Salt Lake County Recorder Search:** [Salt Lake County Public Records Portal](https://recorder.saltlakecounty.gov/)  
**Plat Map Directory:** [Salt Lake County Plat Map Directory](https://slco.org/recorder/research/plat-maps/) (Plat `27-19-476`, Lot 13)  
**HOA Guidelines File:** [HOA_Country_Brook_Subdivision_Rules.md](https://drive.google.com/drive/folders/17uo1T6T9lOvXEFNM8K41RFh53cDnpenP)  

1. **Approved Roofing Materials:**
   * **Mandated Standard:** Laminated architectural dimensional shingles with minimum 30-year manufacturer warranty rating and Class A fire certification.
   * **Prohibited Systems:** Flat 3-tab shingles, untreated cedar shakes, and exposed raw corrugated metal panels.
   * **Compliance:** **Owens Corning Duration Architectural Shingles** exceeds all structural, aesthetic, and fire code requirements.

2. **Owner-Requested Color Options:**
   * ✅ **Black Sable (Owens Corning Duration Designer Series):** High-contrast, multi-dimensional blend of black, charcoal gray, umber brown, and dark slate. (Listed per owner preference; complements exterior masonry and dark trim).
   * ✅ **Estate Gray:** Traditional neutral architectural blend.
   * ✅ **Driftwood:** Warm desert earth-tone blend.
   * ✅ **Onyx Black:** Deep classic finish.
   * ✅ **Brownwood:** Warm rustic earth blend.

3. **Detached Structure Continuity:**
   * Detached garages and accessory outbuildings must match the primary residence in shingle brand, color, and roofline style. (David’s garage will use the identical Owens Corning Duration / Black Sable system as the main home).
