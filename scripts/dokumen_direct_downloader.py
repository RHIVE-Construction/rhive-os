"""
DOKUMEN.PUB HIGH-SPEED DIRECT SEARCH & BINARY STREAMER
------------------------------------------------------
Queries https://dokumen.pub/search?q=<title> directly, extracts document landing
pages, requests direct /download/ endpoints, and streams full-text PDFs to C:\\Users\\mjrob\\Downloads\\.
"""

import os
import sys
import json
import re
import time
import urllib.parse
import requests
import fitz
from bs4 import BeautifulSoup

DOWNLOADS_DIR = r"C:\Users\mjrob\Downloads"
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://dokumen.pub/"
}

TARGET_BOOKS = [
    {"id": 2, "title": "Nutritional Biochemistry Brody", "min_pages": 400, "dest": "Book_02_Nutritional_Biochemistry.pdf"},
    {"id": 4, "title": "Integrative Medicine Rakel", "min_pages": 700, "dest": "Book_04_Integrative_Medicine.pdf"},
    {"id": 5, "title": "The Mood Cure Julia Ross", "min_pages": 250, "dest": "Book_05_The_Mood_Cure.pdf"},
    {"id": 6, "title": "Textbook of Ayurveda Vasant Lad", "min_pages": 250, "dest": "Book_06_Textbook_of_Ayurveda.pdf"},
    {"id": 7, "title": "Medical Herbalism David Hoffmann", "min_pages": 450, "dest": "Book_07_Medical_Herbalism.pdf"},
    {"id": 8, "title": "Principles Practice Phytotherapy Simon Mills", "min_pages": 700, "dest": "Book_08_Principles_Practice_Phytotherapy.pdf"},
    {"id": 10, "title": "Web That Has No Weaver Kaptchuk", "min_pages": 350, "dest": "Book_10_The_Web_That_Has_No_Weaver.pdf"},
    {"id": 11, "title": "Principles Anatomy Physiology Tortora", "min_pages": 900, "dest": "Book_11_Principles_Anatomy_Physiology.pdf"},
    {"id": 12, "title": "Biology of Belief Bruce Lipton", "min_pages": 200, "dest": "Book_12_The_Biology_of_Belief.pdf"},
    {"id": 13, "title": "Molecular Biology Cell Alberts", "min_pages": 900, "dest": "Book_13_Molecular_Biology_of_Cell.pdf"},
    {"id": 14, "title": "Epigenetics David Allis", "min_pages": 400, "dest": "Book_14_Epigenetics.pdf"},
    {"id": 15, "title": "Molecules of Emotion Candace Pert", "min_pages": 250, "dest": "Book_15_Molecules_of_Emotion.pdf"},
    {"id": 16, "title": "Telomere Effect Elizabeth Blackburn", "min_pages": 300, "dest": "Book_16_The_Telomere_Effect.pdf"},
    {"id": 17, "title": "Power Sex Suicide Mitochondria Nick Lane", "min_pages": 250, "dest": "Book_17_Power_Sex_Suicide.pdf"},
    {"id": 18, "title": "Vital Question Nick Lane", "min_pages": 250, "dest": "Book_18_The_Vital_Question.pdf"},
    {"id": 19, "title": "Lifespan Why We Age David Sinclair", "min_pages": 300, "dest": "Book_19_Lifespan_Why_We_Age.pdf"},
    {"id": 20, "title": "Wahls Protocol Terry Wahls", "min_pages": 300, "dest": "Book_20_The_Wahls_Protocol.pdf"},
    {"id": 21, "title": "NASM Essentials of Personal Fitness Training", "min_pages": 600, "dest": "Book_21_NASM_CPT_7th_Edition.pdf"},
    {"id": 22, "title": "NASM Essentials of Corrective Exercise Training", "min_pages": 500, "dest": "Book_22_NASM_CES_Corrective_Exercise.pdf"},
    {"id": 23, "title": "NASM Essentials of Sports Nutrition", "min_pages": 450, "dest": "Book_23_NASM_Nutrition_CNC.pdf"}
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

def process_dokumen_book(item):
    book_id = item["id"]
    title = item["title"]
    dest_path = os.path.join(DOWNLOADS_DIR, item["dest"])

    v = verify_pdf(dest_path, item["min_pages"])
    if v["valid"]:
        print(f"[VERIFIED] Book #{book_id:02d} '{title}' ({v['pages']} pages, {v['size_mb']} MB)")
        return

    print(f"[{book_id:02d}/23] Searching Dokumen for '{title}'...")
    search_url = f"https://dokumen.pub/search?q={urllib.parse.quote(title)}"

    try:
        r = requests.get(search_url, headers=HEADERS, timeout=12)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            doc_links = []
            for a in soup.find_all("a", href=True):
                href = a["href"]
                if href.endswith(".html") and "search" not in href:
                    doc_links.append("https://dokumen.pub" + href if not href.startswith("http") else href)

            if doc_links:
                target_doc_url = doc_links[0]
                print(f"  Fetching landing page: {target_doc_url}")

                r_landing = requests.get(target_doc_url, headers=HEADERS, timeout=12)
                if r_landing.status_code == 200:
                    soup_landing = BeautifulSoup(r_landing.text, "html.parser")
                    dl_links = []
                    for a in soup_landing.find_all("a", href=True):
                        if "/download/" in a["href"] or "download" in a.text.lower():
                            href = a["href"]
                            dl_links.append("https://dokumen.pub" + href if not href.startswith("http") else href)

                    if dl_links:
                        final_dl_url = dl_links[0]
                        print(f"  Streaming binary from {final_dl_url}...")

                        r_binary = requests.get(final_dl_url, headers=HEADERS, stream=True, timeout=90)
                        if r_binary.status_code == 200:
                            with open(dest_path, "wb") as f:
                                for chunk in r_binary.iter_content(chunk_size=65536):
                                    if chunk:
                                        f.write(chunk)

                            v_check = verify_pdf(dest_path, item["min_pages"])
                            if v_check["valid"]:
                                print(f"  >>> SUCCESS: Book #{book_id:02d} VERIFIED ({v_check['pages']} pages, {v_check['size_mb']} MB)\n")
                                return
                            else:
                                print(f"  >>> REJECTED: {v_check['reason']}\n")
                                if os.path.exists(dest_path):
                                    os.remove(dest_path)
    except Exception as e:
        print(f"  >>> Error processing '{title}': {e}\n")

def main():
    print("==========================================================================")
    print("DOKUMEN.PUB HIGH-SPEED DIRECT SEARCH & BINARY STREAMER ACTIVE")
    print(f"Target Directory: {DOWNLOADS_DIR}")
    print("==========================================================================\n")

    for item in TARGET_BOOKS:
        process_dokumen_book(item)
        time.sleep(1)

if __name__ == "__main__":
    main()
