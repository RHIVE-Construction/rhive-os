import pandas as pd
import json

def find_items():
    try:
        df = pd.read_excel('RHIVE QOS DATA.xlsx', sheet_name='service items')
        keywords = [
            "ROOFLINE VEGETATION", "SUN TUNNEL", "SKYLIGHT", 
            "COPING CAP", "SOLAR PANEL", "ELECTRICAL DISCONNECT"
        ]
        
        results = []
        for index, row in df.iterrows():
            row_str = str(row.values).upper()
            if any(key in row_str for key in keywords):
                results.append(row.to_dict())
        
        with open('found_items.json', 'w') as f:
            json.dump(results, f, indent=4)
        print(f"Found {len(results)} items. Saved to found_items.json")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_items()
