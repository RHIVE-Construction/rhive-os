---
name: Optimize My Route
description: Automates calendar inspection retrieval, TSP distance & time optimization, interactive map generation, and one-click Google Chat dispatching with 100x token efficiency.
---

# Optimize My Route Protocol

## Conversational Triggers
Activate whenever the user says:
- "optimize my route"
- "route my calendar appointments today"
- "plan my day's driving route"
- "what is the best order for my inspections today"

## Standard Operating Procedure (4-Step Gate)

### Step 1: Ingestion & Clarification
Clarify if needed:
- Source: Today's calendar appointments (default) or custom list of addresses.
- Stops to exclude (e.g. "exclude stop 1" or "exclude Preston Plaza").
- Recipient channels (default: Kara & Michael on Work Google Chat / Executive Sync).

### Step 2: Single-Pass Deterministic Execution
Run the route engine in 1 single command (saving ~50,000 tokens of LLM trial-and-error):
```powershell
node "C:\Users\mjrob\.gemini\config\skills\optimize-my-route\scripts\route_engine.js" --date=today
```

*(If excluding stops, pass `--exclude=1` or `--exclude=Preston`)*

### Step 3: Present Results & Confirmation Gate
Present:
1. Turn-by-turn stop table with distances, drive times, units, assignees, and manager contacts.
2. Link to the generated local interactive map: `daily_route_map.html`.
3. Clean hyperlinked Google Maps preview.
4. **STRICT APPROVAL GATE:** Display the Google Chat draft and halt for explicit confirmation.

### Step 4: Instant Dispatch
Upon user saying "Approved" or "Send", run:
```powershell
node "C:\Users\mjrob\.gemini\config\skills\optimize-my-route\scripts\route_engine.js" --date=today --dispatch
```
