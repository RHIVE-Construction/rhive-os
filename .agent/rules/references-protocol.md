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

## 4. XLXS DATA HANDLING
While `.xlsx` files cannot be read as raw text, agents should seek to mirror key data from `RHIVE QOS DATA.xlsx` into `.json` or `.ts` constants within the `src/` directory for operational use, while keeping the original source in `REFERENCES/`.
