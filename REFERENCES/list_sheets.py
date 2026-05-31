import pandas as pd
try:
    xl = pd.ExcelFile('RHIVE QOS DATA.xlsx')
    print(xl.sheet_names)
except Exception as e:
    print(f"Error: {e}")
