import os
import re

# Find all webp files in public directory to identify what was converted
webp_files = []
for root, dirs, files in os.walk("public"):
    for file in files:
        if file.lower().endswith(".webp"):
            # Get relative path from public/ (e.g. "components/coping_cap_1773773544079.webp")
            rel_path = os.path.relpath(os.path.join(root, file), "public").replace("\\", "/")
            # Also keep base name without extension
            base_name = os.path.splitext(file)[0]
            webp_files.append((rel_path, base_name))

print(f"Found {len(webp_files)} converted webp assets.")

# We will scan tsx, ts, and html files in components/, pages/, data/, and the root folder
folders_to_scan = ["components", "pages", "data", "."]
extensions_to_scan = (".tsx", ".ts", ".html")

replaced_count = 0

for folder in folders_to_scan:
    for root, dirs, files in os.walk(folder):
        if "node_modules" in root or "dist" in root or ".git" in root:
            continue
        for file in files:
            if file.endswith(extensions_to_scan):
                file_path = os.path.join(root, file)
                
                # Read content
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                original_content = content
                
                # Replace local png references with webp
                for rel_path, base_name in webp_files:
                    # Target both relative/absolute paths: e.g. "/components/real_skylight_1773772893598.png" 
                    # and "components/real_skylight_1773772893598.png"
                    png_pattern_1 = f"/{base_name}.png"
                    webp_replacement_1 = f"/{base_name}.webp"
                    content = content.replace(png_pattern_1, webp_replacement_1)
                    
                    png_pattern_2 = f'"{base_name}.png"'
                    webp_replacement_2 = f'"{base_name}.webp"'
                    content = content.replace(png_pattern_2, webp_replacement_2)

                    png_pattern_3 = f"'{base_name}.png'"
                    webp_replacement_3 = f"'{base_name}.webp'"
                    content = content.replace(png_pattern_3, webp_replacement_3)

                if content != original_content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"Updated references in: {file_path}")
                    replaced_count += 1

print(f"Successfully updated references in {replaced_count} files.")
