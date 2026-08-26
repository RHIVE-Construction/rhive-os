import os

workspace = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA"
for root, dirs, files in os.walk(workspace):
    for d in dirs:
        if "litigation" in d.lower() or "analysis" in d.lower():
            print(f"Dir found: {os.path.join(root, d)}")
    for f in files:
        if "litigation" in f.lower() or "analysis" in f.lower():
            print(f"File found: {os.path.join(root, f)}")
