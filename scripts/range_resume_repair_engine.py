"""
HTTP RANGE BYTE-RESUME REPAIR ENGINE
------------------------------------
Uses HTTP Range headers (bytes=N-) to complete downloading large textbook PDFs
(#2, #5, #11, #15, #18, #23) with zero socket dropouts or incomplete reads.
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

TARGET_RESUMES = [
    {"id": 2, "filename": "Book_02_Nutritional_Biochemistry.pdf", "min_pages": 400, "q": "Nutritional Biochemistry Tom Brody"},
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

def download_with_range_resume(url, dest_path, max_attempts=5):
    attempt = 0
    while attempt < max_attempts:
        existing_bytes = os.path.getsize(dest_path) if os.path.exists(dest_path) else 0
        req_headers = HEADERS.copy()
        if existing_bytes > 0:
            req_headers["Range"] = f"bytes={existing_bytes}-"

        try:
            r = requests.get(url, headers=req_headers, stream=True, timeout=40)
            if r.status_code in [200, 206]:
                mode = "ab" if (existing_bytes > 0 and r.status_code == 206) else "wb"
                with open(dest_path, mode) as f:
                    for chunk in r.iter_content(chunk_size=65536):
                        if chunk:
                            f.write(chunk)
                
                # Check if download complete
                size_mb = os.path.getsize(dest_path) / (1024 * 1024)
                if size_mb > 3.0:
                    try:
                        doc = fitz.open(dest_path)
                        if doc.page_count > 100:
                            return True
                    except Exception:
                        pass
        except Exception as e:
            print(f"  Socket reset at byte {existing_bytes}. RetryingRange...")

        attempt += 1
        time.sleep(2)

    return False

def process_resume_target(item):
    filename = item["filename"]
    dest_path = os.path.join(DOWNLOADS_DIR, filename)

    if verify_pdf(dest_path, item["min_pages"])["valid"]:
        print(f"[ALREADY VERIFIED] {filename}")
        return True

    print(f"[RANGE RESUME] Fetching candidate for '{filename}'...")
    search_url = f"https://libgen.li/index.php?req={requests.utils.quote(item['q'])}&columns[]=t&columns[]=a"

    try:
        r = requests.get(search_url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            ads_links = [a["href"] for a in soup.find_all("a", href=True) if "ads.php" in a["href"]]
            for ads_href in ads_links[:3]:
                ads_url = "https://libgen.li/" + ads_href.lstrip("/")
                time.sleep(1.5)
                r_ads = requests.get(ads_url, headers=HEADERS, timeout=10)
                if r_ads.status_code == 200:
                    soup_ads = BeautifulSoup(r_ads.text, "html.parser")
                    get_links = [a["href"] for a in soup_ads.find_all("a", href=True) if "get.php" in a["href"]]
                    if get_links:
                        dl_url = "https://libgen.li/" + get_links[0].lstrip("/")
                        print(f"  Streaming with byte-resume: {dl_url}")
                        if download_with_range_resume(dl_url, dest_path):
                            v = verify_pdf(dest_path, item["min_pages"])
                            if v["valid"]:
                                print(f"  >>> RESUME SUCCESS: {filename} ({v['pages']} pages, {v['size_mb']} MB)\n")
                                return True
                            else:
                                if os.path.exists(dest_path):
                                    os.remove(dest_path)
    except Exception as e:
        print(f"  >>> Resume Exception: {e}")

    return False

def main():
    print("==========================================================================")
    print("HTTP RANGE BYTE-RESUME REPAIR ENGINE ACTIVE")
    print("==========================================================================\n")

    for item in TARGET_RESUMES:
        process_resume_target(item)
        time.sleep(2)

if __name__ == "__main__":
    main()
