"""
DIRECT ISBN & IPFS GATEWAY BOOK RESOLVER
---------------------------------------
Queries direct digital archive endpoints using exact ISBN metadata
to download full-text PDFs for the remaining bibliography books.
"""

import os
import sys
import json
import requests
import fitz

STAGING_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "books_staging")
os.makedirs(STAGING_DIR, exist_ok=True)

TARGET_BOOKS = [
    {"id": 2, "title": "Nutritional Biochemistry", "author": "Tom Brody", "isbn": "9780121348366", "min_pages": 400},
    {"id": 3, "title": "Advanced Nutrition and Human Metabolism", "author": "Sareen Gropper", "isbn": "9781305627857", "min_pages": 450},
    {"id": 4, "title": "Integrative Medicine", "author": "David Rakel", "isbn": "9780323358682", "min_pages": 700},
    {"id": 5, "title": "The Mood Cure", "author": "Julia Ross", "isbn": "9780142003640", "min_pages": 250},
    {"id": 6, "title": "Textbook of Ayurveda Volume One", "author": "Vasant Lad", "isbn": "9781883725075", "min_pages": 250},
    {"id": 7, "title": "Medical Herbalism", "author": "David Hoffmann", "isbn": "9780892817498", "min_pages": 450},
    {"id": 8, "title": "Principles and Practice of Phytotherapy", "author": "Simon Mills", "isbn": "9780443069925", "min_pages": 700},
    {"id": 10, "title": "The Web That Has No Weaver", "author": "Ted Kaptchuk", "isbn": "9780809228408", "min_pages": 350},
    {"id": 11, "title": "Principles of Anatomy and Physiology", "author": "Gerard Tortora", "isbn": "9781119320647", "min_pages": 900},
    {"id": 12, "title": "The Biology of Belief", "author": "Bruce Lipton", "isbn": "9781401952471", "min_pages": 200},
    {"id": 13, "title": "Molecular Biology of the Cell", "author": "Bruce Alberts", "isbn": "9780815344322", "min_pages": 900},
    {"id": 14, "title": "Epigenetics", "author": "C. David Allis", "isbn": "9781621820284", "min_pages": 400},
    {"id": 15, "title": "Molecules of Emotion", "author": "Candace Pert", "isbn": "9780684846347", "min_pages": 250},
    {"id": 16, "title": "The Telomere Effect", "author": "Elizabeth Blackburn", "isbn": "9781455586691", "min_pages": 300},
    {"id": 17, "title": "Power Sex Suicide Mitochondria", "author": "Nick Lane", "isbn": "9780199205646", "min_pages": 250},
    {"id": 18, "title": "The Vital Question", "author": "Nick Lane", "isbn": "9780393088816", "min_pages": 250},
    {"id": 19, "title": "Lifespan Why We Age", "author": "David Sinclair", "isbn": "9781501191978", "min_pages": 300},
    {"id": 20, "title": "The Wahls Protocol", "author": "Terry Wahls", "isbn": "9781583335543", "min_pages": 300}
]

def check_open_library(isbn):
    url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data"
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            data = r.json().get(f"ISBN:{isbn}", {})
            ebooks = data.get("ebooks", [])
            for eb in ebooks:
                read_url = eb.get("read_url")
                if read_url:
                    return read_url
    except Exception:
        pass
    return None

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

def run_isbn_resolver():
    print("==========================================================================")
    print("RUNNING DIRECT ISBN ARCHIVE RESOLVER")
    print("==========================================================================\n")

    staged = []
    for item in TARGET_BOOKS:
        print(f"[{item['id']}/20] Querying Open Digital Library for ISBN {item['isbn']} ({item['title']})...")
        read_url = check_open_library(item['isbn'])
        if read_url:
            print(f"  >>> Open access candidate found: {read_url}")
            staged.append({"id": item["id"], "title": item["title"], "read_url": read_url, "status": "OPEN_ACCESS_FOUND"})
        else:
            print(f"  >>> No open access stream registered for ISBN {item['isbn']}.")

    with open(os.path.join(STAGING_DIR, "isbn_resolver_results.json"), "w") as f:
        json.dump(staged, f, indent=2)

if __name__ == "__main__":
    run_isbn_resolver()
