import sys

sys.stdout.reconfigure(encoding='utf-8')

def search_phone_records():
    path = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\written_records\caysi_phone_records.txt"
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    terms = ["orientation", "5/25", "courtesy", "April 1", "June 2"]
    for t in terms:
        print(f"Searching for '{t}':")
        matches = [line.strip() for line in content.split('\n') if t.lower() in line.lower()]
        for m in matches[:5]:
            print(f"  {m}")
        print(f"Total matches: {len(matches)}\n")

if __name__ == "__main__":
    search_phone_records()
