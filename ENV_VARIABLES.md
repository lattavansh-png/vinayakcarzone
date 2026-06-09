# 🔐 Environment Variables for Vinayak Car Zone

Add these in **Netlify Dashboard → Site settings → Environment variables** (and in your local `.env`).

---

## ✅ REQUIRED (must be set, otherwise site won't work)

### 1. `JWT_SECRET`
**Purpose:** Secret key used to sign login tokens (JWT).
**Generate with this command** (run in your terminal):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Example value:** `a3f8b9c1d2e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0`

---

### 2. `ADMIN_EMAIL`
**Purpose:** Email used to log in to `/admin/login`. Auto-seeded into Netlify Blobs on first login attempt.
**Example value:** `admin@vinayakcarzone.in`

---

### 3. `ADMIN_PASSWORD`
**Purpose:** Password for the admin account. **Must be 8+ characters, strong.**
**Example value:** `Vinayak@2026!Secure`

---

### 4. `ADMIN_NAME` (optional, recommended)
**Purpose:** Display name shown in the admin dashboard.
**Example value:** `Admin` (or your name)

---

## 📨 OPTIONAL — Email Notifications (skip if you don't want emails)

If you skip these, bookings are **still saved** — you just won't get email alerts.

### 5. `SMTP_HOST`
**Purpose:** SMTP server address.
**Example values:** `smtp.gmail.com` (Gmail), `smtp.zoho.in` (Zoho), `smtp-mail.outlook.com` (Outlook)

### 6. `SMTP_PORT`
**Purpose:** SMTP port.
**Example value:** `587` (TLS) or `465` (SSL)

### 7. `SMTP_SECURE`
**Purpose:** `true` for SSL (port 465), `false` for TLS (port 587).
**Example value:** `false`

### 8. `SMTP_USER`
**Purpose:** Your SMTP username (usually your email).
**Example value:** `your-email@gmail.com`

### 9. `SMTP_PASS`
**Purpose:** Your SMTP password or app password.
**Example value:** `abcd efgh ijkl mnop` (Gmail App Password)

### 10. `SMTP_FROM_NAME`
**Purpose:** "From" name on outgoing emails.
**Example value:** `Vinayak Car Zone`

### 11. `SMTP_FROM_EMAIL`
**Purpose:** "From" email address.
**Example value:** `noreply@vinayakcarzone.in`

### 12. `ADMIN_NOTIFY_EMAIL`
**Purpose:** Email address that receives alerts for new bookings.
**Example value:** `helpdesk@vinayakcarzone.in`

---

## ⚙️ OPTIONAL — Misc Configuration

### 13. `FRONTEND_URL`
**Purpose:** Your site's public URL (used in email links).
**Example value:** `https://vinayakcarzone.netlify.app`
*(Set this AFTER your first deploy when you have the Netlify URL.)*

### 14. `RATE_LIMIT_WINDOW_MS`
**Purpose:** Time window (ms) for rate limiting bookings.
**Default:** `900000` (15 minutes)
**Example value:** `900000`

### 15. `RATE_LIMIT_MAX_REQUESTS`
**Purpose:** Max booking attempts per IP per window.
**Default:** `10`
**Example value:** `10`

### 16. `JWT_EXPIRES_IN`
**Purpose:** How long admin login tokens last.
**Default:** `7d` (7 days)
**Example value:** `7d`

---

## 🚀 Quick-Start (Copy-Paste These for First Deploy)

Set these **4 minimum values** in Netlify to get a working site:

| Key | Value |
|---|---|
| `JWT_SECRET` | *(generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)* |
| `ADMIN_EMAIL` | `admin@vinayakcarzone.in` |
| `ADMIN_PASSWORD` | `Vinayak@2026!Secure` |
| `ADMIN_NAME` | `Admin` |

Then add the email/SMTP variables **later** if you want email notifications.

---

## 📋 Setup Steps in Netlify Dashboard

1. Go to https://app.netlify.com
2. Select your site (or create one)
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"** → **"Add a single variable"**
5. For each variable above:
   - **Key:** the variable name (e.g., `JWT_SECRET`)
   - **Value:** the value
   - **Scopes:** leave as "All scopes" (default)
6. Click **"Create variable"**
7. Repeat for all required variables
8. **Trigger a new deploy** for the changes to take effect
   - Go to **Deploys** → **Trigger deploy** → **Deploy site**

---

## 🧪 Test Checklist After Setting Variables

- [ ] Visit `https://your-site.netlify.app/` — homepage loads
- [ ] Submit a test booking — you get a tracking ID
- [ ] Go to `https://your-site.netlify.app/admin/login`
- [ ] Log in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- [ ] Dashboard shows your test booking
- [ ] (If SMTP set) — you receive booking emails

---

## ⚠️ Security Notes

- **NEVER** commit your `.env` file to GitHub
- **NEVER** share your `JWT_SECRET` or `ADMIN_PASSWORD` publicly
- Use a **strong, unique** `JWT_SECRET` (at least 32 characters)
- Change `ADMIN_PASSWORD` regularly
- Use **Gmail App Passwords** (not your real Gmail password) for SMTP
