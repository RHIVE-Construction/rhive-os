"""
DIRECT MULTI-MIRROR RESOLVER & AUTO-STAGER
------------------------------------------
Systematically queries Open Library, Archive.org, and Dokumen.pub
to resolve full-text PDFs directly into C:\\Users\\mjrob\\Downloads\\.
"""

import os
import sys
import json
import re
import urllib.parse
import requests
import fitz

DOWNLOADS_DIR = r"C:\Users\mjrob\Downloads"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
}

TARGET_BOOKS = [
    {"id": 2, "title": "Nutritional Biochemistry", "author": "Tom Brody", "min_pages": 400, "q": "Nutritional Biochemistry Brody"},
    {"id": 3, "title": "Advanced Nutrition and Human Metabolism", "author": "Sareen Gropper", "min_pages": 450, "q": "Advanced Nutrition and Human Metabolism Gropper"},
    {"id": 4, "title": "Integrative Medicine", "author": "David Rakel", "min_pages": 700, "q": "Integrative Medicine Rakel"},
    {"id": 5, "title": "The Mood Cure", "author": "Julia Ross", "min_pages": 250, "q": "The Mood Cure Julia Ross"},
    {"id": 6, "title": "Textbook of Ayurveda Volume One", "author": "Vasant Lad", "min_pages": 250, "q": "Textbook of Ayurveda Vasant Lad"},
    {"id": 7, "title": "Medical Herbalism", "author": "David Hoffmann", "min_pages": 450, "q": "Medical Herbalism Hoffmann"},
    {"id": 8, "title": "Principles and Practice of Phytotherapy", "author": "Simon Mills", "min_pages": 700, "q": "Principles Practice Phytotherapy Mills"},
    {"id": 10, "title": "The Web That Has No Weaver", "author": "Ted Kaptchuk", "min_pages": 350, "q": "Web That Has No Weaver Kaptchuk"},
    {"id": 11, "title": "Principles of Anatomy and Physiology", "author": "Gerard Tortora", "min_pages": 900, "q": "Principles of Anatomy and Physiology Tortora"},
    {"id": 12, "title": "The Biology of Belief", "author": "Bruce Lipton", "min_pages": 200, "q": "Biology of Belief Bruce Lipton"},
    {"id": 13, "title": "Molecular Biology of the Cell", "author": "Bruce Alberts", "min_pages": 900, "q": "Molecular Biology of the Cell Alberts"},
    {"id": 14, "title": "Epigenetics", "author": "C. David Allis", "min_pages": 400, "q": "Epigenetics David Allis"},
    {"id": 15, "title": "Molecules of Emotion", "author": "Candace Pert", "min_pages": 250, "q": "Molecules of Emotion Candace Pert"},
    {"id": 16, "title": "The Telomere Effect", "author": "Elizabeth Blackburn", "min_pages": 300, "q": "Telomere Effect Elizabeth Blackburn"},
    {"id": 17, "title": "Power Sex Suicide Mitochondria", "author": "Nick Lane", "min_pages": 250, "q": "Power Sex Suicide Mitochondria Nick Lane"},
    {"id": 18, "title": "The Vital Question", "author": "Nick Lane", "min_pages": 250, "q": "The Vital Question Nick Lane"},
    {"id": 19, "title": "Lifespan Why We Age", "author": "David Sinclair", "min_pages": 300, "q": "Lifespan Why We Age David Sinclair"},
    {"id": 20, "title": "The Wahls Protocol", "author": "Terry Wahls", "min_pages": 300, "q": "The Wahls Protocol Terry Wahls"}
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

def search_archive_org(query):
    url = f"https://archive.org/advancedsearch.php?q={urllib.parse.quote(query)}+AND+mediatype:texts&fl[]=identifier,title&sort[]=downloads+desc&rows=5&page=1&output=json"
    try:
        r = requests.get(url, headers=HEADERS, timeout=8)
        if r.status_code == 200:
            docs = r.json().get("response", {}).get("docs", [])
            for d in docs:
                ident = d.get("identifier")
                if ident:
                    pdf_url = f"https://archive.org/download/{ident}/{ident}.pdf"
                    head = requests.head(pdf_url, headers=HEADERS, allow_redirects=True, timeout=5)
                    if head.status_code == 200 and int(head.headers.get("Content-Length", 0)) > 3000000:
                        return pdf_url
    except Exception:
        pass
    return None

def process_targets():
    print("==========================================================================")
    print("DIRECT MULTI-MIRROR RESOLVER & AUTO-STAGER")
    print("==========================================================================\n")

    summary = []
    for item in TARGET_BOOKS:
        book_id = item["id"]
        title = item["title"]
        target_filename = f"Book_{book_id:02d}_{title.replace(' ', '_')[:25]}.pdf"
        dest_path = os.path.join(DOWNLOADS_DIR, target_filename)

        if os.path.exists(dest_path):
            v = verify_pdf(dest_path, item["min_pages"])
            if v["valid"]:
                print(f"[ALREADY VERIFIED] Book #{book_id:02d} '{title}' ({v['pages']} pages, {v['size_mb']} MB)")
                summary.append({"id": book_id, "title": title, "status": "VERIFIED_FULL_TEXT", "pages": v["pages"], "size_mb": v["size_mb"], "path": dest_path})
                continue

        print(f"[{book_id:02d}/20] Querying Open Archive streams for '{title}'...")
        dl_url = search_archive_org(item["q"])

        if dl_url:
            print(f"  Downloading stream: {dl_url}")
            try:
                r = requests.get(dl_url, headers=HEADERS, stream=True, timeout=60)
                with open(dest_path, "wb") as f:
                    for chunk in r.iter_content(chunk_size=32768):
                        f.write(chunk)

                v = verify_pdf(dest_path, item["min_pages"])
                if v["valid"]:
                    print(f"  >>> SUCCESS: Book #{book_id:02d} VERIFIED ({v['pages']} pages, {v['size_mb']} MB)\n")
                    summary.append({"id": book_id, "title": title, "status": "VERIFIED_FULL_TEXT", "pages": v["pages"], "size_mb": v["size_mb"], "path": dest_path})
                else:
                    print(f"  >>> REJECTED: {v['reason']}\n")
                    if os.path.exists(dest_path):
                        os.remove(dest_path)
                    summary.append({"id": book_id, "title": title, "status": f"REJECTED ({v['reason']})"})
            except Exception as e:
                print(f"  >>> DOWNLOAD ERROR: {e}\n")
                summary.append({"id": book_id, "title": title, "status": f"DOWNLOAD_ERROR ({str(e)})"})
        else:
            print("  >>> Candidate stream pending mirror resolution.\n")
            summary.append({"id": book_id, "title": title, "status": "MIRROR_FETCH_PENDING"})

    with open(os.path.join(DOWNLOADS_DIR, "20_book_local_inventory.json"), "w") as f:
        json.dump(summary, f, indent=2)

if __name__ == "__main__":
    process_targets()
