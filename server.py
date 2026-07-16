import json
import os
import socket
import time
import urllib.parse
from http.server import SimpleHTTPRequestHandler, HTTPServer

PORT = 3000
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(ROOT_DIR, "donations.json")


def read_donations():
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def save_donations(donations):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(donations, f, indent=2, ensure_ascii=False)


def get_local_ips():
    ips = []
    for family, _, _, _, sockaddr in socket.getaddrinfo(socket.gethostname(), None):
        if family == socket.AF_INET:
            ip = sockaddr[0]
            if not ip.startswith("127.") and ip not in ips:
                ips.append(ip)

    if not ips:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
                s.connect(("8.8.8.8", 80))
                ip = s.getsockname()[0]
                if ip not in ips:
                    ips.append(ip)
        except Exception:
            pass

    return ips


class DonationServer(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/info":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            data = {"addresses": get_local_ips(), "host": socket.gethostname()}
            self.wfile.write(json.dumps(data).encode("utf-8"))
            return

        if parsed.path == "/api/donations":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            donations = read_donations()
            self.wfile.write(json.dumps(donations).encode("utf-8"))
            return

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path != "/api/donations":
            self.send_error(404, "Not found")
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8")
        try:
            donation = json.loads(body)
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
            return

        donations = read_donations()
        donations.insert(0, {**donation, "createdAt": donation.get("createdAt", int(time.time() * 1000))})
        save_donations(donations)

        self.send_response(201)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps({"success": True}).encode("utf-8"))

    def log_message(self, format, *args):
        print("[Server] %s - - %s" % (self.client_address[0], format % args))


def run():
    os.chdir(ROOT_DIR)
    server_address = ("0.0.0.0", PORT)
    httpd = HTTPServer(server_address, DonationServer)
    print(f"Server berjalan di http://0.0.0.0:{PORT}")
    print("Buka owner.html di browser streamer dan bagikan link donor HTML ke device lain di jaringan lokal.")
    httpd.serve_forever()


if __name__ == "__main__":
    run()
