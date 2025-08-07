# How to Install Node.js and Run the Backend

## 🚀 Quick Solution

**For immediate testing without Node.js:**
1. Open `simple-version.html` in your browser
2. Click "View Details" buttons to see product details
3. This works without any installation!

## 📥 Installing Node.js

### Step 1: Download Node.js
1. Go to https://nodejs.org/
2. Download the **LTS version** (recommended)
3. Run the installer and follow the setup wizard

### Step 2: Verify Installation
Open Command Prompt or PowerShell and run:
```bash
node --version
npm --version
```

You should see version numbers like:
```
v18.17.0
9.6.7
```

## 🛠️ Running the Full Backend

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Install MongoDB
1. Go to https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server
3. Install with default settings
4. Start MongoDB service

### Step 3: Seed the Database
```bash
npm run seed
```

### Step 4: Start the Server
```bash
npm start
```

### Step 5: Access the Website
- Open http://localhost:3000 in your browser
- Click "View Details" buttons to see product details
- Login with admin@techmart.com / admin123

## 🔧 Alternative: Use the Simple Version

If you don't want to install Node.js right now:

1. **Open `simple-version.html`** in your browser
2. **Click "View Details"** on any product
3. **See full product details** with specifications
4. **Works immediately** - no installation needed!

## 📋 What Each File Does

- **`simple-version.html`** - Standalone version (works without backend)
- **`index.html`** - Full version (needs backend)
- **`server.js`** - Backend API server
- **`seed.js`** - Database seeding script
- **`package.json`** - Project dependencies

## 🎯 Features Available

### Simple Version (no installation):
- ✅ Product catalog
- ✅ Product details modal
- ✅ Specifications display
- ✅ Responsive design
- ✅ Real images from Unsplash

### Full Version (with Node.js):
- ✅ User authentication
- ✅ Shopping cart
- ✅ Admin panel
- ✅ Database storage
- ✅ API endpoints
- ✅ File uploads

## 🚨 Troubleshooting

### If Node.js is not recognized:
1. Restart your computer after installation
2. Check if Node.js is in your PATH
3. Try running as administrator

### If MongoDB fails to connect:
1. Make sure MongoDB service is running
2. Check if port 27017 is available
3. Try using MongoDB Atlas (cloud version)

### If images don't load:
1. Check your internet connection
2. Images are loaded from Unsplash CDN
3. Fallback images will show if needed

## 📞 Need Help?

1. **Try the simple version first** - `simple-version.html`
2. **Install Node.js** if you want the full features
3. **Follow the setup guide** step by step
4. **Check the console** for error messages

---

**Quick Start:** Open `simple-version.html` in your browser to see the working website immediately! 🎉 