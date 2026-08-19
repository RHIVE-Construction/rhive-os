import os
from PIL import Image

mapping = {
    "public/commercial-drone.png": "public/images/commercial-tpo-membrane-re-roof-layover-salt-lake-city-utah.webp",
    "public/slc-residential-roof.png": "public/images/residential-shingle-roof-replacement-owens-corning-durations-sandy-ut.webp",
    "public/hero-placeholder.png": "public/images/modern-architectural-roofing-contractor-wasatch-front-utah.webp",
    "public/duration_flex_shingle.png": "public/images/owens-corning-duration-flex-class-4-impact-shingles.webp",
    "public/components/real_seamless_gutter_1773772866806.png": "public/images/seamless-aluminum-rain-gutter-installation-west-jordan-utah.webp"
}

os.makedirs("public/images", exist_ok=True)

for src, dest in mapping.items():
    if not os.path.exists(src):
        print(f"Source file not found: {src}")
        continue
    
    print(f"Optimizing {src} -> {dest}...")
    img = Image.open(src)
    
    # If the image is extremely large, resize it to a maximum width of 1920px to save space
    max_width = 1920
    if img.width > max_width:
        ratio = max_width / float(img.width)
        new_height = int(float(img.height) * ratio)
        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        print(f"  Resized to {max_width}x{new_height}")

    # Optimize and save with progressive quality reductions until size is under 200KB
    quality = 85
    while quality > 10:
        img.save(dest, "webp", quality=quality, optimize=True)
        size_kb = os.path.getsize(dest) / 1024
        print(f"  Quality: {quality}, Size: {size_kb:.2f} KB")
        if size_kb <= 200:
            break
        quality -= 5
    
    print(f"  Final Size: {os.path.getsize(dest) / 1024:.2f} KB (Quality {quality})")
print("Image optimization complete.")
