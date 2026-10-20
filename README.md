# why-i-want-a-switch-2

A tiny, Unkey-styled app making the case for why I should win a Nintendo Switch 2 at All Things Open 2026.

- Zero dependencies: plain Node `http` server (`server.js`) plus one static page (`public/index.html`)
- Endpoints: `/` (the page), `/health`, `/api/reasons`, `/api/reasons/random`
- Unkey-ready: listens on `$PORT` (default 8080), handles `SIGTERM`, never writes to disk

## Run locally

```sh
node server.js            # http://localhost:8080
# or
docker build -t switch-2 . && docker run -p 8080:8080 switch-2
```

## Deploy to Unkey Compute

Contest entry: deploy, then submit the live URL, your Workspace ID (`ws_...`, from the dashboard), a short description, name and email at https://www.unkey.com/all-things-open before Fri Oct 23, 2026, 11:59pm ET.

Option A — from GitHub (easiest, no terminal):

1. Sign in at https://app.unkey.com and create a project.
2. Connect this GitHub repo. Unkey builds the included `Dockerfile` automatically.
3. Keep the port at `8080`. Deploy, then copy the live URL.

Option B — from the CLI (needs Docker and a root key):

```sh
docker build -t ghcr.io/<you>/switch-2:v1 . && docker push ghcr.io/<you>/switch-2:v1
unkey deploy ghcr.io/<you>/switch-2:v1 --project <your-project> --root-key $UNKEY_ROOT_KEY
```
