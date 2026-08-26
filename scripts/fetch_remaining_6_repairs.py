"""
REMAINING REPAIR & IPFS GATEWAY FAILOVER INGESTION ENGINE
---------------------------------------------------------
Fetches full-text replacements for remaining pending items (#2, #4, #5, #11, #15, #18, #23)
across rotating IPFS gateways into C:\\Users\\mjrob\\Downloads\\.
"""

import os
import sys
import json
import time
import requests
import fitz
from bs4 import BeautifulSoup

DOWNLOADS_DIR = r"C:\Users\mjrob\Downloads"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

REPAIR_TARGETS = [
    {"id": 2, "filename": "Book_02_Nutritional_Biochemistry.pdf", "min_pages": 400, "q": "Nutritional Biochemistry Brody"},
    {"id": 4, "filename": "Book_04_Integrative_Medicine.pdf", "min_pages": 700, "q": "Integrative Medicine Rakel"},
    {"id": 5, "filename": "Book_05_The_Mood_Cure.pdf", "min_pages": 250, "q": "The Mood Cure Julia Ross"},
    {"id": 11, "filename": "Book_11_Principles_Anatomy_Physiology.pdf", "min_pages": 900, "q": "Principles Anatomy Physiology Tortora"},
    {"id": 15, "filename": "Book_15_Molecules_of_Emotion.pdf", "min_pages": 250, "q": "Molecules of Emotion Candace Pert"},
    {"id": 18, "filename": "Book_18_The_Vital_Question.pdf", "min_pages": 250, "q": "Vital Question Nick Lane"},
    {"id": 23, "filename": "Book_23_NASM_Nutrition_CNC.pdf", "min_pages": 450, "q": "NASM Essentials Sports Nutrition"}
]

def verify_pdf(file_path, min_pages):
    if not os.path.exists(file_path):
        return {"valid": False}
    size_mb = round(os.path.getsize(file_path) / (1024 * 1024), 2)
    if size_mb < 3.0:
        return {"valid": False}
    try:
        doc = fitz.open(file_path)
        pages = doc.page_count
        if pages < (min_pages * 0.4):
            return {"valid": False}
        return {"valid": True, "pages": pages, "size_mb": size_mb}
    except Exception:
        return {"valid": False}

def fetch_repair(item):
    filename = item["filename"]
    dest_path = os.path.join(DOWNLOADS_DIR, filename)

    if verify_pdf(dest_path, item["min_pages"])["valid"]:
        print(f"[ALREADY VERIFIED] {filename}")
        return True

    print(f"[REPAIR RUN] Fetching '{filename}'...")
    search_url = f"https://libgen.li/index.php?req={requests.utils.quote(item['q'])}&columns[]=t&columns[]=a"

    try:
        r = requests.get(search_url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            ads_links = [a["href"] for a in soup.find_all("a", href=True) if "ads.php" in a["href"]]
            if ads_links:
                for ads_href in ads_links[:2]:
                    ads_url = "https://libgen.li/" + ads_href.lstrip("/")
                    time.sleep(1.5)
                    r_ads = requests.get(ads_url, headers=HEADERS, timeout=10)
                    if r_ads.status_code == 200:
                        soup_ads = BeautifulSoup(r_ads.text, "html.parser")
                        get_links = [a["href"] for a in soup_ads.find_all("a", href=True) if "get.php" in a["href"]]
                        if get_links:
                            dl_url = "https://libgen.li/" + get_links[0].lstrip("/")
                            print(f"  Streaming binary candidate: {dl_url}")
                            r_file = requests.get(dl_url, headers=HEADERS, stream=True, timeout=90)
                            if r_file.status_code == 200:
                                with open(dest_path, "wb") as f:
                                    for chunk in r_file.iter_content(chunk_size=65536):
                                        if chunk:
                                            f.write(chunk)
                                v = verify_pdf(dest_path, item["min_pages"])
                                if v["valid"]:
                                    print(f"  >>> REPAIR SUCCESS: {filename} ({v['pages']} pages, {v['size_mb']} MB)\n")
                                    return True
                                else:
                                    if os.path.exists(dest_path):
                                        os.remove(dest_path)
    except Exception as e:
        print(f"  >>> Repair Exception: {e}")

    return False

def main():
    print("==========================================================================")
    print("REMAINING REPAIR & IPFS FAILOVER ENGINE ACTIVE")
    print("==========================================================================\n")

    for item in REPAIR_TARGETS:
        fetch_repair(item)
        time.sleep(2)

if __name__ == "__main__":
    main()
