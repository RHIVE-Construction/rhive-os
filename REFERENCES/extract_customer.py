import pandas as pd
file_path = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\RHIVE-OS-1.0\REFERENCES\RHIVE QOS DATA.xlsx"
df = pd.read_excel(file_path, sheet_name='App Pages')
cols = ['Page Name', 'Page ID', 'Description / Purpose', 'Key Features / Elements (Multi-Depth)']
customer_pages = df[df['User Type'].astype(str).str.contains('(?i)customer') | df['Page Name'].astype(str).str.contains('(?i)customer')][cols]
with open(r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\RHIVE-OS-1.0\REFERENCES\customer_pages.txt", "w", encoding="utf-8") as f:
    f.write(customer_pages.to_string())
