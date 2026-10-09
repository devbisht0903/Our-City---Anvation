"""
OurCity Local Web Server
Runs the 4-Interface OurCity Platform on http://localhost:8000
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

PORT = 8000
DIRECTORY = Path(__file__).parent.resolve()

class CivicSightHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def main():
    os.chdir(str(DIRECTORY))
    with socketserver.TCPServer(("", PORT), CivicSightHandler) as httpd:
        print("=" * 65)
        print("OurCity Web Application Live at:")
        print(f"    -> http://localhost:{PORT}")
        print("=" * 65)
        print("Press Ctrl+C to stop the server.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()

if __name__ == '__main__':
    main()
