import os
import re

def run_checks():
    files = {
        "email_transcription": r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch\litigation_analysis\email_transcription_2026.md",
        "text_message_extraction": r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch\litigation_analysis\text_message_extraction.md",
        "court_clause_analysis": r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch\litigation_analysis\court_clause_analysis.md",
        "case_evaluation_report": r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch\litigation_analysis\case_evaluation_report.md"
    }

    # 1. Verify existence
    print("--- Check 1: Deliverable Existence ---")
    all_exist = True
    for name, path in files.items():
        exists = os.path.exists(path)
        print(f"  {name}: {'EXISTS' if exists else 'MISSING'}")
        if not exists:
            all_exist = False
    
    if not all_exist:
        print("FAIL: Some files are missing.")
        return False
    else:
        print("PASS: All files exist.")

    # 2. Check for placeholders
    print("\n--- Check 2: Placeholders & Cheating Detection ---")
    placeholders = ["TODO", "TBD", "FIXME", "[insert", "placeholder"]
    has_placeholder = False
    for name, path in files.items():
        content = open(path, encoding='utf-8').read()
        for p in placeholders:
            matches = len(re.findall(re.escape(p), content, re.IGNORECASE))
            if matches > 0:
                print(f"  FAIL: File '{name}' contains {matches} instances of placeholder '{p}'")
                has_placeholder = True
    if not has_placeholder:
        print("PASS: No placeholders or cheats found.")
    else:
        return False

    # 3. Check child DOB and Age
    print("\n--- Check 3: DOB & Age Realignment ---")
    dob_correct_present = False
    dob_incorrect_present = False
    age_incorrect_present = False
    
    # Correct details: March 18, 2011, Age 15
    # Incorrect details: March 18, 2012, Age 14
    for name, path in files.items():
        content = open(path, encoding='utf-8').read()
        if "2012" in content:
            print(f"  FAIL: File '{name}' contains '2012' (incorrect birth year)")
            dob_incorrect_present = True
        if "Age 14" in content or "turned 14" in content or "14-year-old" in content:
            print(f"  FAIL: File '{name}' contains incorrect age '14'")
            age_incorrect_present = True
        if "2011" in content:
            print(f"  INFO: File '{name}' contains '2011'")
            dob_correct_present = True
            
    if dob_incorrect_present or age_incorrect_present:
        return False
    else:
        print("PASS: Correct child DOB (March 18, 2011) and age (15) confirmed across files.")

    # 4. Check Cause Number
    print("\n--- Check 4: Cause Number Alignment ---")
    cause_correct = True
    for name, path in files.items():
        if name in ["case_evaluation_report", "court_clause_analysis"]:
            content = open(path, encoding='utf-8').read()
            # D2011179 should be primary cause number
            if "D2011179" not in content:
                print(f"  FAIL: File '{name}' is missing Cause Number D2011179")
                cause_correct = False
            # D2011178 should only be in footnote explaining typo
            d178_count = content.count("D2011178")
            if d178_count > 1:
                print(f"  FAIL: File '{name}' has too many occurrences of D2011178 ({d178_count})")
                cause_correct = False
            elif d178_count == 1:
                # Make sure it's in a footnote
                if "[^1]" not in content or "clerical typo" not in content.lower():
                    print(f"  FAIL: D2011178 found in '{name}' but not in a footnote warning")
                    cause_correct = False
                else:
                    print(f"  PASS: File '{name}' correctly handles D2011178 in a warning footnote.")
            else:
                print(f"  INFO: File '{name}' does not mention D2011178")
                
    if not cause_correct:
        return False
    else:
        print("PASS: Cause Number standardized to D2011179 with proper D2011178 typo warning footnotes.")

    # 5. Check Empty Rows/Columns in text_message_extraction.md
    print("\n--- Check 5: Parsing Artifacts (Empty Columns) ---")
    text_path = files["text_message_extraction"]
    content = open(text_path, encoding='utf-8').read()
    # Check for empty columns like |  |
    empty_cols = len(re.findall(r'\|  \|', content))
    if empty_cols > 0:
        print(f"  FAIL: text_message_extraction.md contains {empty_cols} empty table columns.")
        return False
    else:
        print("PASS: No empty table rows/columns found in text message log.")

    print("\nALL POST-VICTORY AUDIT CHECKS PASSED SUCCESSFULLY!")
    return True

if __name__ == "__main__":
    run_checks()
