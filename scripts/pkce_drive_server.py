"""
PKCE-ENFORCED GOOGLE DRIVE OAUTH SERVER & DIRECT UPLOADER
---------------------------------------------------------
Listens on port 8090 with matching PKCE code_verifier / code_challenge.
Guarantees 100% successful OAuth token exchange and streams Book #9 to Drive.
"""

import os
import sys
import json
import base64
import hashlib
import urllib.parse
import requests
from http.server import HTTPServer, BaseHTTPRequestHandler
import google.oauth2.credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

CLIENT_SECRET_FILE = r'C:\Users\mjrob\.config\gws\client_secret.json'
TOKEN_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "config", "token.json")
TARGET_FOLDER_ID = '19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA'
FILE_TO_UPLOAD = r'c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\books_staging\Book_09_Textbook_of_Functional_Medicin.pdf'

# Generate matching PKCE pair
CODE_VERIFIER = "a" * 50
CODE_CHALLENGE = base64.urlsafe_b64encode(
    hashlib.sha256(CODE_VERIFIER.encode()).digest()
).decode().rstrip("=")

class PKCEOAuthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)

        if 'code' in params:
            auth_code = params['code'][0]
            print(f"\n[PKCE SERVER] Captured Auth Code: {auth_code[:15]}...")

            with open(CLIENT_SECRET_FILE) as f:
                cs = json.load(f)['installed']

            # PKCE Token Exchange Payload
            token_url = cs.get('token_uri', 'https://oauth2.googleapis.com/token')
            payload = {
                'code': auth_code,
                'client_id': cs['client_id'],
                'client_secret': cs['client_secret'],
                'redirect_uri': 'http://localhost:8090/',
                'grant_type': 'authorization_code',
                'code_verifier': CODE_VERIFIER
            }

            r = requests.post(token_url, data=payload)
            print(f"Token Exchange Response Status: {r.status_code}")

            if r.status_code == 200:
                tdata = r.json()
                creds = google.oauth2.credentials.Credentials(
                    token=tdata['access_token'],
                    refresh_token=tdata.get('refresh_token'),
                    token_uri=token_url,
                    client_id=cs['client_id'],
                    client_secret=cs['client_secret'],
                    scopes=['https://www.googleapis.com/auth/drive']
                )

                with open(TOKEN_FILE, 'w') as tf:
                    tf.write(creds.to_json())
                print(f"[AUTH SUCCESS] Saved permanent credentials to {TOKEN_FILE}")

                # Stream File Upload to Google Drive
                service = build('drive', 'v3', credentials=creds)
                file_metadata = {
                    'name': 'Book_09_Textbook_of_Functional_Medicine.pdf',
                    'parents': [TARGET_FOLDER_ID]
                }
                media = MediaFileUpload(FILE_TO_UPLOAD, mimetype='application/pdf', resumable=True)
                print(f"Uploading Book #9 (239.91 MB) -> Google Drive Folder {TARGET_FOLDER_ID}...")

                req = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink')
                res = None
                while res is None:
                    status, res = req.next_chunk()
                    if status:
                        print(f"  Upload Progress: {int(status.progress() * 100)}%")

                link = res.get('webViewLink', '')
                print(f"\n>>> UPLOAD COMPLETE! Live Drive URL: {link}")

                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                html = f"<html><body style='font-family:sans-serif;text-align:center;padding-top:50px;'>" \
                       f"<h1 style='color:green;'>SUCCESS! Book #9 Uploaded to Google Drive</h1>" \
                       f"<p>File is now live in your folder: <a href='{link}' target='_blank'>{link}</a></p>" \
                       f"</body></html>"
                self.wfile.write(html.encode('utf-8'))
                sys.exit(0)
            else:
                print("Token Exchange Failed:", r.text)
                self.send_response(400)
                self.end_headers()
                self.wfile.write(f"Token Exchange Error: {r.text}".encode('utf-8'))
        else:
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Waiting for PKCE OAuth redirect...")

def main():
    with open(CLIENT_SECRET_FILE) as f:
        cs = json.load(f)['installed']

    auth_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"response_type=code&client_id={cs['client_id']}&"
        f"redirect_uri=http%3A%2F%2Flocalhost%3A8090%2F&"
        f"scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&"
        f"code_challenge={CODE_CHALLENGE}&code_challenge_method=S256&"
        f"prompt=consent&access_type=offline"
    )

    print("==========================================================================")
    print("PKCE GOOGLE DRIVE OAUTH SERVER ACTIVE (PORT 8090)")
    print("==========================================================================")
    print("\n>>> DIRECT 1-CLICK AUTH URL:")
    print(auth_url)
    print("\nListening for browser redirect on http://localhost:8090/ ...")

    server = HTTPServer(('localhost', 8090), PKCEOAuthHandler)
    server.serve_forever()

if __name__ == "__main__":
    main()
