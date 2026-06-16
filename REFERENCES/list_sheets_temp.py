import pandas as pd
try:
    xl = pd.ExcelFile('REFERENCES/RHIVE QOS DATA.xlsx')
    print("Sheets:", xl.sheet_names)
except Exception as e:
    print(f"Error: {e}")
