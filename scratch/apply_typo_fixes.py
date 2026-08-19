import os
import re

files_to_fix = [
    "pages/ResidentialReplacementServicePage.tsx",
    "pages/CommercialFlatRoofingServicePage.tsx",
    "pages/RoofingAccessoriesPage.tsx",
    "pages/ZeroSurprisesPricingPage.tsx",
    "pages/SandyServiceAreaPage.tsx",
    "pages/WestJordanServiceAreaPage.tsx",
    "pages/SaltLakeCityServiceAreaPage.tsx"
]

for file_path in files_to_fix:
    if not os.path.exists(file_path):
        print(f"Skipping missing: {file_path}")
        continue
        
    print(f"Processing typography updates in: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Update text-sm paragraphs to text-base
    content = content.replace('text-sm font-serif leading-relaxed', 'text-base font-serif leading-relaxed')
    content = content.replace('text-sm text-gray-400 font-serif', 'text-base text-gray-400 font-serif')
    content = content.replace('text-sm text-gray-300 font-serif', 'text-base text-gray-300 font-serif')
    content = content.replace('text-sm text-gray-300 font-sans', 'text-base text-gray-300 font-sans')
    content = content.replace('text-sm text-gray-400 font-sans', 'text-base text-gray-400 font-sans')
    content = content.replace('text-gray-400 text-sm font-serif', 'text-gray-400 text-base font-serif')
    content = content.replace('text-gray-400 text-sm leading-relaxed', 'text-gray-400 text-base leading-relaxed')
    content = content.replace('text-sm text-gray-400 mt-2 font-serif', 'text-base text-gray-400 mt-2 font-serif')
    content = content.replace('text-sm text-gray-400 leading-relaxed', 'text-base text-gray-400 leading-relaxed')
    
    # 2. Update list font sizes
    content = content.replace('text-sm text-gray-400 font-serif', 'text-base text-gray-400 font-serif')
    content = content.replace('text-sm text-gray-400 font-mono', 'text-base text-gray-400 font-mono')
    content = content.replace('text-sm text-gray-300 font-serif', 'text-base text-gray-300 font-serif')
    content = content.replace('text-sm text-gray-400', 'text-base text-gray-400')
    content = content.replace('text-sm text-gray-300', 'text-base text-gray-300')
    
    # 3. Update buttons from text-sm to text-base (16px) to prevent zoom on mobile
    content = content.replace('text-sm uppercase tracking-widest px-8 py-4', 'text-base uppercase tracking-widest px-8 py-4')
    content = content.replace('text-sm font-bold uppercase tracking-widest', 'text-base font-bold uppercase tracking-widest')
    
    # 4. Limit line length of hero paragraphs to 75 characters (max-w-[75ch])
    content = content.replace('max-w-3xl mx-auto mb-10 leading-relaxed font-serif', 'max-w-[75ch] mx-auto mb-10 leading-relaxed font-serif')
    content = content.replace('max-w-3xl mx-auto mb-8 leading-relaxed font-serif', 'max-w-[75ch] mx-auto mb-8 leading-relaxed font-serif')
    content = content.replace('max-w-3xl mx-auto leading-relaxed font-serif', 'max-w-[75ch] mx-auto leading-relaxed font-serif')
    
    # Let's also verify input elements if there are any (e.g. estimate inputs or CTAs)
    # Ensure they are at least text-base (16px)
    content = content.replace('className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-rhive-pink"',
                              'className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-base text-white focus:outline-none focus:border-rhive-pink"')
    
    # Write back
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Typography updates complete.")
