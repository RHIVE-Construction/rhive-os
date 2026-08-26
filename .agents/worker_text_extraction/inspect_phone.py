import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

path = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\written_records\caysi_phone_records.txt"
print(f"File size: {os.path.getsize(path)} bytes")

with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
print("First 20 lines:")
for l in lines[:20]:
    print(l.strip())

print("\nLast 20 lines:")
for l in lines[-20:]:
    print(l.strip())
