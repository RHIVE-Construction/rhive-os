# CONTINUOUS LEARNING, PRE-PROJECT OPTIMIZATION & TELEMETRY PROTOCOL

**Directive:** Frontload Knowledge & Quantify Operational ROI On Every Task  
**Applies To:** All Nodes, Subagents, and Project Lifecycles

---

## 1. PRE-PROJECT FRONTLOADING PROTOCOL (Learn & Optimize Before Execution)

Before executing ANY new task, feature, or RPA workflow, the agent **MUST** perform the Pre-Project Checklist:

1. **Query Cached Knowledge & Rules:**
   - Check existing modular scripts in `scripts/rpa/` before writing new code.
   - Reuse verified headless launch harnesses (`launchHeadlessRPA` with `--headless=new`).
   - Read specific targeted files instead of scanning massive directory trees to minimize token burn.
2. **Select Lowest-Latency / Lowest-Token Path:**
   - Direct API / Webhook > Targeted Headless Script > Full Browser Session.
   - Never run exploratory DOM scraping when structured endpoints or targeted selectors are known.
3. **Pre-Flight Validation:**
   - Pre-check environment variables, persistent profile paths (`scratch/rpa_headless_profile`), and credentials.

---

## 2. POST-PROJECT TELEMETRY PROTOCOL (Quantify ROI & Token Gains)

Upon completing any milestone or task, the agent **MUST** measure and publish the **Performance & Token Optimization Telemetry**:

1. **Telemetry Metrics Required:**
   - **Execution Latency:** Time taken (target: <5 seconds).
   - **Token Consumption:** Actual tokens burned vs unoptimized baseline.
   - **Token Reduction / ROI Multiplier:** Percentage reduction and dollar cost savings.
   - **GUI Interruption Rating:** 100% Non-Intrusive (Off-screen virtual framebuffer).
2. **Musk 5-Step / Leverage Audit:**
   - Record what steps were deleted, simplified, or automated.
   - Persist newly discovered patterns so subsequent runs are 10x faster.
