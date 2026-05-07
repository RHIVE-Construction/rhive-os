---
name: Agentic_UI_Verification
description: Protocol for autonomously verifying UI fidelity and performance using Antigravity browser tools.
---

# Agentic UI Verification

## Overview
Protocols for AI agents to self-verify their UI work, ensuring that "Context Rot" doesn't lead to visual regressions or performance bottlenecks.

## Verification Protocols
1. **Visual Fidelity Audit**:
   - Take screenshots of newly created components.
   - Compare against the approved implementation plan and design tokens.
2. **Animation Performance Check**:
   - Use browser tools to monitor FPS during scrollytelling or particle animations.
   - Identify JANK or frame-drops in the console.
3. **Cross-Viewport Testing**:
   - Verify layout integrity across mobile, tablet, and desktop breakpoints.
   - Check SVG alignment on chamfered cards during resizing.

## Remediation Flow
- If verification fails: Re-analyze the CSS variables and SVG coordinates.
- Update the component logic to address specific failures.
- Re-run the verification suite.
