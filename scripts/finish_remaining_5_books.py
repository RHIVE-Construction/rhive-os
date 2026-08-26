"""
FINAL 5-BOOK TARGETED INGESTION & ANTI-PARTIAL VERIFIER
-------------------------------------------------------
Fetches final remaining books (#4, #5, #15, #18, #23) including NASM CNC
directly into C:\\Users\\mjrob\\Downloads\\.
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

FINAL_5 = [
    {"id": 4, "title": "Integrative Medicine", "q": "Integrative Medicine David Rakel", "min_pages": 700, "dest": "Book_04_Integrative_Medicine.pdf"},
    {"id": 5, "title": "The Mood Cure", "q": "The Mood Cure Julia Ross", "min_pages": 250, "dest": "Book_05_The_Mood_Cure.pdf"},
    {"id": 15, "title": "Molecules of Emotion", "q": "Molecules of Emotion Candace Pert", "min_pages": 250, "dest": "Book_15_Molecules_of_Emotion.pdf"},
    {"id": 18, "title": "The Vital Question", "q": "Vital Question Nick Lane", "min_pages": 250, "dest": "Book_18_The_Vital_Question.pdf"},
    {"id": 23, "title": "NASM CNC Sports Nutrition", "q": "NASM Essentials of Sports Nutrition", "min_pages": 450, "dest": "Book_23_NASM_Nutrition_CNC.pdf"}
]

def verify_pdf(file_path, min_pages):
    if not os.path.exists(file_path):
        return {"valid": False, "reason": "Missing file"}
    size_mb = round(os.path.getsize(file_path) / (1024 * 1024), 2)
    if size_mb < 3.0:
        return {"valid": False, "reason": f"File size too small ({size_mb} MB < 3MB)"}

    try:
        doc = fitz.open(file_path)
        pages = doc.page_count
        if pages < (min_pages * 0.5):
            return {"valid": False, "reason": f"Page count too low ({pages} vs min {int(min_pages * 0.5)})"}
        return {"valid": True, "pages": pages, "size_mb": size_mb}
    except Exception as e:
        return {"valid": False, "reason": str(e)}

def fetch_book(item):
    book_id = item["id"]
    title = item["title"]
    query = item["q"]
    dest_path = os.path.join(DOWNLOADS_DIR, item["dest"])

    v = verify_pdf(dest_path, item["min_pages"])
    if v["valid"]:
        print(f"[VERIFIED] Book #{book_id:02d} '{title}' ({v['pages']} pages, {v['size_mb']} MB)")
        return True

    print(f"[{book_id:02d}/23] Fetching '{title}' from Libgen stream...")
    search_url = f"https://libgen.li/index.php?req={requests.utils.quote(query)}&columns[]=t&columns[]=a"

    try:
        r = requests.get(search_url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            ads_links = [a["href"] for a in soup.find_all("a", href=True) if "ads.php" in a["href"]]
            if ads_links:
                ads_url = "https://libgen.li/" + ads_links[0].lstrip("/")
                time.sleep(1.5)

                r_ads = requests.get(ads_url, headers=HEADERS, timeout=10)
                if r_ads.status_code == 200:
                    soup_ads = BeautifulSoup(r_ads.text, "html.parser")
                    get_links = [a["href"] for a in soup_ads.find_all("a", href=True) if "get.php" in a["href"]]
                    if get_links:
                        dl_url = "https://libgen.li/" + get_links[0].lstrip("/")
                        print(f"  Streaming binary from {dl_url}...")

                        r_file = requests.get(dl_url, headers=HEADERS, stream=True, timeout=90)
                        if r_file.status_code == 200:
                            with open(dest_path, "wb") as f:
                                for chunk in r_file.iter_content(chunk_size=65536):
                                    if chunk:
                                        f.write(chunk)

                            v_check = verify_pdf(dest_path, item["min_pages"])
                            if v_check["valid"]:
                                print(f"  >>> SUCCESS: Book #{book_id:02d} VERIFIED ({v_check['pages']} pages, {v_check['size_mb']} MB)\n")
                                return True
                            else:
                                if os.path.exists(dest_path):
                                    os.remove(dest_path)
    except Exception as e:
        print(f"  >>> Error: {e}")

    return False

def main():
    print("==========================================================================")
    print("FINAL 5-BOOK TARGETED INGESTION PASS")
    print(f"Target Directory: {DOWNLOADS_DIR}")
    print("==========================================================================\n")

    for item in FINAL_5:
        fetch_book(item)
        time.sleep(3)

if __name__ == "__main__":
    main()
