# Implementation Plan: RHIVE Tech-Noir Website Rebuild

Reconstruct the RHIVE public-facing website into a high-fidelity, "Tech-Noir" React application. This rebuild strictly enforces the Antigravity V.2.0 framework: Glassmorphism, 24px Chamfered Geometries, and Electric Pink (#ec028b) micro-accents.

## 🏗️ Architectural Foundations
- **Framework**: React + Tailwind CSS + Framer Motion.
- **Design Tokens**: Centralized in `index.css` via CSS variables for seamless Light/Dark mode transitions.
- **Identity Injection**: Senior Architect persona, maximizing data density and premium visual "wow" factor.

## 📋 Phase 1: Core Design System (DONE/In Progress)
- [x] **Tokens**: Define `--rhive-pink`, `--bg-main`, `--bg-card`, etc., in `index.css`.
- [x] **Utilities**: Implement `.card-tech`, `.btn-tech`, and `.glass` classes.
- [x] **Circuitry**: Integrate SVG circuitry background as a fixed overlay.

## 📋 Phase 2: Structural Implementation (Active)
- [x] **Navigation**: Fixed glass navbar with integrated Theme Toggle (Sun/Moon).
- [x] **Hero Section (P-01)**: High-impact display with "FINISH ON TOP" gradient typography.
- [x] **Capabilities Grid (P-02)**: Four interactive tech-cards with secondary list details and neon icons.
- [x] **The Process (P-03)**: 10-stage vertical journey tracker with auto-rotation and manual selection sync.
- [x] **Financing (P-04)**: Efficiency credit calculation display with "RPSP" glass metrics.
- [x] **Estimator CTA (P-08)**: High-contrast Command-style input terminal.

## 📋 Phase 3: Interactive Polish & Content
- [x] **Animations**: Implement staggered scroll entrance reveals using Framer Motion (GSAP-style precision).
- [x] **Leadership (P-01)**: Founder profile cards with "Leadership Presence" visualization.
- [x] **FAQ Modules (P-06)**: Animated accordions with pink-neon highlights.
- [x] **Footer (P-05)**: 4-column glass layout with "Social Grid" hexagon buttons.

## 📋 Phase 4: Final Quality Assurance
- [ ] **Responsive Audit**: Verify pixel-perfect layout across mobile, tablet, and ultra-wide.
- [ ] **Form Validation**: Ensure the "Instant Estimate" input feels like a functional terminal.
- [ ] **Performance Audit**: Optimize blur effects and SVG overlays to ensure 60fps interaction.

## 🛠️ Task List
- [x] Task 1: Refine `App.tsx` and `pageRegistry.tsx` to handle the new public page structure.
- [x] Task 2: Enhance `PublicHomepage.tsx` with all specific data and content from `webrebuild.html`.
- [x] Task 3: Implement the "Interactive Process" logic (auto-cycling stages).
- [x] Task 4: Add high-fidelity SVG Hexagon icons to match the Premium aesthetic.
