"""
PERMANENT OAUTH2 GOOGLE DRIVE AUTHENTICATOR
-------------------------------------------
Uses client_secret.json to establish permanent OAuth2 refresh token for Google Drive API.
Saves token to token.json for automated zero-prompt uploads.
"""

import os
import json
import google.oauth2.credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

CLIENT_SECRET_FILE = r'C:\Users\mjrob\.config\gws\client_secret.json'
TOKEN_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "config", "token.json")
SCOPES = ['https://www.googleapis.com/auth/drive']

TARGET_FOLDER_ID = '19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA'
FILE_TO_UPLOAD = r'c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\books_staging\Book_09_Textbook_of_Functional_Medicin.pdf'

def get_drive_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = google.oauth2.credentials.Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(google.auth.transport.requests.Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
    return build('drive', 'v3', credentials=creds)

def main():
    print("==========================================================================")
    print("OAUTH2 PERMANENT GOOGLE DRIVE CONNECTOR")
    print("==========================================================================\n")
    service = get_drive_service()
    print("[SUCCESS] Authenticated Google Drive API Service!")

    file_metadata = {
        'name': 'Book_09_Textbook_of_Functional_Medicine.pdf',
        'parents': [TARGET_FOLDER_ID]
    }
    media = MediaFileUpload(FILE_TO_UPLOAD, mimetype='application/pdf', resumable=True)
    print(f"Uploading Book #9 (239.91 MB) to folder ID {TARGET_FOLDER_ID}...")

    req = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink')
    res = None
    while res is None:
        status, res = req.next_chunk()
        if status:
            print(f"  Progress: {int(status.progress() * 100)}%")

    print(f"\n>>> UPLOAD COMPLETE! Live URL: {res.get('webViewLink')}")

if __name__ == "__main__":
    main()
