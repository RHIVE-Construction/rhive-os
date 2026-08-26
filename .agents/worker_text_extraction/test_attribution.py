import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Import functions from generate_report
from generate_report import attribute_sender, map_relative_date

def test():
    with open("texts_2026.txt", "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    current_header = "Late March/Early April 2026 (Approximate)"
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        m_header = re.match(r'Line \d+:\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Oct|Nov|Dec|\d+:\d+).*', line)
        if m_header:
            parts = line.split(":", 1)
            header_text = parts[1].strip()
            if '·' in header_text or re.search(r'\d+:\d+', header_text):
                current_header = header_text
                print(f"HEADER: {header_text} -> {map_relative_date(header_text)}")
                continue
                
        parts = line.split(":", 1)
        content = parts[1].strip() if len(parts) > 1 else line
        sender = attribute_sender(content)
        print(f"  {sender}: {content[:80]}...")

if __name__ == "__main__":
    test()
