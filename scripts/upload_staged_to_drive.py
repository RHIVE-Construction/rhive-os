"""
AUTOMATED STAGED PDF TO GOOGLE DRIVE UPLOADER
----------------------------------------------
Uploads verified full-text PDFs from ./books_staging/ directly to
Google Drive Folder ID 19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA.
"""

import os
import sys
import json
import time
import google.auth
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

TARGET_FOLDER_ID = "19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA"
STAGING_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "books_staging")

def upload_staged_files():
    print("==========================================================================")
    print("GOOGLE DRIVE STAGED PDF UPLOADER ENGINE")
    print(f"Target Drive Folder ID: {TARGET_FOLDER_ID}")
    print("==========================================================================\n")

    try:
        credentials, project = google.auth.default(scopes=['https://www.googleapis.com/auth/drive'])
        service = build('drive', 'v3', credentials=credentials)
        print(f"[AUTH SUCCESS] Connected with credentials (Project: {project})")
    except Exception as e:
        print(f"[AUTH PENDING] Re-authentication required: {e}")
        return False

    staged_files = [f for f in os.listdir(STAGING_DIR) if f.endswith(".pdf")]
    print(f"Found {len(staged_files)} verified staged PDF files to process.\n")

    for f_name in staged_files:
        file_path = os.path.join(STAGING_DIR, f_name)
        size_mb = round(os.path.getsize(file_path) / (1024 * 1024), 2)
        print(f"Uploading '{f_name}' ({size_mb} MB) -> Google Drive Folder...")

        file_metadata = {
            'name': f_name,
            'parents': [TARGET_FOLDER_ID]
        }
        media = MediaFileUpload(file_path, mimetype='application/pdf', resumable=True)

        try:
            request = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink')
            response = None
            while response is None:
                status, response = request.next_chunk()
                if status:
                    print(f"  Upload Progress: {int(status.progress() * 100)}%")

            print(f"  >>> UPLOAD SUCCESS: {f_name} -> {response.get('webViewLink')}\n")
        except Exception as upload_err:
            print(f"  >>> UPLOAD FAILED for {f_name}: {upload_err}\n")

    return True

if __name__ == "__main__":
    upload_staged_files()
