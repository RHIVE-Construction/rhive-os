import os
import re

folders_to_scan = ["components", "pages"]
extensions_to_scan = (".tsx", ".html")

img_tag_regex = re.compile(r'<img\b[^>]*>', re.IGNORECASE)

missing_audit = []

for folder in folders_to_scan:
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.endswith(extensions_to_scan):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                matches = img_tag_regex.findall(content)
                for match in matches:
                    # Skip if it is a simple icon or logo style mapping or remote user avatar, 
                    # but check standard content images
                    if "currentUser.avatarUrl" in match or "review.profilePhotoUrl" in match or "user.avatar" in match:
                        continue
                    
                    has_width = "width=" in match or "width={" in match
                    has_height = "height=" in match or "height={" in match
                    has_loading = "loading=" in match
                    has_decoding = "decoding=" in match
                    
                    # If this is a homepage hero or top banner, loading="lazy" is not required
                    # but width/height and decoding are
                    needs_audit = not (has_width and has_height and has_loading and has_decoding)
                    if needs_audit:
                        missing_audit.append((file_path, match, has_width, has_height, has_loading, has_decoding))

print(f"Audit found {len(missing_audit)} img tags needing checks:")
for file, tag, w, h, l, d in missing_audit:
    status = []
    if not w: status.append("width")
    if not h: status.append("height")
    if not l: status.append("loading")
    if not d: status.append("decoding")
    print(f"- {file}:\n    Tag: {tag}\n    Missing: {', '.join(status)}")
