# 🧪 Testing Guide - Vinayak Car Zone Backend

## ⚠️ Important: PowerShell Execution Policy Issue

Your system has PowerShell scripts disabled. You need to run npm commands using one of these methods:

### Method 1: Use CMD instead of PowerShell
```cmd
cd "C:\Users\hp\OneDrive\Desktop\vinayak car zone\server"
npm install
```

### Method 2: Enable PowerShell Scripts (One-time)
Run PowerShell **as Administrator**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then you can use npm normally.

### Method 3: Use the Batch File
Double-click `start-dev.bat` in the project root (this is already a .bat file that works)

---

## 📋 Complete Testing Steps

### **Step 1: Install Backend Dependencies**
```cmd
cd "C:\Users\hp\OneDrive\Desktop\vinayak car zone\server"
npm install
```

You should see something like:
```
added 150 packages in 30s
```

### **Step 2: Set Up MongoDB Atlas (Required)**

**Option A: Use MongoDB Atlas (Cloud - Free)**
1. Go to https://mongodb.com/atlas
2. Sign up for free account
3. Create a free M0 cluster
4. Create database user:
   - Username: `vczadmin`
   - Password: (generate strong one, save it)
5. Whitelist IP:
   - Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
6. Get connection string:
   - Click "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials

**Option B: Use Local MongoDB (If Installed)**
```
MONGODB_URI=mongodb://localhost:27017/vinayak_car_zone
```

### **Step 3: Create `.env` File**

In the `server` folder, create a file named `.env` (NOT `.env.example`):

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB (paste YOUR connection string)
MONGODB_URI=mongodb+srv://vczadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/vinayak_car_zone?retryWrites=true&w=majority

# JWT (any random string 32+ chars)
JWT_SECRET=my_super_secret_jwt_key_change_this_to_something_random_and_long_12345

# Admin
ADMIN_EMAIL=admin@vinayakcarzone.in
ADMIN_PASSWORD=Admin@123456
ADMIN_NAME=Admin

# Frontend
FRONTEND_URL=http://localhost:5173
```

### **Step 4: Seed Admin User**
```cmd
npm run seed:admin
```

Expected output:
```
✅ Connected to MongoDB
✅ Admin created successfully!
   Name: Admin
   Email: admin@vinayakcarzone.in
   Role: super-admin
🚀 You can now log in at POST /api/admin/login
```

### **Step 5: Start the Server**
```cmd
npm run dev
```

Expected output:
```
✅ MongoDB Connected: cluster0-shard-00-02.xxxxx.mongodb.net
🚀 Server running in development mode on port 5000
📍 Health check: http://localhost:5000/api/health
```

**Keep this terminal open!**

### **Step 6: Test Health Check**

Open a NEW terminal and run:
```cmd
curl http://localhost:5000/api/health
```

Or open in browser: http://localhost:5000/api/health

Expected response:
```json
{
  "success": true,
  "message": "Vinayak Car Zone API is running",
  "timestamp": "2026-06-04T..."
}
```

### **Step 7: Test Admin Login**
```cmd
curl -X POST http://localhost:5000/api/admin/login -H "Content-Type: application/json" -d "{\"email\":\"admin@vinayakcarzone.in\",\"password\":\"Admin@123456\"}"
```

Expected:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "...",
      "name": "Admin",
      "email": "admin@vinayakcarzone.in",
      "role": "super-admin"
    }
  }
}
```

**Save the token!** You'll need it for next tests.

### **Step 8: Test Create Appointment (No Auth Required)**
```cmd
curl -X POST http://localhost:5000/api/appointments -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"9876543210\",\"serviceType\":\"general-service\",\"preferredDate\":\"2026-12-31\",\"preferredTime\":\"10:00 AM - 12:00 PM\"}"
```

Expected:
```json
{
  "success": true,
  "message": "Appointment booked successfully!...",
  "data": {
    "id": "...",
    "trackingId": "VCZ-20260604-001",
    "status": "pending"
  }
}
```

### **Step 9: Test Get All Appointments (Requires Auth)**

Replace `YOUR_TOKEN_HERE` with the token from Step 7:
```cmd
curl http://localhost:5000/api/appointments/admin/all -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected: List of all appointments including the one you just created.

### **Step 10: Test the Frontend**

1. In a NEW terminal, start the frontend:
```cmd
cd "C:\Users\hp\OneDrive\Desktop\vinayak car zone"
npm run dev
```

2. Open browser: http://localhost:5173/book

3. Fill the form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 9876543210
   - Service: General Service
   - Date: Pick a future date
   - Time: Pick a slot
   - Submit!

4. You should see a **success message with Tracking ID** 🎉

5. Check MongoDB Atlas → Browse Collections → `appointments` → Your data is there!

---

## 🐛 Troubleshooting

### Error: "npm.ps1 cannot be loaded"
Use CMD instead of PowerShell, or run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "MongooseServerSelectionError"
- Check your `MONGODB_URI` in `.env`
- Make sure you whitelisted `0.0.0.0/0` in MongoDB Atlas
- Wait 1-2 minutes after creating cluster (it takes time to provision)

### Error: "EADDRINUSE: port 5000 already in use"
Change `PORT=5001` in `.env`

### Error: "Validation failed: email: Invalid email"
Make sure email is in proper format: `user@domain.com`

### Error: "Rate limit exceeded"
Wait 15 minutes or change `RATE_LIMIT_MAX_REQUESTS` in `.env`

### Error: "CORS policy" in browser
Make sure `FRONTEND_URL` in `server/.env` matches your frontend URL (http://localhost:5173)

---

## ✅ Success Checklist

- [ ] `npm install` completed without errors
- [ ] MongoDB Atlas cluster created and connected
- [ ] `.env` file created with all required variables
- [ ] `npm run seed:admin` created the admin user
- [ ] `npm run dev` started the server on port 5000
- [ ] Health check returns success
- [ ] Admin login returns a JWT token
- [ ] Creating an appointment returns a tracking ID
- [ ] Frontend form submits and shows success message
- [ ] Appointment visible in MongoDB Atlas

---

## 🎉 All Working?

If all steps pass, your backend is **fully functional**! 

**Next steps:**
1. Deploy to Render/Railway (free)
2. Build admin dashboard UI
3. Enable email notifications
4. Add more features (SMS, payment, etc.)

Let me know which step you're stuck on and I'll help! 🚀
