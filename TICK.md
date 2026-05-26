---
# THE SWARM STATE MACHINE — [STATE: ACTIVE]
SYSTEM_STATE: ACTIVE
# Tags: [TODO] -> [WIP] -> [QA] -> [DONE]
# SYNTAX DIRECTIVE: Max 10 words per entry. Use brackets [Nx]. Drop articles.
# DIRECTIVES:
#   DB_STRATEGY: postgres_retry_locking
#   WORKSPACE_MODE: share
#   DAILY_LIMIT: $10 (Development Mode)
#   STANDBY_PROTOCOL: absolute_idle_no_polling
#   ARCHIVE: 1200+ tasks. Git log is source of truth.
#   NEXT_AGENT: N1, N2, N3, N4, N5, N6
backlog:
  - "[N2] QUOTE_SPEC: Write Beta Template input schema JSON. QA_EXIT:0."
  - "[N2] EMAIL_BID: Build email bid automation scraper. QA_EXIT:0."
  - "[N3] REPO_AUDIT: Compare old/current RHIVE OS branches. QA_EXIT:0."
  - "[N2] TEAM_SYNC: Transcribe recorded Same Page Meetings. QA_EXIT:0."
  - "[N9] CALENDAR_OPT: Restructure calendars for Martell color-blocks. QA_EXIT:0."
todo:
in-progress:
review:
done:
  - "[N1] CRM_SIDEBAR: Group 11 CRM stages in collapsible menu. QA_EXIT:0."
  - "[N1] REPO_MOVE: Relocated repo to requested location. QA_EXIT:0."
  - "[N1] CRM_MAPPING: Map required info in 11 stages. QA_EXIT:0."
  - "[COS] TACTICAL_ROADMAP: Prioritized and documented 9 strategic tasks. QA_EXIT:0."
  - "[N5] RECORDINGS_VAULT: Integrated Recordings Vault UI, fixed IndexedDB ready crash. QA_EXIT:0."
  - "[N1] SWARM_SWITCHER: Built agent switcher modal (Option B), updated main.py routing. QA_EXIT:0."
  - "[N2] CHRONO_CLEANUP: Optimize SQLite session state pruning intervals. QA_EXIT:0."
  - "[N1] BRANDING_POLISH: Ensure instructions modal matches Tech-Noir borders. QA_EXIT:0."
  - "[N4] CLOUD_RUN_DEPLOY: Deploy main.py with Fork & Prompt. QA_EXIT:0."
  - "[N2] GWS_SCOPE_FALLBACK: Dynamically loaded scopes and added fallback retry on credentials refresh. QA_EXIT:0."
  - "[N5] RPA_SELECTOR_ALIGNMENT: Aligned RPA test selectors with collapsed controls toolbar. QA_EXIT:0."
  - "[COS] SWARM_RULES: Integrated Fork & Prompt and Deconstructive Routing into rules. QA_EXIT:0."
  - "[N5B] VISUAL_VERIFY_FIX: Standardized selectors to support Consolidated AI Panel layout. QA_EXIT:0."
  - "[N2] TEST_POLLUTION_FIX: Loaded .env prior to test-key defaults in test_brain_api.py. QA_EXIT:0."
  - "[N1] CLIENT_RECORDING_FIX: Resolved .mp4 container extension and added live agent viewing badge. QA_EXIT:0."
  - "[N1] AGENT_INSTRUCTIONS: Added instructions override button/modal. QA_EXIT:0."
  - "[N2] PERSISTENT_MEMORY: Indexed history and injected into system. QA_EXIT:0."
  - "[N1] MULTIMODAL_VIDEO: Added video chat upload support. QA_EXIT:0."
  - "[N1] RPA_ADVANCED_FIX: Adjusted Puppeteer viewports and passed test suite. QA_EXIT:0."
  - "[N1] FIREBASE_REWRITES: Added /live-stream and /ws/stream rewrites. QA_EXIT:0."
  - "[N1] ENV_PRODUCTION: Created .env.production overriding VITE_API_URL on build. QA_EXIT:0."
  - "[N1] FIREBASE_DEPLOY: Deployed production frontend build to staging hosting. QA_EXIT:0."
  - "[COS] TICK_ARCHIVE: Triaged TICK.md and archived 40 done items. QA_EXIT:0."
  - "[N2] CRM_SYNC_TUPLE: Wrapped SQLite insertion parameters in single tuple. QA_EXIT:0."
  - "[N1] LIVE_RECONNECT_CLEANUP: Explicitly cleared retry timer on session stop. QA_EXIT:0."
  - "[N1] MULTI_STREAM_STITCH: Combined camera/monitor feeds onto client layout canvas. QA_EXIT:0."
  - "[N1] CHAT_MEDIA_CONTROLS: Added file, video, screen share toggles to chat. QA_EXIT:0."
  - "[N2] PRE_HOOK_LATENCY: Concurrently fetched pre-hooks using asyncio gather. QA_EXIT:0."

### [TRACER-N1-01] Frontend Menu and Chat Refactor
- [x] **Assignee:** Node 1
- [x] **Target Files:**
  - `src/App.jsx`(file:///c:/Users/mjrob/OneDrive/Desktop/App Repo s/MJR_EPA/src/App.jsx#L2000-L2368)
  - `src/components/OmniLayout.jsx`(file:///c:/Users/mjrob/OneDrive/Desktop/App Repo s/MJR_EPA/src/components/OmniLayout.jsx#L1-L182)
  - `src/components/OmniChats.jsx`(file:///c:/Users/mjrob/OneDrive/Desktop/App Repo s/MJR_EPA/src/components/OmniChats.jsx#L340-L540)
- [x] **Tracer Specifications:**
  - Target Lines: L2000-2368 in `App.jsx`, L1-182 in `OmniLayout.jsx`, L340-540 in `OmniChats.jsx`
  - Logic Requirement: Connect `onNavItemClick` and `onNavClick` in `App.jsx` and `OmniLayout.jsx`. Refactor `OmniLayout.jsx` styling to Tech-Noir pink and gold. Minimize `OmniChats.jsx` to a floating circle.
- [x] **Verification:**
  - Test command: `npm run build`
  - Expected Output: Build succeeds with 0 errors.

