import pandas as pd

try:
    df = pd.read_excel('RHIVE QOS DATA.xlsx', sheet_name='project items')
    # Filter empty rows essentially
    df = df.dropna(how='all')
    df.to_csv('project_items.csv', index=False)
    print("Saved to project_items.csv")
except Exception as e:
    print(f"Error: {e}")
