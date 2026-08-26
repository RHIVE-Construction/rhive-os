# Handoff Report: Case Data and Litigation Document Cataloging

**Summary:** This report provides a comprehensive directory and catalog of raw input files, email/SMS transcripts, and court documents identified across the `MJR_EPA` workspace. It documents their absolute paths, content types, and descriptions to support ongoing custody sandboxing and telemetry integration.

---

## 1. Observation

The following files and structures were directly observed and verified in the workspace:

### Category A: Core Metadata and State Files
1.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\config\local_brain_data.json`  
    *   **Type of Content:** JSON Database Mapping  
    *   **Description:** Contains graph nodes and edges representing the custody/divorce database partition. Specifically defines metadata for ExSpouses (Caysi Guinn under `node_ex_caysi`, Whitney Robinson under `node_ex_whitney`), Children (Braylin Robinson under `node_child_braylin`, Clark and Skarlett under `node_child_clark`/`node_child_skarlett`), and Shared Drives.
2.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\.agents\GLOBAL_STATE_CURRENT.md`  
    *   **Type of Content:** Markdown (Litigation & Swarm Telemetry State)  
    *   **Description:** Tracks the active litigation state. Highlights Braylin's SLC-to-DFW return flight on June 23, 2026, and the signing/notarization of the Petition to Modify v3 on June 25, 2026.
3.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\TICK.md`  
    *   **Type of Content:** Markdown (Swarm Task Ledger)  
    *   **Description:** Defines completed and backlog tasks. Confirms completed steps such as email scraping (`CUSTODY_EMAIL_DISCOVERY`), transcription of journal entries (`JOURNAL_TRANSCRIPTION`), text backup restoration (`HISTORICAL_PHONE_BACKUPS`), and data ingestion (`TEAM_SYNC`).

### Category B: Emails (Caysi Guinn to Michael Robinson - 2026)
1.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\legal_emails_compilation.md` (Duplicate at: `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\caysi_drive\Court Paper Modifications\Recording\Emails\legal_emails_compilation.md`)  
    *   **Type of Content:** Markdown (Email Scraping Archive)  
    *   **Description:** Ingested archive of 361 emails from June 2026 and prior. Specifically contains:
        *   **Email #35 (Line 42):** Sent `Fri, 24 Apr 2026` from `caysi.guinn1@gmail.com` to `mjrob14@gmail.com` (Subject: `Bark`).
        *   **Email #86 (Line 93):** Sent `Mon, 16 Mar 2026` from `caysi.guinn1@gmail.com` to `mjrob14@gmail.com` (Subject: `Braylin eyes`).
        *   **Email #72 (Line 79):** Sent `Tue, 31 Mar 2026` from `mjrob14@gmail.com` to `caysiguinn1@gmail.com` (Subject: `Braylin's Summer Flight Itineraries`).

### Category C: SMS and Conversation Transcripts (Caysi, Michael, Kara - 2026)
1.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\written_records\texts.txt` (Duplicates at: `...\texts_co_parenting.txt` and `...\caysi_drive\AI Prompts Caysi\texts.txt`)  
    *   **Type of Content:** Plain Text (SMS Logs)  
    *   **Description:** Massive chat history between Caysi and Michael Robinson documenting disputes over Braylin's extended summer possession dates (July 12–August 2, 2026), email contact confusion, and court compliance threats.
2.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\written_records\2026_Parent_Dispute.txt` (Duplicate at: `...\caysi_drive\Court Paper Modifications\Recording\02_Utah_Move\2026_Parent_Dispute.txt`)  
    *   **Type of Content:** Plain Text (Audio Transcript)  
    *   **Description:** Transcribed audio recording of a face-to-face conversation between Braylin Robinson (Speaker 1), Michael Robinson (Speaker 2), and Kara Robinson (Speaker 3) detailing parent-child arguments, stepdad Ricky's behavior, and the emotional environment in the Texas home.
3.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\written_records\Apr 1 at 3-32 PM.txt` (Duplicate at: `...\caysi_drive\Court Paper Modifications\Recording\05_Personal_Logs\2026_Braylin_Business_Practice.txt`)  
    *   **Type of Content:** Plain Text (Audio Transcript)  
    *   **Description:** Transcribed conversation between Braylin, Michael, and Kara practicing sales/door-to-door screen repair business pitches to build Braylin's communication skills.
4.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\written_records\2026_OAG_Melinda_Audit.txt` (Duplicate at: `...\caysi_drive\Court Paper Modifications\Recording\04_OAG_Court_Records\2026_OAG_Melinda_Audit.txt`)  
    *   **Type of Content:** Plain Text (Audio Transcript)  
    *   **Description:** Transcribed phone call between Michael Robinson, Kara Robinson, and attorney Melinda Owens, reviewing the enforcement and modification history (e.g., support modification timeline since April 2024).

### Category D: Court Documents & Case Notes
1.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\2022_Custody_and_Visits.pdf` (Text version: `2022_Custody_and_Visits.txt`; Duplicate at: `...\caysi_drive\Court Paper Modifications\Active Rules\2022_Custody_and_Visits.pdf`)  
    *   **Type of Content:** PDF/Text (Court Order)  
    *   **Description:** Custody and visitation order filed in January 2022, governing initial modified parental rights.
2.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\2025_FINAL_Support_and_Contempt_Order.pdf` (Text version: `2025_FINAL_Support_and_Contempt_Order.txt`; Duplicate at: `...\caysi_drive\Court Paper Modifications\Active Rules\2025_FINAL_Support_and_Contempt_Order.pdf`)  
    *   **Type of Content:** PDF/Text (Court Order)  
    *   **Description:** November 14, 2025 Order placing Michael on community supervision (probation) for arrears, adjusting child support to $400/month, and imposing Bark phone rules.
3.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\Petition_to_Modify_v3.pdf` (Alternative version: `Petition to Modify Parent-Child Relationship v2.pdf`)  
    *   **Type of Content:** PDF (Legal Petition)  
    *   **Description:** Active standard petition to modify the parent-child relationship to designate Michael as the primary resident parent.
4.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\Order_in_Suit_to_Modify.txt` (Duplicate at: `...\caysi_drive\Order in Suit to Modify Parent-Child Relationship-filed.txt`)  
    *   **Type of Content:** Plain Text (Court Order Draft/Filing)  
    *   **Description:** Text of the filed order modifying the parent-child relationship.
5.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\braylin_journal_diary_notes.md`  
    *   **Type of Content:** Markdown (Journal Transcription)  
    *   **Description:** Transcription of Braylin's handwritten journal entries from Jan 23, 2026, and Feb 16, 2026, including details of stepdad Ricky physically grabbing her arm (leaving red marks) and pushing her on Nov 26, 2025.
6.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\.agents\knowledge_items\Session_Archive_2026-06-19\documents\court_analysis_report.md`  
    *   **Type of Content:** Markdown (Litigation Analysis Report)  
    *   **Description:** Father's Case Notes & Litigation Analysis (June 18, 2026) outlining physical abuse allegations (strangulation, blackouts), emotional abuse, and Caysi's injunction violations.
7.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\.agents\knowledge_items\Session_Archive_2026-06-19\documents\litigation_packet_to_jonathan.md`  
    *   **Type of Content:** Markdown (Evidentiary/Attorney Communication Packet)  
    *   **Description:** Evidentiary summary compiled on June 18, 2026, for attorney Jonathan Fox, detailing timeline adjustments, draft petition corrections (such as the driver's license state, birth certificate, and split slapping incidents), and child support financial motives.
8.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\caysi_drive\Hearing 8_14_25\Guinn Pretrial Disclosures Oct 17.pdf`  
    *   **Type of Content:** PDF (Pretrial Disclosures)  
    *   **Description:** Legal disclosures submitted by Caysi Guinn's team for the August 2025 hearing.
9.  **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\caysi_drive\Hearing 8_14_25\Sep 4 motion for remote appearance.pdf` (Text version: `sep 4 MOTION FOR REMOTE APPEARANCE.txt`)  
    *   **Type of Content:** PDF/Text (Court Motion)  
    *   **Description:** Motion for remote appearance in court on September 4.
10. **File Path:** `c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\caysi_drive\Hearing Nov 14\ANSWERTOMOTION11.14.pdf`  
    *   **Type of Content:** PDF (Court Answer)  
    *   **Description:** Legal answer filed on November 14, 2025, in response to custody/support motions.

---

## 2. Logic Chain

The step-by-step reasoning linking observations to cataloged resources is as follows:
1.  **Requirement to Locate Core Files:** The request specified locating `local_brain_data.json`, `GLOBAL_STATE_CURRENT.md`, and `TICK.md`. These were successfully found in the `config/`, `.agents/`, and root directories respectively using search and directory-listing tools (Obs. A1, A2, A3).
2.  **Requirement to Locate 2026 Emails:** The request specified emails from Caysi Guinn to Michael Robinson (2026). Checking `scratch_files` revealed `legal_emails_compilation.md`, which explicitly lists 361 compiled emails including specific 2026 messages from Caysi's email (`caysi.guinn1@gmail.com`) to Michael (`mjrob14@gmail.com`) regarding child issues (Obs. B1).
3.  **Requirement to Locate SMS/Group Messages (with Kara):** The request specified SMS or group message logs with Caysi, Michael, and Kara Robinson. 
    *   `texts.txt` compiles SMS logs between Caysi and Michael Robinson regarding co-parenting schedules and conflicts (Obs. C1).
    *   A custom Python scan of `scratch_files` identified several transcript files (`2026_Parent_Dispute.txt`, `2026_Braylin_Business_Practice.txt`, and `2026_OAG_Melinda_Audit.txt`) containing spoken statements from Michael, Braylin, and Kara Robinson (referred to as Speaker 3 or direct name tags) verifying group consultation and joint parenting efforts (Obs. C2, C3, C4).
4.  **Requirement to Locate Court Documents/Filings:** We scanned `scratch_files` and `.agents` directories to locate formal custody agreements (2022 and 2025 Orders), petitions to modify parent-child relationship (v2 and v3 pdfs), and case packets prepared for attorney Jonathan Fox (Obs. D1 through D10).

---

## 3. Caveats

*   **Gitignore Filtering:** Standard workspace searches using ripgrep or file-name lists ignore `scratch/`, `scratch_files/`, and `REFERENCES/` as defined in `.gitignore`. To locate files in these directories, search tools must target these directories directly.
*   **Encrypted Files:** Credentials like `gws_credentials.enc` are encrypted and their plain-text payloads were not inspected.
*   **Duplicate Structures:** Many files inside `scratch_files/written_records/` exist as duplicates under `scratch_files/caysi_drive/Court Paper Modifications/Recording/`. We documented both paths to prevent confusion.
*   **Assumptions on Audio Speakers:** Audio transcripts label speakers numerically (e.g. Speaker 1, 2, 3). Internal context and file names were used to identify Speaker 1 as Braylin, Speaker 2 as Michael, and Speaker 3 as Kara Robinson.

---

## 4. Conclusion

The raw case data, metadata, transcripts, and court filings exist in structured folders within `scratch_files`, `config`, and `.agents`. They contain complete evidentiary logs regarding Braylin's disclosures, Caysi's injunction violations, and the active legal strategy coordinated with Michael's legal team. These files are ready for ingestion or partition sandboxing.

---

## 5. Verification Method

To independently verify the paths and existence of these files, run the following PowerShell commands from the workspace root:

```powershell
# Verify core metadata/state files
Test-Path "config\local_brain_data.json"
Test-Path ".agents\GLOBAL_STATE_CURRENT.md"
Test-Path "TICK.md"

# Verify email compilation
Test-Path "scratch_files\legal_emails_compilation.md"

# Verify text message files
Test-Path "scratch_files\written_records\texts.txt"
Test-Path "scratch_files\written_records\2026_Parent_Dispute.txt"

# Verify court documents
Test-Path "scratch_files\2022_Custody_and_Visits.pdf"
Test-Path "scratch_files\2025_FINAL_Support_and_Contempt_Order.pdf"
Test-Path "scratch_files\braylin_journal_diary_notes.md"
Test-Path ".agents\knowledge_items\Session_Archive_2026-06-19\documents\court_analysis_report.md"
```
These commands will return `True` for each file, proving their presence on the disk.
