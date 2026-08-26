"""
TARGETED BYTE RESUMER FOR BOOK 11 (TORTORA ANATOMY) & NASM CNC NUTRITION
-----------------------------------------------------------------------
Resumes Tortora Anatomy from 59.76 MB to 100% completion (90 MB / 1,000+ pages)
and fetches NASM CNC Sports Nutrition directly into C:\\Users\\mjrob\\Downloads\\.
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

TARGETS = [
    {"id": 11, "filename": "Book_11_Principles_Anatomy_Physiology.pdf", "min_pages": 900, "q": "Principles of Anatomy and Physiology Tortora"},
    {"id": 23, "filename": "Book_23_NASM_Nutrition_CNC.pdf", "min_pages": 450, "q": "NASM Essentials of Sports Nutrition"},
    {"id": 5, "filename": "Book_05_The_Mood_Cure.pdf", "min_pages": 250, "q": "The Mood Cure Julia Ross"},
    {"id": 15, "filename": "Book_15_Molecules_of_Emotion.pdf", "min_pages": 250, "q": "Molecules of Emotion Candace Pert"},
    {"id": 18, "filename": "Book_18_The_Vital_Question.pdf", "min_pages": 250, "q": "Vital Question Nick Lane"}
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

def resume_target(item):
    filename = item["filename"]
    dest_path = os.path.join(DOWNLOADS_DIR, filename)

    v = verify_pdf(dest_path, item["min_pages"])
    if v["valid"]:
        print(f"[VERIFIED HEALTHY] {filename} ({v['pages']} pages, {v['size_mb']} MB)")
        return True

    print(f"[RESUME INGESTION] Processing '{filename}'...")
    search_url = f"https://libgen.li/index.php?req={requests.utils.quote(item['q'])}&columns[]=t&columns[]=a"

    try:
        r = requests.get(search_url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            ads_links = [a["href"] for a in soup.find_all("a", href=True) if "ads.php" in a["href"]]
            for ads_href in ads_links[:4]:
                ads_url = "https://libgen.li/" + ads_href.lstrip("/")
                time.sleep(1.5)
                r_ads = requests.get(ads_url, headers=HEADERS, timeout=10)
                if r_ads.status_code == 200:
                    soup_ads = BeautifulSoup(r_ads.text, "html.parser")
                    get_links = [a["href"] for a in soup_ads.find_all("a", href=True) if "get.php" in a["href"]]
                    if get_links:
                        dl_url = "https://libgen.li/" + get_links[0].lstrip("/")

                        attempts = 0
                        while attempts < 5:
                            existing_bytes = os.path.getsize(dest_path) if os.path.exists(dest_path) else 0
                            req_h = HEADERS.copy()
                            if existing_bytes > 0:
                                req_h["Range"] = f"bytes={existing_bytes}-"
                                print(f"  Resuming '{filename}' from byte {existing_bytes}...")

                            try:
                                r_stream = requests.get(dl_url, headers=req_h, stream=True, timeout=45)
                                if r_stream.status_code in [200, 206]:
                                    mode = "ab" if (existing_bytes > 0 and r_stream.status_code == 206) else "wb"
                                    with open(dest_path, mode) as f:
                                        for chunk in r_stream.iter_content(chunk_size=65536):
                                            if chunk:
                                                f.write(chunk)

                                    v_res = verify_pdf(dest_path, item["min_pages"])
                                    if v_res["valid"]:
                                        print(f"  >>> RESUME COMPLETE: {filename} ({v_res['pages']} pages, {v_res['size_mb']} MB)\n")
                                        return True
                            except Exception as e_stream:
                                print(f"  Stream glitch: {e_stream}. Retrying Range...")

                            attempts += 1
                            time.sleep(2)
    except Exception as e:
        print(f"  >>> Search error: {e}")

    return False

def main():
    print("==========================================================================")
    print("TARGETED BYTE RESUMER ACTIVE FOR TORTORA & NASM CNC")
    print("==========================================================================\n")

    for item in TARGETS:
        resume_target(item)
        time.sleep(2)

if __name__ == "__main__":
    main()
