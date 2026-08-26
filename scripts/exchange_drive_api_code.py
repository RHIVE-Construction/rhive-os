"""
REAL GOOGLE DRIVE API OAUTH EXCHANGER & DIRECT UPLOADER
--------------------------------------------------------
Exchanges authorization code for Client ID 598176014135,
saves token.json, and streams Book #9 into Google Drive folder 19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA.
"""

import os
import sys
import json
import requests
import google.oauth2.credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

CLIENT_SECRET_FILE = r'C:\Users\mjrob\.gemini\antigravity\playground\MJR_EPA\config\credentials.json'
TOKEN_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "config", "token.json")
SCOPES = ['https://www.googleapis.com/auth/drive']

TARGET_FOLDER_ID = '19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA'
FILE_TO_UPLOAD = r'c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\books_staging\Book_09_Textbook_of_Functional_Medicin.pdf'

def exchange_and_upload(auth_code):
    with open(CLIENT_SECRET_FILE) as f:
        cs = json.load(f)['installed']

    token_url = cs.get('token_uri', 'https://oauth2.googleapis.com/token')
    payload = {
        'code': auth_code,
        'client_id': cs['client_id'],
        'client_secret': cs['client_secret'],
        'redirect_uri': 'urn:ietf:wg:oauth:2.0:oob',
        'grant_type': 'authorization_code'
    }

    print(f"Exchanging Auth Code for Real Drive Client ({cs['client_id'][:15]}...)...")
    res = requests.post(token_url, data=payload)
    print(f"Token Exchange Status: {res.status_code}")

    if res.status_code != 200:
        print("Error details:", res.text)
        return False

    tdata = res.json()
    creds_dict = {
        'access_token': tdata['access_token'],
        'refresh_token': tdata.get('refresh_token'),
        'token_uri': token_url,
        'client_id': cs['client_id'],
        'client_secret': cs['client_secret'],
        'scopes': SCOPES
    }

    with open(TOKEN_FILE, 'w') as tf:
        json.dump(creds_dict, tf, indent=2)
    print(f"[AUTH SUCCESS] Saved verified credentials to: {TOKEN_FILE}")

    creds = google.oauth2.credentials.Credentials(
        token=tdata['access_token'],
        refresh_token=tdata.get('refresh_token'),
        token_uri=token_url,
        client_id=cs['client_id'],
        client_secret=cs['client_secret'],
        scopes=SCOPES
    )

    service = build('drive', 'v3', credentials=creds)

    print(f"Uploading Book #9 (239.91 MB) to Google Drive Folder {TARGET_FOLDER_ID}...")
    file_metadata = {
        'name': 'Book_09_Textbook_of_Functional_Medicine.pdf',
        'parents': [TARGET_FOLDER_ID]
    }
    media = MediaFileUpload(FILE_TO_UPLOAD, mimetype='application/pdf', resumable=True)

    req = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink')
    res_up = None
    while res_up is None:
        status, res_up = req.next_chunk()
        if status:
            print(f"  Upload Progress: {int(status.progress() * 100)}%")

    print(f"\n>>> UPLOAD COMPLETE! Live Drive URL: {res_up.get('webViewLink')}")
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1:
        exchange_and_upload(sys.argv[1].strip())
    else:
        print("Usage: python scripts/exchange_drive_api_code.py <AUTH_CODE>")
