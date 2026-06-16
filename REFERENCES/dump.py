import pandas as pd
import sys

# Ensure we write proper utf-8
sys.stdout.reconfigure(encoding='utf-8')

xls = pd.ExcelFile(r'c:\Users\mjrob\OneDrive\Desktop\App Repo s\RHIVE-OS-1.0\REFERENCES\RHIVE QOS DATA.xlsx')
output = ''
for s in xls.sheet_names:
    output += f'\n\n### SHEET: {s} ###\n\n'
    try:
        df = pd.read_excel(xls, sheet_name=s)
        output += df.to_csv(index=False)
    except Exception as e:
        output += str(e)

with open(r'c:\Users\mjrob\.gemini\antigravity\brain\ebd3c5c2-e7f1-46c5-91ad-2d8deca0af08\QOS_DATA_DUMP.csv', 'w', encoding='utf-8') as f:
    f.write(output)
