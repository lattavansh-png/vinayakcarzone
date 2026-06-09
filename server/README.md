# 🚀 Vinayak Car Zone - Backend API

Backend API for the **Book Appointments** feature, built with **Node.js + Express + MongoDB**.

## 📋 Features

- ✅ Public appointment booking with validation
- ✅ Admin authentication (JWT + bcrypt)
- ✅ Admin dashboard with stats & filters
- ✅ Email notifications (customer + admin)
- ✅ Rate limiting (anti-spam)
- ✅ Security: Helmet, CORS, sanitization
- ✅ Pagination, search, status management
- ✅ Auto-generated tracking IDs (VCZ-YYYYMMDD-XXX)

---

## 🛠️ Tech Stack

Node.js 18+ • Express 4 • MongoDB (Mongoose) • Zod (validation) • JWT • Nodemailer

---

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your values
```

**Required in `.env`:**
- `MONGODB_URI` - Get free at [mongodb.com/atlas](https://mongodb.com/atlas)
- `JWT_SECRET` - Any long random string (32+ chars)
- `ADMIN_EMAIL` & `ADMIN_PASSWORD` - For admin login
- `SMTP_*` - Optional, for email (Gmail App Password works)

### 3. Set Up Free MongoDB Atlas
1. Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free M0 cluster
3. Create database user (username + password)
4. Whitelist IP: `0.0.0.0/0` (for development)
5. Click "Connect" → "Connect your application" → Copy connection string
6. Paste into `.env` as `MONGODB_URI`

### 4. Seed First Admin User
```bash
npm run seed:admin
```

### 5. Start Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## 📡 API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/appointments` | Create new appointment |
| `GET` | `/api/appointments/:id` | Track appointment (by tracking ID) |
| `GET` | `/api/health` | Health check |

### Admin (require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Admin login (returns JWT) |
| `GET` | `/api/admin/me` | Get current admin |
| `GET` | `/api/appointments/admin/all?status=&page=&search=` | List all appointments |
| `GET` | `/api/appointments/admin/:id` | Get single appointment |
| `PATCH` | `/api/appointments/admin/:id` | Update status |
| `DELETE` | `/api/appointments/admin/:id` | Delete (super-admin only) |
| `GET` | `/api/appointments/admin/stats` | Dashboard statistics |
| `POST` | `/api/admin/logout` | Logout |
| `PATCH` | `/api/admin/change-password` | Change password |

---

## 📝 API Examples

### Create Appointment
```http
POST http://localhost:5000/api/appointments
Content-Type: application/json

{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "9876543210",
  "serviceType": "ac-service",
  "preferredDate": "2026-07-15",
  "preferredTime": "10:00 AM - 12:00 PM",
  "vehicleNumber": "RJ20AB1234",
  "vehicleModel": "Honda City",
  "notes": "AC not cooling"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment booked successfully!",
  "data": {
    "id": "...",
    "trackingId": "VCZ-20260715-001",
    "status": "pending"
  }
}
```

### Admin Login
```http
POST http://localhost:5000/api/admin/login
Content-Type: application/json

{
  "email": "admin@vinayakcarzone.in",
  "password": "YourPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": { "id": "...", "name": "Admin", "email": "...", "role": "super-admin" }
  }
}
```

### Authenticated Request
```http
GET http://localhost:5000/api/appointments/admin/all?status=pending
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   ├── appointmentController.js  # Appointment logic
│   └── authController.js         # Auth logic
├── middleware/
│   ├── auth.js                  # JWT protection
│   ├── errorHandler.js          # Global error handler
│   └── validate.js              # Zod schemas
├── models/
│   ├── Admin.js                 # Admin user schema
│   └── Appointment.js           # Appointment schema
├── routes/
│   ├── appointments.js          # Appointment routes
│   └── auth.js                  # Auth routes
├── services/
│   └── emailService.js          # Nodemailer emails
├── utils/
│   └── seedAdmin.js             # Create first admin
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js                    # Entry point
```

---

## 🔒 Security Features

- **Helmet** - Sets secure HTTP headers
- **CORS** - Only allows requests from your frontend URL
- **Rate Limiting** - Max 10 booking requests per 15 minutes per IP
- **JWT** - Tokens expire in 7 days (configurable)
- **bcrypt** - Passwords hashed with 12 salt rounds
- **Zod** - Strict input validation & sanitization
- **Environment Variables** - All secrets in `.env` (gitignored)

---

## 🧪 Testing with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Create appointment
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "serviceType": "general-service",
    "preferredDate": "2026-12-31"
  }'

# Admin login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vinayakcarzone.in",
    "password": "YourPassword123"
  }'

# Get all appointments (use token from login)
curl http://localhost:5000/api/appointments/admin/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🚀 Deployment

### Free Hosting Options

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Render** | 750 hrs/month | Easy deploy from GitHub |
| **Railway** | $5 credit/month | Auto-detects Node.js |
| **Vercel** | Serverless functions | Best for low traffic |
| **Cyclic** | Unlimited | Free Node.js hosting |

### Deploy to Render (Recommended)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect repo, set root directory to `server`
4. Build: `npm install` | Start: `npm start`
5. Add environment variables from `.env`
6. Deploy! 🎉

---

## 📧 Gmail SMTP Setup (Optional)

1. Enable 2-Factor Authentication on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Generate an "App Password" for "Mail"
4. Use in `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

---

## 🤝 Connect Frontend

In your React app, point API calls to:
```js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

Add to your frontend `.env`:
```
VITE_API_URL=http://localhost:5000
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| `MongooseServerSelectionError` | Check `MONGODB_URI` in `.env` and whitelist your IP in Atlas |
| `Email not sending` | Verify SMTP credentials; check Gmail App Password |
| `401 Unauthorized` | Token expired/missing; re-login |
| `Rate limit exceeded` | Wait 15 min or change `RATE_LIMIT_MAX_REQUESTS` |
| `CORS error` | Add your frontend URL to `FRONTEND_URL` in `.env` |

---

## 📜 License

MIT © Vinayak Car Zone

---

**Built with ❤️ for Vinayak Car Zone**
