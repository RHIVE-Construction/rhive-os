"""
OAUTH2 CODE EXCHANGER & AUTOMATED DRIVE UPLOADER (V2)
------------------------------------------------------
Exchanges authorization code from personal account (mjrob14@gmail.com)
for permanent Google Drive token and uploads Book #9.
"""

import os
import sys
import json
import requests
import google.oauth2.credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

CLIENT_SECRET_FILE = r'C:\Users\mjrob\.config\gws\client_secret.json'
TOKEN_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "config", "token.json")
SCOPES = ['https://www.googleapis.com/auth/drive']

TARGET_FOLDER_ID = '19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA'
FILE_TO_UPLOAD = r'c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\books_staging\Book_09_Textbook_of_Functional_Medicin.pdf'

def exchange_and_upload(auth_code):
    with open(CLIENT_SECRET_FILE) as f:
        cs = json.load(f)['installed']

    # Exchange code via OAuth2 token endpoint directly
    token_url = cs.get('token_uri', 'https://oauth2.googleapis.com/token')
    payload = {
        'code': auth_code,
        'client_id': cs['client_id'],
        'client_secret': cs['client_secret'],
        'redirect_uri': 'urn:ietf:wg:oauth:2.0:oob',
        'grant_type': 'authorization_code'
    }

    res = requests.post(token_url, data=payload)
    print(f"Token Exchange Response Status: {res.status_code}")

    if res.status_code != 200:
        print("Response detail:", res.text)
        # Try without redirect_uri or with standard loopback
        payload['redirect_uri'] = 'http://localhost'
        res = requests.post(token_url, data=payload)
        print("Fallback Token Exchange Status:", res.status_code, res.text)

    token_data = res.json()
    if 'access_token' not in token_data:
        print("ERROR: Token exchange failed:", token_data)
        return False

    creds = google.oauth2.credentials.Credentials(
        token=token_data['access_token'],
        refresh_token=token_data.get('refresh_token'),
        token_uri=token_url,
        client_id=cs['client_id'],
        client_secret=cs['client_secret'],
        scopes=SCOPES
    )

    with open(TOKEN_FILE, 'w') as f:
        f.write(creds.to_json())
    print(f"[AUTH SUCCESS] Permanent Token saved to {TOKEN_FILE}")

    service = build('drive', 'v3', credentials=creds)

    file_metadata = {
        'name': 'Book_09_Textbook_of_Functional_Medicine.pdf',
        'parents': [TARGET_FOLDER_ID]
    }
    media = MediaFileUpload(FILE_TO_UPLOAD, mimetype='application/pdf', resumable=True)

    print(f"Uploading Book #9 (239.91 MB) to personal Google Drive folder ({TARGET_FOLDER_ID})...")
    req = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink')

    res_upload = None
    while res_upload is None:
        status, res_upload = req.next_chunk()
        if status:
            print(f"  Upload Progress: {int(status.progress() * 100)}%")

    print(f"\n>>> SUCCESS! BOOK #9 UPLOADED TO GOOGLE DRIVE: {res_upload.get('webViewLink')}")
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1:
        exchange_and_upload(sys.argv[1].strip())
    else:
        print("Usage: python scripts/exchange_auth_code.py <AUTH_CODE>")
