import pandas as pd
import json

try:
    df = pd.read_excel('REFERENCES/RHIVE QOS DATA.xlsx', sheet_name='service items')
    
    # Filter for maintenance items
    maintenance_items = df[df.apply(lambda row: row.astype(str).str.contains('Maintenance', case=False).any(), axis=1)]
    
    results = []
    for _, row in maintenance_items.iterrows():
        results.append(row.dropna().to_dict())
        
    print(json.dumps(results, indent=2))
except Exception as e:
    print(f"Error: {e}")
