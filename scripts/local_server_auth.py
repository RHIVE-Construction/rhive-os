"""
LOCAL SERVER AUTOMATED OAUTH AUTHENTICATOR & UPLOADER
------------------------------------------------------
Runs local HTTP listener on port 8090. When clicked, Google automatically
exchanges tokens and immediately streams Book #9 to Google Drive!
"""

import os
import json
import google.auth.transport.requests
import google.oauth2.credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

CLIENT_SECRET_FILE = r'C:\Users\mjrob\.config\gws\client_secret.json'
TOKEN_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "config", "token.json")
SCOPES = ['https://www.googleapis.com/auth/drive']

TARGET_FOLDER_ID = '19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA'
FILE_TO_UPLOAD = r'c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\books_staging\Book_09_Textbook_of_Functional_Medicin.pdf'

def main():
    print("==========================================================================")
    print("RUNNING LOCAL OAUTH2 SERVER (PORT 8090)")
    print("==========================================================================\n")

    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
    auth_url, _ = flow.authorization_url(prompt='consent', access_type='offline')
    print(">>> DIRECT CLICK URL:")
    print(auth_url)
    print("\nWaiting for browser click...")

    creds = flow.run_local_server(port=8090, open_browser=True)

    with open(TOKEN_FILE, 'w') as token:
        token.write(creds.to_json())
    print(f"\n[AUTH SUCCESS] Permanent Token saved to: {TOKEN_FILE}")

    service = build('drive', 'v3', credentials=creds)

    file_metadata = {
        'name': 'Book_09_Textbook_of_Functional_Medicine.pdf',
        'parents': [TARGET_FOLDER_ID]
    }
    media = MediaFileUpload(FILE_TO_UPLOAD, mimetype='application/pdf', resumable=True)

    print(f"Uploading Book #9 (239.91 MB) to personal Google Drive folder ({TARGET_FOLDER_ID})...")
    req = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink')

    res = None
    while res is None:
        status, res = req.next_chunk()
        if status:
            print(f"  Upload Progress: {int(status.progress() * 100)}%")

    print(f"\n>>> SUCCESS! BOOK #9 UPLOADED TO GOOGLE DRIVE: {res.get('webViewLink')}")

if __name__ == "__main__":
    main()
