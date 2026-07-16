Publish instructions
====================

Quick: this helps you publish the project to GitHub and deploy on Railway without typing many commands.

Prerequisites (choose one automation path):
- Option A (recommended): install GitHub CLI (`gh`) and Railway CLI (`railway`). Login with `gh auth login` and `railway login`.
- Option B: Use the GitHub web UI to upload the project (Add file → Upload files) and deploy from Railway web UI.

Automated script
- Run `publish.bat` in this folder. It will:
  1. Verify `git` and `gh` are available.
  2. Ask for a repo name and create the GitHub repo, push the code.
  3. If `railway` CLI is available, optionally run `railway up` to deploy.

Manual fallback (if you cannot install CLI):
1. Create a repo on GitHub and upload project files (do not upload `ngrok.exe`).
2. On Railway: New Project → Deploy from GitHub → select the repo.
3. Wait for build; open the Railway URL, then visit `/donor.html` and `/overlay.html`.

Testing the deployed app
------------------------
Use this curl command (replace `PUBLIC_URL`):

```bash
curl -X POST https://PUBLIC_URL/api/donations \
  -H "Content-Type: application/json" \
  -d '{"name":"Tester","amount":10000,"message":"Coba deploy","method":"QRIS"}'
```

If successful, you should get a JSON success response and see the overlay update.
