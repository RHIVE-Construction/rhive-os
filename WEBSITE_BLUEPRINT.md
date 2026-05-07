# RHIVE Construction Website Blueprint

## 🏠 Site Overview
High-fidelity, tech-forward roofing contractor website with a "Tech-Noir" / Quantum OS aesthetic.

## 🗺️ Site Map
1. **Home**: `https://www.rhiveconstruction.com/`
2. **About Us**: `https://www.rhiveconstruction.com/aboutus`
3. **Roofing (Services)**: `https://www.rhiveconstruction.com/utah-roofing`
4. **Accessories**: `https://www.rhiveconstruction.com/roofing-accessories-utah`
5. **Financing**: `https://www.rhiveconstruction.com/financing`
6. **Estimator**: `https://www.rhiveconstruction.com/estimator` (AI-powered portal)
7. **Insurance Claim**: `https://www.rhiveconstruction.com/insuranceclaim`

## 🎨 Design System
### Colors
- **RHIVE Pink (Neon)**: `#EC028B` (Primary actions, glows, active states)
- **Void (Black)**: `#000000` (Main background)
- **Starlight (White)**: `#FFFFFF` (Headings, primary text)
- **Electric Blue (Accents)**: `rgb(17, 109, 255)` (Secondary status/glows)

### Typography
- **Headings**: `Rubik` (Bold, tracked out for technical look)
- **Narrative**: `EB Garamond` (Sophisticated serif for mission/about sections)
- **UI/Body**: `Inter` or modern sans-serif.

### Visual Effects
- **Glassmorphism**: 60% opacity black backgrounds with backdrop-blur.
- **Chamfered Edges**: 24px-45px corner cuts on all primary containers.
- **Glows**: Neon drop shadows and border-glows on hover.
- **Circuitry Overlay**: Faint grey circuitry patterns on white backgrounds or sections.

## 🧩 Component Inventory
### 1. Global Navigation (Header)
- **Central Avatar**: The RHIVE circular logo (pink glow). Clicking this returns to the Public Homepage.
- **Split Nav**: Links on either side of the logo. 
- **Sticky Side-Nav**: Hexagonal "honeycomb" icons on the right for "Instant Estimate".

### 2. Hero Section
- High-res video background (roofing operations/drone footage).
- Glitch-effect headers.
- Primary CTA: "Instant Ballpark Quote" (Pink neon button).

### 3. Comparison Widget (Dual-Math)
- "RHIVE Way" vs. "Others".
- Icons for transparency, speed, and technology.

### 4. Service Matrix
- Commercial vs. Residential filters.
- Hover-effects on service cards showing "Before/After" thermal imaging or drone shots.

### 5. AI Assistant (Hunni)
- Floating action button in the bottom left.
- Triggers a technical chat interface.

## ⚙️ Functionality Mapping
- **Avatar Action**: `setActivePageId('P-00')`.
- **Estimate Trigger**: Open `/estimator` workflow.
- **Financing Flow**: Interactive questionnaire or link to Enhancify.
- **Insurance Claim**: Transparent process timeline (11-Stage flow integration).

## 🚀 Recreation Roadmap
1. [x] Update `CurrentWebsitePage.tsx` to host live iframe and fix avatar nav.
2. [ ] Build `RhiveGenericSection` component for tech-noir layouts.
3. [ ] Implement `TechHero` with video support.
4. [ ] Create `DualMathComparison` component.
5. [ ] Integrate `HunniChatWidget` into the static pages.
