import os
from PIL import Image

def optimize_folder(folder_path):
    for root, dirs, files in os.walk(folder_path):
        # Skip estimate-proofs or already optimized files
        if "estimate-proofs" in root:
            continue
            
        for file in files:
            if file.lower().endswith(".png"):
                src_path = os.path.join(root, file)
                # Exclude systems/logos from being renamed if they are small/third party, 
                # but let's optimize anything that is over 50KB.
                size_kb = os.path.getsize(src_path) / 1024
                if size_kb < 10:
                    continue
                
                dest_path = os.path.splitext(src_path)[0] + ".webp"
                
                # Check if WebP already exists
                if os.path.exists(dest_path):
                    print(f"WebP already exists: {dest_path}")
                    continue
                
                print(f"Optimizing {src_path} ({size_kb:.2f} KB) -> {dest_path}...")
                img = Image.open(src_path)
                
                # If too large, resize to max width of 1920
                if img.width > 1920:
                    ratio = 1920 / float(img.width)
                    new_height = int(float(img.height) * ratio)
                    img = img.resize((1920, new_height), Image.Resampling.LANCZOS)
                
                quality = 85
                while quality > 10:
                    img.save(dest_path, "webp", quality=quality, optimize=True)
                    dest_size = os.path.getsize(dest_path) / 1024
                    if dest_size <= 200:
                        break
                    quality -= 5
                print(f"  Saved {dest_path} at size: {os.path.getsize(dest_path) / 1024:.2f} KB")

optimize_folder("public")
print("All png files optimized.")
