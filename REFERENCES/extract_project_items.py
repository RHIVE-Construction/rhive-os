import pandas as pd
import json

try:
    df = pd.read_excel('RHIVE QOS DATA.xlsx', sheet_name='project items')
    # Filter for non-empty items
    df = df.dropna(subset=[df.columns[0]])
    data = []
    
    # Let's inspect the columns
    for index, row in df.iterrows():
        # Keep only relevant string/number values
        row_data = {str(k): str(v) for k, v in row.items() if str(v) != 'nan' and str(v).strip()}
        if row_data:
            data.append(row_data)

    print(json.dumps(data, indent=2))
except Exception as e:
    print(f"Error: {e}")
