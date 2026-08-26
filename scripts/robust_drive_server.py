"""
ROBUST HTTP OAUTH SERVER & DIRECT UPLOADER
------------------------------------------
Listens on port 8090. Catches OAuth authorization code redirects,
exchanges token via standard OAuth API, saves token.json, and streams
Book #9 directly into Google Drive Folder 19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA.
"""

import os
import sys
import json
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

class OAuthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)

        if 'code' in params:
            auth_code = params['code'][0]
            print(f"\n[HTTP SERVER] Captured Auth Code: {auth_code[:15]}...")

            with open(CLIENT_SECRET_FILE) as f:
                cs = json.load(f)['installed']

            # Token exchange
            token_url = cs.get('token_uri', 'https://oauth2.googleapis.com/token')
            payload = {
                'code': auth_code,
                'client_id': cs['client_id'],
                'client_secret': cs['client_secret'],
                'redirect_uri': 'http://localhost:8090/',
                'grant_type': 'authorization_code'
            }

            r = requests.post(token_url, data=payload)
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
                print(f"[AUTH SUCCESS] Token saved to: {TOKEN_FILE}")

                # Trigger Upload
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
                print(f"\n>>> UPLOAD COMPLETE! Live Drive Link: {link}")

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
                self.send_response(400)
                self.end_headers()
                self.wfile.write(f"Token Exchange Error: {r.text}".encode('utf-8'))
        else:
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Waiting for OAuth redirect...")

def main():
    print("==========================================================================")
    print("ROBUST HTTP OAUTH SERVER LISTENING ON PORT 8090")
    print("==========================================================================\n")
    server = HTTPServer(('localhost', 8090), OAuthHandler)
    server.serve_forever()

if __name__ == "__main__":
    main()
