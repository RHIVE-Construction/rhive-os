import pandas as pd
import sys

url = "https://docs.google.com/spreadsheets/d/1QJkLf5uGr_gNb0KWCsfwnk5IyP0vtZdQnhZFLv901Aw/export?format=csv&gid=2127205270"

try:
    df = pd.read_csv(url)
    print("SUCCESS: Downloaded Google Sheet")
    print(df.head(10).to_string())
    df.to_csv("current_plan.csv", index=False)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
