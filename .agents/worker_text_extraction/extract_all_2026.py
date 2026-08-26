import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def extract_2026():
    phone_path = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\written_records\caysi_phone_records.txt"
    texts_path = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\written_records\texts.txt"
    
    print("=== EXTRACTING 2026 FROM caysi_phone_records.txt ===")
    with open(phone_path, 'r', encoding='utf-8', errors='ignore') as f:
        phone_content = f.read()
        
    pattern = r'\[([A-Za-z]+ \d+, 2026) at ([^\]]+)\] ([^:]+): (.*)'
    phone_matches = re.findall(pattern, phone_content)
    
    # We will write these out
    with open("phone_records_2026.txt", "w", encoding="utf-8") as out:
        for m in phone_matches:
            out.write(f"[{m[0]} at {m[1]}] {m[2]}: {m[3]}\n")
            
    print(f"Extracted {len(phone_matches)} messages from caysi_phone_records.txt into phone_records_2026.txt")
    
    # Now let's check texts.txt 2026 messages.
    # The 2026 messages in texts.txt start around line 2268
    print("=== EXTRACTING 2026 FROM texts.txt ===")
    with open(texts_path, 'r', encoding='utf-8', errors='ignore') as f:
        texts_lines = f.readlines()
        
    # Let's write the lines from 2268 to the end to a file
    with open("texts_2026.txt", "w", encoding="utf-8") as out:
        for idx in range(2267, len(texts_lines)):
            out.write(f"Line {idx+1}: {texts_lines[idx]}")
            
    print(f"Extracted lines 2268-{len(texts_lines)} from texts.txt into texts_2026.txt")

if __name__ == "__main__":
    extract_2026()
