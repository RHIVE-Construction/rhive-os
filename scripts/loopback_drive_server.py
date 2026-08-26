"""
LOOPBACK OAUTH SERVER & DIRECT GOOGLE DRIVE UPLOADER (PORT 8080)
------------------------------------------------------------------
Bypasses Google's deprecated OOB flow by serving standard loopback on port 8080.
Uses dedicated Client ID 598176014135 to exchange tokens and upload Book #9.
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

CLIENT_SECRET_FILE = r'C:\Users\mjrob\.gemini\antigravity\playground\MJR_EPA\config\credentials.json'
TOKEN_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "config", "token.json")
TARGET_FOLDER_ID = '19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA'
FILE_TO_UPLOAD = r'c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\books_staging\Book_09_Textbook_of_Functional_Medicin.pdf'

class LoopbackOAuthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)

        if 'code' in params:
            auth_code = params['code'][0]
            print(f"\n[LOOPBACK SERVER] Captured Auth Code: {auth_code[:15]}...")

            with open(CLIENT_SECRET_FILE) as f:
                cs = json.load(f)['installed']

            token_url = cs.get('token_uri', 'https://oauth2.googleapis.com/token')
            payload = {
                'code': auth_code,
                'client_id': cs['client_id'],
                'client_secret': cs['client_secret'],
                'redirect_uri': 'http://localhost:8080/',
                'grant_type': 'authorization_code'
            }

            r = requests.post(token_url, data=payload)
            print(f"Token Exchange Status: {r.status_code}")

            if r.status_code == 200:
                tdata = r.json()
                creds_dict = {
                    'access_token': tdata['access_token'],
                    'refresh_token': tdata.get('refresh_token'),
                    'token_uri': token_url,
                    'client_id': cs['client_id'],
                    'client_secret': cs['client_secret'],
                    'scopes': ['https://www.googleapis.com/auth/drive']
                }

                with open(TOKEN_FILE, 'w') as tf:
                    json.dump(creds_dict, tf, indent=2)
                print(f"[AUTH SUCCESS] Token saved to: {TOKEN_FILE}")

                creds = google.oauth2.credentials.Credentials(
                    token=tdata['access_token'],
                    refresh_token=tdata.get('refresh_token'),
                    token_uri=token_url,
                    client_id=cs['client_id'],
                    client_secret=cs['client_secret'],
                    scopes=['https://www.googleapis.com/auth/drive']
                )

                service = build('drive', 'v3', credentials=creds)
                print(f"Streaming Book #9 (239.91 MB) -> Google Drive Folder {TARGET_FOLDER_ID}...")

                file_metadata = {
                    'name': 'Book_09_Textbook_of_Functional_Medicine.pdf',
                    'parents': [TARGET_FOLDER_ID]
                }
                media = MediaFileUpload(FILE_TO_UPLOAD, mimetype='application/pdf', resumable=True)

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
                print("Token Exchange Failed:", r.text)
                self.send_response(400)
                self.end_headers()
                self.wfile.write(f"Token Exchange Error: {r.text}".encode('utf-8'))
        else:
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Waiting for Google Drive OAuth redirect on port 8080...")

def main():
    print("==========================================================================")
    print("LOOPBACK OAUTH SERVER LISTENING ON PORT 8080")
    print("==========================================================================\n")
    server = HTTPServer(('localhost', 8080), LoopbackOAuthHandler)
    server.serve_forever()

if __name__ == "__main__":
    main()
