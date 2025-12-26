# Local HTTPS Setup for OAuth Testing

## 🔒 **Why HTTPS for Local Development?**

OpenStreetMap requires HTTPS for OAuth redirect URIs - even for localhost! This guide sets up HTTPS locally so you can test OAuth login.

---

## ✅ **Setup**

Docker and npm both use the Vite dev server with HTTPS for local development.

### **Option 1: Docker (Recommended for quick start)**

```bash
docker compose up -d
```

Runs on `https://localhost:3000` with auto-generated SSL certificate.

---

### **Option 2: Direct NPM**

```bash
npm run dev
```

Also runs on `https://localhost:3000` with auto-generated SSL certificate.

---

### **Step 2: Update OSM OAuth App**

Go to: https://www.openstreetmap.org/oauth2/applications

**Add this redirect URI for local testing:**
```
https://localhost:3000/#/oauth/callback
```

**Your app should now have TWO redirect URIs:**
1. `https://osm-submit.lishhhhmm.gr/#/oauth/callback` (production)
2. `https://localhost:3000/#/oauth/callback` (local testing)

---

### **Step 2: Start Dev Server**

```bash
npm run dev
```

Vite will automatically generate a self-signed SSL certificate and start HTTPS server.

---

### **Step 3: Accept Security Warning**

When you first visit `https://localhost:3000`:

**Chrome/Edge:**
1. You'll see "Your connection is not private"
2. Click **"Advanced"**
3. Click **"Proceed to localhost (unsafe)"**

**Firefox:**
1. You'll see "Warning: Potential Security Risk Ahead"
2. Click **"Advanced"**
3. Click **"Accept the Risk and Continue"**

**Safari:**
1. You'll see "This Connection Is Not Private"
2. Click **"Show Details"**
3. Click **"visit this website"**

---

### **Step 4: Test OAuth**

1. Go to `https://localhost:3000` ✅
2. Fill in POI form
3. Go to Review
4. Click "Login with OSM"
5. Should redirect to OSM ✅
6. Authorize
7. Should redirect back to `https://localhost:3000/#/oauth/callback` ✅
8. Login completes! 🎉

---

## 🔧 **How It Works:**

**vite.config.ts:**
```typescript
server: {
  port: 3000,
  host: '0.0.0.0',
  https: {
    // Vite auto-generates self-signed certificate
  }
}
```

**When you run `npm run dev`:**
1. Vite generates SSL certificate
2. Starts HTTPS server on port 3000
3. Server accessible at `https://localhost:3000`

---

## 📋 **URLs:**

| Environment | URL | OAuth Redirect |
|-------------|-----|----------------|
| **Local (HTTPS)** | `https://localhost:3000` | `https://localhost:3000/#/oauth/callback` |
| **Production** | `https://osm-submit.lishhhhmm.gr` | `https://osm-submit.lishhhhmm.gr/#/oauth/callback` |

---

## 🐛 **Troubleshooting:**

### **"ERR_CERT_AUTHORITY_INVALID"**
This is normal for self-signed certificates. Click "Advanced" → "Proceed to localhost"

### **"localhost refused to connect"**
Make sure dev server is running: `npm run dev`

### **OAuth redirect to HTTP instead of HTTPS**
OSM is using the wrong redirect URI. Check OSM app settings - make sure HTTPS version is listed.

### **"Invalid redirect_uri"**
The redirect URI in OSM settings must EXACTLY match:
- `https://localhost:3000/#/oauth/callback`
- Note the `#` and `https`

---

## 🎯 **Quick Start:**

```bash
# 1. Add https://localhost:3000/#/oauth/callback to OSM app
# 2. Start dev server
npm run dev

# 3. Open browser
https://localhost:3000

# 4. Accept security warning (once)
# 5. Test OAuth login!
```

---

## 💡 **Pro Tips:**

1. **Security warning is one-time** - Browser remembers your choice
2. **Certificate auto-generated** - No manual certificate creation needed
3. **Works in all browsers** - Chrome, Firefox, Safari, Edge
4. **Production uses real HTTPS** - This is only for local testing

---

## ✅ **Summary:**

- ✅ Vite auto-generates SSL certificate
- ✅ Local server runs on `https://localhost:3000`
- ✅ OAuth redirect works with HTTPS
- ✅ Can test full OAuth flow locally
- ✅ No complicated certificate setup needed

---

**You're all set! Start the dev server and test OAuth locally.** 🚀
