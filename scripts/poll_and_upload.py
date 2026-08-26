"""
SERVICE ACCOUNT AUTOMATED POLL & UPLOAD DAEMON
----------------------------------------------
Polls Google Drive API using service account credentials.
As soon as access is granted to folder 19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA,
uploads all verified staged PDFs automatically.
"""

import os
import sys
import time
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

KEY_PATH = r'C:\Users\mjrob\.gemini\config\skills\omni-clone\auth\service-account.json'
TARGET_FOLDER_ID = '19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA'
STAGING_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "books_staging")

def poll_and_upload():
    print("==========================================================================")
    print("SERVICE ACCOUNT AUTOMATED DRIVE DAEMON ACTIVE")
    print(f"Service Account Key: {KEY_PATH}")
    print(f"Target Google Drive Folder ID: {TARGET_FOLDER_ID}")
    print("==========================================================================\n")

    creds = service_account.Credentials.from_service_account_file(
        KEY_PATH,
        scopes=['https://www.googleapis.com/auth/drive']
    )
    service = build('drive', 'v3', credentials=creds)

    staged_files = [f for f in os.listdir(STAGING_DIR) if f.endswith(".pdf")]
    print(f"Found {len(staged_files)} staged PDF files awaiting cloud upload.\n")

    attempts = 0
    while attempts < 30:
        attempts += 1
        try:
            print(f"Attempt #{attempts}: Checking Google Drive folder permissions...")
            folder = service.files().get(fileId=TARGET_FOLDER_ID, fields='id, name').execute()
            print(f"  >>> SUCCESS! Folder '{folder.get('name')}' is accessible!\n")

            for f_name in staged_files:
                file_path = os.path.join(STAGING_DIR, f_name)
                size_mb = round(os.path.getsize(file_path) / (1024 * 1024), 2)
                print(f"Uploading '{f_name}' ({size_mb} MB) -> Google Drive...")

                file_metadata = {
                    'name': f_name,
                    'parents': [TARGET_FOLDER_ID]
                }
                media = MediaFileUpload(file_path, mimetype='application/pdf', resumable=True)
                request = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink')
                response = None
                while response is None:
                    status, response = request.next_chunk()
                    if status:
                        print(f"  Upload Progress: {int(status.progress() * 100)}%")

                print(f"  >>> UPLOAD COMPLETE: {f_name} -> {response.get('webViewLink')}\n")

            print("==========================================================================")
            print("ALL STAGED FILES SUCCESSFULLY INGESTED INTO GOOGLE DRIVE.")
            print("==========================================================================")
            return True
        except Exception as e:
            if "notFound" in str(e) or "File not found" in str(e):
                print("  Permissions pending: Service account not yet shared as Editor. Waiting 5s...")
            else:
                print(f"  Drive API response: {e}")
            time.sleep(5)

    print("Daemon timeout reached.")
    return False

if __name__ == "__main__":
    poll_and_upload()
