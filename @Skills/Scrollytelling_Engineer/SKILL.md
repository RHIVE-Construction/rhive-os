---
name: Scrollytelling_Engineer
description: Advanced skill for orchestrating cinematic, scroll-based animations using high-performance image sequences.
---

# Scrollytelling Engineer

## Overview
This skill focuses on creating high-end product launch experiences using scroll-triggered animations. Instead of complex 3D rendering in the browser, we use optimized image sequences (JPEG/WebP) to provide a lag-free cinematic experience.

## Core Techniques
1. **Image Sequence Management**: Convert video assets (from Google Flow) into optimized frame-by-frame image sequences.
2. **Scroll Trigger Logic**: Use libraries like GSAP or Intersection Observer to map scroll progress to frame indices.
3. **Performance Optimization**:
   - Implement intelligent preloading of frame sequences.
   - Use Canvas-based rendering for high-frequency frame updates.
   - Handle resize events to maintain aspect ratio and visual fidelity.

## Workflow Integration
- **Asset Input**: Google Flow (Video) -> Online Converter -> Image Sequence.
- **Antigravity Prompting**: "Build a scrollytelling section using the image sequence in `/assets/hero-sequence`. Map scroll to frame index 0-120."

## Verification
- Test scroll smoothness in the Antigravity browser tool.
- Verify mobile responsiveness and memory usage.
