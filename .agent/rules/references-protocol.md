# REFERENCES PROTECTION PROTOCOL (AUTO-TRIGGER)

## 1. PHILSOPHY
The `REFERENCES/` directory contains high-density proprietary data (Master Protocols, Excel Data, Project Specs) that are essential for AI context but must NOT be leaked to public repositories.

## 2. THE "AIR-GAP" RULE
All agents must adhere to the following sequence when performing Git operations:

### A. COMMIT / PUSH INITIATION (OUT-PROTOCOL)
Before executing any `git add`, `git commit`, or `git push`:
1.  **Check `.gitignore`**: Ensure `REFERENCES/` is active (NOT commented out).
2.  **Shield Step**: If commented out, you MUST re-enable the ignore:
    ```gitignore
    # REFERENCES/  ->  REFERENCES/
    ```
3.  **Execute Git Command**: Proceed with the push.

### B. POST-PUSH / BUILD (IN-PROTOCOL)
After a successful push:
1.  **Context Restore**: Comment out `REFERENCES/` in `.gitignore` to allow the Antigravity system to index the files for AI referencing.
    ```gitignore
    REFERENCES/  ->  # REFERENCES/
    ```

## 3. MANUAL OVERRIDE
If a user asks to "reference" a file and it is "not found," check `.gitignore` first. The system requires the folder to be UN-IGNORED in `.gitignore` to populate the `@` mention dropdown.

## 4. MASTER CLOUD DATA SOURCES (QOS SPREADSHEET & DOCS)
All agents and AI subagents must refer directly to the live cloud Google Sheets and Google Docs:
- **Master QOS Data Sheet:** [RHIVE QOS DATA (Services Database)](https://docs.google.com/spreadsheets/d/1QJkLf5uGr_gNb0KWCsfwnk5IyP0vtZdQnhZFLv901Aw/edit?gid=1789021942#gid=1789021942) (`1QJkLf5uGr_gNb0KWCsfwnk5IyP0vtZdQnhZFLv901Aw` / GID `1789021942`).
- **Master Project Descriptions Doc:** [Project Item Descriptions (Google Docs)](https://docs.google.com/document/d/1c_Nkwt2CEStnA9ZurGU1VdxtOGRJMwbNNdFKAX4ja0w/edit?tab=t.0) (`1c_Nkwt2CEStnA9ZurGU1VdxtOGRJMwbNNdFKAX4ja0w`).
- Local `.xlsx` files in `REFERENCES/` are permanently deprecated in favor of direct cloud API synchronization.

