import os

directory = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files"
target_word = "kara"

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(('.txt', '.md', '.csv', '.json', '.xml')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    if target_word in content.lower():
                        print(f"Found in: {path} (size: {len(content)} chars)")
            except Exception as e:
                print(f"Error reading {path}: {e}")
