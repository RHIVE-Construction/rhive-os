---
description: safely push code while preserving local references
---
1.  **Shield Reference Data**: Un-comment `REFERENCES/` in `.gitignore` to ensure proprietary data is NOT pushed.
2.  **Verify Shield**: Run `git check-ignore REFERENCES/*` to confirm.
// turbo
3.  **Safe Commit**: `git add .gitignore && git commit -m "chore: shield references for push"`
4.  **Execute Push**: `git push`
5.  **Restore Context**: Comment out `REFERENCES/` in `.gitignore` to re-enable AI indexing and `@` mentions.
6.  Inform the user that the push was successful and context has been restored for development.
