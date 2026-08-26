"""
GOOGLE DRIVE DEDUPLICATION AUDITOR & BATCH CLOUD UPLOADER (ALL DRIVES SUPPORT)
--------------------------------------------------------------------------------
Queries target Google Drive folder 19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA ('Wellness AI'),
audits existing files, streams all verified local PDFs into Drive with supportsAllDrives=True,
and enforces ZERO duplicates.
"""

import os
import sys
import json
import google.oauth2.credentials
import google.auth.transport.requests
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

TOKEN_FILE = r'c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\config\token.json'
TARGET_FOLDER_ID = '19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA'
DOWNLOADS_DIR = r'C:\Users\mjrob\Downloads'

def upload_deduped_library():
    print("==========================================================================")
    print("GOOGLE DRIVE DEDUPLICATION & BATCH CLOUD UPLOADER ACTIVE")
    print(f"Target Folder ID: {TARGET_FOLDER_ID}")
    print("==========================================================================\n")

    with open(TOKEN_FILE) as f:
        tdata = json.load(f)

    creds = google.oauth2.credentials.Credentials(
        token=tdata.get('access_token'),
        refresh_token=tdata.get('refresh_token'),
        token_uri='https://oauth2.googleapis.com/token',
        client_id=tdata.get('client_id'),
        client_secret=tdata.get('client_secret'),
        scopes=['https://www.googleapis.com/auth/drive']
    )

    if creds.expired and creds.refresh_token:
        request = google.auth.transport.requests.Request()
        creds.refresh(request)
        tdata['access_token'] = creds.token
        with open(TOKEN_FILE, 'w') as f:
            json.dump(tdata, f, indent=2)
        print("[AUTH] Successfully refreshed access token.")

    service = build('drive', 'v3', credentials=creds)

    # 1. Fetch existing files in Google Drive folder for deduplication
    q_str = f"'{TARGET_FOLDER_ID}' in parents and trashed = false"
    res_existing = service.files().list(
        q=q_str,
        fields="files(id, name, size)",
        supportsAllDrives=True,
        includeItemsFromAllDrives=True
    ).execute()

    existing_items = {item['name'].lower(): item['id'] for item in res_existing.get('files', [])}

    print(f"[DEDUP AUDIT] Found {len(existing_items)} existing files in Google Drive folder 'Wellness AI':")
    for name_lower in existing_items.keys():
        print(f"  - Existing in Drive: {name_lower}")
    print("--------------------------------------------------------------------------\n")

    # 2. Iterate local verified PDFs in Downloads folder
    local_files = sorted([f for f in os.listdir(DOWNLOADS_DIR) if f.startswith("Book_") and f.endswith(".pdf") and not f.endswith(".tmp")])

    uploaded_count = 0
    skipped_count = 0

    for filename in local_files:
        local_path = os.path.join(DOWNLOADS_DIR, filename)
        file_size_mb = round(os.path.getsize(local_path) / (1024 * 1024), 2)
        filename_lower = filename.lower()

        if filename_lower in existing_items:
            print(f"[SKIP DUP] '{filename}' already exists in Google Drive folder (ID: {existing_items[filename_lower]}). Skipping to prevent duplicates.")
            skipped_count += 1
            continue

        print(f"[CLOUD UPLOAD] Uploading '{filename}' ({file_size_mb} MB) -> Google Drive Folder...")
        file_metadata = {
            'name': filename,
            'parents': [TARGET_FOLDER_ID]
        }
        media = MediaFileUpload(local_path, mimetype='application/pdf', resumable=True)

        req = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, webViewLink',
            supportsAllDrives=True
        )

        res_up = None
        while res_up is None:
            status, res_up = req.next_chunk()
            if status:
                print(f"  Progress: {int(status.progress() * 100)}%")

        drive_id = res_up.get('id')
        link = res_up.get('webViewLink')
        print(f"  >>> SUCCESS: Uploaded '{filename}' (Drive Link: {link})\n")
        existing_items[filename_lower] = drive_id
        uploaded_count += 1

    print("==========================================================================")
    print("BATCH GOOGLE DRIVE DEDUPED UPLOAD COMPLETE!")
    print(f"Uploaded: {uploaded_count} files | Skipped Duplicates: {skipped_count} files")
    print(f"Live Google Drive Folder: https://drive.google.com/drive/folders/{TARGET_FOLDER_ID}?usp=drive_link")
    print("==========================================================================")

if __name__ == "__main__":
    upload_deduped_library()
