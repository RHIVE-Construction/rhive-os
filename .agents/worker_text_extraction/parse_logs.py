import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def inspect_one_by_one():
    directory = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\written_records"
    
    for f_name in ["2026_Abuse_Timeline.txt", "2026_Choking_Detail.txt", "2026_Move_Talk.txt"]:
        path = os.path.join(directory, f_name)
        print(f"--- START OF {f_name} ---")
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            print(f.read())
        print(f"--- END OF {f_name} ---\n")

if __name__ == "__main__":
    inspect_one_by_one()
