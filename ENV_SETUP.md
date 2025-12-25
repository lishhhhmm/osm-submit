# Environment Variables Setup

## 🔐 **Setting Up OAuth Credentials**

### **Step 1: Add to `.env.local`**

Your project already has `.env.local` - just add your OAuth credentials there!

Open `.env.local` and add:

```env
# Add these lines to .env.local
VITE_OSM_CLIENT_ID=abc123xyz789...
VITE_OSM_CLIENT_SECRET=
```

**Why `.env.local`?**
- ✅ Already exists in your project
- ✅ Already in `.gitignore` (won't be committed)
- ✅ Higher priority than `.env`
- ✅ Vite's standard for local secrets

---

### **Step 2: Get Your Credentials from OSM**

1. **Go to**: https://www.openstreetmap.org/oauth2/applications
2. **Find your app** or create a new one
3. **Copy the Client ID** - paste it after `VITE_OSM_CLIENT_ID=`
4. **Client Secret** (optional):
   - If you checked "Confidential application": copy and paste
   - If public client with PKCE (recommended): leave empty

---

### **Step 3: Restart Dev Server**

After adding credentials to `.env.local`:
```bash
npm run dev
```

Your OAuth login will now work!

---

## 📁 **File Structure**

### **`.env.local`** - Your Secrets (Already exists)
```env
# Add your actual credentials here:
VITE_OSM_CLIENT_ID=AbCd123XyZ789...
VITE_OSM_CLIENT_SECRET=

# Other local settings can go here too
```
- ✅ Your real credentials
- ✅ Already gitignored
- ✅ Only on your machine

### **`.env.example`** - Public Template (Committed to repo)
```env
# Shows what variables are needed:
VITE_OSM_CLIENT_ID=
VITE_OSM_CLIENT_SECRET=
```
- ✅ Safe to commit (no secrets)
- ✅ Template for other developers

---

## 🔒 **Security Notes**

- ✅ `.env.local` is in `.gitignore` - won't be committed
- ✅ `.env.example` is safe to commit (no secrets)
- ✅ Environment variables only work in your local build
- ✅ For production deployment, set env vars in your hosting platform

---

## 🚀 **For GitHub Pages Deployment**

Since GitHub Pages is static hosting, you'll need to:

1. **Option A**: Build locally with env vars, commit the built `dist` folder
2. **Option B**: Use GitHub Secrets in Actions workflow (already set up)

The workflow already supports env vars via secrets!

---

## 📝 **Production Deployment**

For GitHub Actions deployment, add secrets:

1. Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`
2. Click "New repository secret"
3. Add:
   - Name: `VITE_OSM_CLIENT_ID`
   - Value: Your client ID
4. The workflow will use it automatically!

---

## ⚠️ **Important**

- Never commit `.env.local` (already gitignored ✅)
- Never share your Client ID/Secret publicly
- Each environment (dev/prod) can use different OAuth apps
- Client Secret is optional for PKCE flow (recommended)

---

## 🎯 **Quick Start TL;DR:**

1. Open `.env.local` (already exists)
2. Add: `VITE_OSM_CLIENT_ID=your_client_id`
3. Save and restart: `npm run dev`
4. Done! 🚀
