# Orchestration Plan - Litigation Analysis

## Objectives
Execute the requirements of the original user request:
1. R1: Email Transcription of 2026 emails from Caysi Guinn to Michael Robinson.
2. R2: Text message extraction (recent, group chat).
3. R3: Court Document Camera Phone Clause Analysis (Braylen Robinson's phone camera).
4. R4: Case & Communication Evaluation.

## Phase 1: Exploration and Requirements Analysis
- **Step 1.1**: Dispatch `teamwork_preview_explorer` to scan the workspace (`c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA`) and locate the raw input data (e.g., email archives, local database, court filings, messages cache).
- **Step 1.2**: Read the explorer's handoff to identify files containing emails, text messages, and court documents.
- **Step 1.3**: Create and finalize `PROJECT.md` outlining the architecture, code/report locations, and milestones.

## Phase 2: Extraction and Analysis (Milestones)
- **Milestone 1: Email Transcription (R1)**
  - Dispatch a Worker to process 2026 emails from Caysi to Michael, sorting them chronologically and transcribing them cleanly.
- **Milestone 2: SMS & Group Chat Extraction (R2)**
  - Dispatch a Worker to process and format the SMS and group chat logs, ensuring structure (timestamp, sender, recipient, body) is preserved.
- **Milestone 3: Court Order Stipulations (R3)**
  - Dispatch a Worker to parse court filings/documents for camera phone rules, mapping specific pages/clauses to requirements.
- **Milestone 4: Evaluation Summary Report (R4)**
  - Dispatch a Worker to synthesize the communication thread and court rules into a cohesive litigation state assessment.

## Phase 3: Verification and Auditing
- Dispatch Reviewers (`teamwork_preview_reviewer`) to confirm the accuracy and quality of transcripts and summaries.
- Run Forensic Auditor (`teamwork_preview_auditor`) to ensure all data is genuine, complete, and free of placeholder text.

## Phase 4: Final Reporting
- Synthesize all deliverables into a final handoff report in the orchestrator directory.
- Notify the Project Sentinel (the caller/parent agent).
