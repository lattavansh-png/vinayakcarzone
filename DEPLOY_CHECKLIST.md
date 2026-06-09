# 📋 Netlify Deployment Checklist

## Phase 1: Pre-Deployment (5-10 min)
- [ ] Make sure all your code is committed to Git
- [ ] Run `npm install` in the root folder
- [ ] Run `npm run build` to verify the frontend builds without errors
- [ ] Verify `netlify.toml` is in the project root
- [ ] Verify `netlify/functions/api.js` exists
- [ ] Verify `.netlifyignore` excludes the `server/` folder

## Phase 2: Push to GitHub (5 min)
- [ ] Create a GitHub repository (e.g., `vinayak-car-zone`)
- [ ] Run `git init` (if not already done)
- [ ] Run `git add .`
- [ ] Run `git commit -m "initial commit"`
- [ ] Run `git branch -M main`
- [ ] Run `git remote add origin https://github.com/<your-username>/vinayak-car-zone.git`
- [ ] Run `git push -u origin main`

## Phase 3: Connect to Netlify (5 min)
- [ ] Go to https://app.netlify.com
- [ ] Click **Add new site** → **Import an existing project**
- [ ] Select **GitHub** and authorize
- [ ] Choose your `vinayak-car-zone` repository
- [ ] Netlify will auto-detect settings from `netlify.toml`:
  - Build command: `npm run build`
  - Publish directory: `dist`

## Phase 4: Set Environment Variables (3 min)
- [ ] In Netlify → **Site settings** → **Environment variables**, add:
  - [ ] `JWT_SECRET` = a long random string
  - [ ] `ADMIN_EMAIL` = your admin email
  - [ ] `ADMIN_PASSWORD` = a strong password (8+ chars)
  - [ ] `ADMIN_NAME` = (optional) "Admin"
- [ ] (Optional) Add SMTP variables if you want email notifications:
  - [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
  - [ ] `SMTP_FROM_NAME`, `SMTP_FROM_EMAIL`
  - [ ] `ADMIN_NOTIFY_EMAIL`

## Phase 5: Deploy (1-2 min)
- [ ] Click **Deploy site**
- [ ] Wait for the build to finish
- [ ] Copy your Netlify URL (e.g., `https://vinayak-car-zone.netlify.app`)

## Phase 6: Verify (5 min)
- [ ] Open the Netlify URL in your browser
- [ ] Verify the homepage loads correctly
- [ ] Test the booking form — submit a test appointment
- [ ] Confirm you get a tracking ID
- [ ] Go to `<your-netlify-url>/admin/login`
- [ ] Log in with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- [ ] Verify the dashboard shows your test booking

## Phase 7: Custom Domain (Optional)
- [ ] In Netlify → **Domain settings** → **Add custom domain**
- [ ] Follow DNS configuration instructions
- [ ] Update `FRONTEND_URL` env var to your custom domain

## 🎉 Done!
Your site is now live with:
- ✅ Frontend (React/Vite)
- ✅ Backend (Netlify Functions)
- ✅ Database (Netlify Blobs)
- ✅ Admin dashboard
- ✅ All on Netlify (no external services needed)
