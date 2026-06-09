# 🚀 Deploying Vinayak Car Zone — Netlify only

The project is a **React (Vite) frontend** + an **API backend**.
Both run on Netlify: the frontend is served as a static site, the
backend is a single serverless function (`netlify/functions/api.js`)
that uses **Netlify Blobs** for persistent storage. There is no
external database, no other cloud — just Netlify.

---

## 1. Push the project to GitHub

```bash
git init
git add .
git commit -m "initial"
git branch -M main
git remote add origin https://github.com/<you>/vinayak-car-zone.git
git push -u origin main
```

## 2. Create the Netlify site

1. Go to <https://app.netlify.com> → **Add new site** → **Import an existing project** → GitHub → pick the repo.
2. Netlify reads `netlify.toml` and pre‑fills:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. In **Environment variables**, add at minimum:

   | Key             | Value                                                                                    |
   |-----------------|------------------------------------------------------------------------------------------|
   | `JWT_SECRET`    | a long random string (e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `ADMIN_EMAIL`   | the email you'll use to log into `/admin/login`                                          |
   | `ADMIN_PASSWORD`| a strong password (8+ characters)                                                       |
   | `ADMIN_NAME`    | (optional) display name, defaults to `Admin`                                             |

   Optional (only if you want booking emails):

   | Key | Value |
   |---|---|
   | `SMTP_HOST` `SMTP_PORT` `SMTP_SECURE` `SMTP_USER` `SMTP_PASS` | your SMTP provider details |
   | `SMTP_FROM_NAME` `SMTP_FROM_EMAIL` | sender info |
   | `ADMIN_NOTIFY_EMAIL` | where new-booking alerts are sent |

4. Click **Deploy site**. After ~1 minute you'll get a URL like
   `https://vinayak-car-zone.netlify.app`.

That's it — frontend, backend, and database are all on Netlify.

## 3. Verify

- Open the Netlify URL in your browser.
- Submit a test booking — you'll get a tracking ID.
- Go to `<netlify-url>/admin/login` and sign in with the `ADMIN_EMAIL`
  / `ADMIN_PASSWORD` you set as env vars. The admin is **auto-seeded**
  into Netlify Blobs the first time the login endpoint is hit.
- The dashboard should show your test booking.

> The first booking after a fresh deploy may take ~1 s longer because
> the function cold-starts and the admin seed runs in the background.

## 4. Custom domain (optional)

- **Netlify → Domain settings → Add custom domain** — follow the
  DNS instructions. Update the `FRONTEND_URL` env var to your
  custom domain so email links point to the right place.

## 5. How the pieces fit together

```
Browser ──►  Netlify Edge
              ├── static site (Vite build in /dist)
              └── /api/*  →  /.netlify/functions/api  →  _lib/router.js
                                                  ├── _lib/store.js     (Netlify Blobs)
                                                  ├── _lib/auth.js      (JWT + Web Crypto)
                                                  ├── _lib/validate.js  (request validation)
                                                  └── _lib/emailService.js (nodemailer, optional)
```

- `netlify.toml` redirects `/api/*` to the function with `force = true`,
  so the SPA's wildcard `/index.html` redirect never catches API calls.
- Netlify Blobs stores three things:
  - `appointments` — one blob per appointment
  - `admins` — one blob per admin (seeded from env vars)
  - `rate_limits` — per-IP booking counter
  - `counters` — daily tracking-id counter

## 6. Local development

```bash
# install deps once
npm install

# copy env template, edit it
cp .env.example .env
# edit .env and set JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# start everything (frontend + function) on http://localhost:8888
start-dev.bat
# or
npx netlify dev
```

`netlify dev` proxies `/api/*` to the serverless function with the
same handler it uses in production, so local behavior matches prod.

If you'd rather use plain Vite (`npm run dev`), `vite.config.js` also
proxies `/api` to `http://localhost:8888` — start `netlify dev` in
one terminal and `vite` in another.

## 7. Troubleshooting

| Symptom                                  | Fix                                                                                                |
|------------------------------------------|----------------------------------------------------------------------------------------------------|
| `404` on `/admin/dashboard` after refresh| Make sure `netlify.toml` is in the repo root — the wildcard `/*` → `/index.html` redirect handles this. |
| Login fails with "Invalid email or password" | `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars are not set on Netlify. Re-deploy after adding them. |
| `Network error` on the booking form      | Open the browser devtools → Network tab and check the failing request. The most common cause is a typo in env vars or a failed cold start. |
| CORS error in browser console            | Should not happen in production (frontend and API are same-origin). Only appears if you set `VITE_API_URL` to a different host. |
| `500` on booking submit                  | Check the Netlify function logs (Netlify dashboard → Functions → api → Logs).                       |
| Emails not arriving                      | `SMTP_*` env vars are missing or wrong. Test locally with `netlify dev` and the same vars.         |

---

## What changed from the old split-hosting setup?

| Old (frontend on Netlify, backend on Render) | New (everything on Netlify)               |
|----------------------------------------------|--------------------------------------------|
| Express + Mongoose on Render                 | Single serverless function on Netlify     |
| MongoDB Atlas                                | Netlify Blobs (built-in)                  |
| `VITE_API_URL` pointing at Render            | Same-origin; `VITE_API_URL` is optional   |
| `server/` folder with its own `package.json` | Removed from build via `.netlifyignore`   |
| `start-dev.bat` ran two processes            | `start-dev.bat` runs `netlify dev` only   |
| `render.yaml`                                | No longer needed (you can delete it)      |
