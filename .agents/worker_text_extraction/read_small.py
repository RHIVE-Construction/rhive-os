import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

path = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\written_records\Jun 3 at 10-02 PM.txt"
if os.path.exists(path):
    print(f"File size: {os.path.getsize(path)} bytes")
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        print(f.read()[:1000])
else:
    print("File does not exist")
