import pandas as pd

try:
    xls = pd.ExcelFile(r'c:\Users\mjrob\OneDrive\Desktop\App Repo s\RHIVE-OS-1.0\REFERENCES\RHIVE QOS DATA.xlsx')
    sheets_to_extract = ['Warranty', 'website mock', 'OLD preso quote', 'gen roof guide', 'project items']
    out = ""
    for s in xls.sheet_names:
        if s in sheets_to_extract:
            print(f"Extracting {s}")
            try:
                out += f"\n\n--- {s} ---\n"
                out += pd.read_excel(xls, s).to_string()
            except Exception as e:
                out += f"Error extracting {s}: {e}\n"
    with open('ext_clean.txt', 'w', encoding='utf-8') as f:
        f.write(out)
except Exception as e:
    print(e)
