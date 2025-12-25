# OAuth 2.0 Implementation - Setup Guide

## ✅ **What's Been Implemented**

I've created a complete OAuth 2.0 authentication system with PKCE for your OSM Submit app!

---

## 📁 **New Files Created**

### 1. **services/oauthService.ts**
OAuth service handling PKCE flow (login, callback, token exchange)

### 2. **pages/OAuthCallback.tsx**
Callback page that handles OAuth redirect from OSM

### 3. **components/UserInfo.tsx**
User component showing logged-in user or login button

### 4. **components/ReviewSubmit.tsx** (Updated)
- Removed manual token input
- Added UserInfo component
- Added login requirement warning

---

## 🔧 **Required Setup Steps**

### **Step 1: Register Your App on OSM**

#### **For Development (Sandbox):**
1. Go to: https://master.apis.dev.openstreet map.org/user/{your_username}/oauth2_applications
2. Click "Register New Application"
3. Fill in:
   - **Name**: OSM Submit (Dev)
   - **Redirect URIs**: `http://localhost:5173/oauth/callback`
   - **Scopes**: Select `read_prefs` and `write_api`
4. Save and copy the **Client ID**

#### **For Production:**
1. Go to: https://www.openstreetmap.org/oauth2/applications
2. Click "Register New Application"
3. Fill in:
   - **Name**: OSM Submit
   - **Redirect URIs**: `https://yourdomain.com/oauth/callback` (your actual domain)
   - **Scopes**: Select `read_prefs` and `write_api`
4. Save and copy the **Client ID**

### **Step 2: Update Client ID**

Edit `services/oauthService.ts` line 7:
```typescript
// Replace this:
CLIENT_ID: 'YOUR_CLIENT_ID_HERE',

// With your actual client ID:
CLIENT_ID: 'abc123...', // Your client ID from OSM
```

### **Step 3: Setup Routing for Callback**

You need to add routing for `/oauth/callback`. The method depends on your setup:

#### **Option A: Using React Router** (Recommended if not already using a router)

Install React Router:
```bash
npm install react-router-dom
```

Update `main.tsx`:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import OAuthCallback from './pages/OAuthCallback';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
```

#### **Option B: Using Hash Router** (If GitHub Pages deployment)

Since you're using GitHub Pages, hash routing is simpler:

Update `main.tsx`:
```typescript
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import OAuthCallback from './pages/OAuthCallback';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
```

**Then update redirect URI to:**
- Dev: `http://localhost:5173/#/oauth/callback`
- Prod: `https://yourdomain.com/#/oauth/callback`

---

## 🚀 **How It Works**

### **User Flow:**

```
1. User opens app
2. Clicks "Login with OSM" button
3. Redirects to OpenStreetMap website
4. User logs in (if not logged in)
5. OSM shows permission screen: "OSM Submit wants to:"
   - Read your preferences
   - Modify the map
6. User clicks "Authorize"
7. OSM redirects back to /oauth/callback?code=...
8. Callback page exchanges code for token
9. Token stored in localStorage
10. Redirects back to main app
11. User sees their name/avatar
12. Submit button now enabled!
```

### **Technical Flow:**

```typescript
// 1. Start login
startOAuthLogin('dev') // or 'prod'
  → Generates PKCE codes
  → Stores in localStorage
  → Redirects to OSM

// 2. OSM redirects back
/oauth/callback?code=ABC&state=XYZ
  → OAuthCallback component loads
  → Calls handleOAuthCallback(code, state)
  → Exchanges code for access token using PKCE verifier
  → Stores token
  → Fetches user details
  → Redirects to /

// 3. Main app
App loads → UserInfo component
  → Checks isLoggedIn()
  → If yes: Shows user avatar/name
  → If no: Shows "Login with OSM" button
```

---

## 🎨 **UI Changes**

### **Before:**
```
┌─────────────────────────────────┐
│ OAuth Token                     │
│ ┌─────────────────────────────┐ │
│ │ Paste token here... [password]│ │
│ └─────────────────────────────┘ │
│ 🔒 Securely cached              │
└─────────────────────────────────┘
```

### **After - Not Logged In:**
```
┌─────────────────────────────────┐
│ Authentication                  │
│ ┌─────────────────────────────┐ │
│ │ 🔓 Login with OSM           │ │
│ └─────────────────────────────┘ │
│ ⚠️ Please log in to submit     │
└─────────────────────────────────┘
```

### **After - Logged In:**
```
┌─────────────────────────────────┐
│ Authentication                  │
│ ┌─────────────────────────────┐ │
│ │ 👤 John Doe      🚪 Logout  │ │
│ │    Sandbox                  │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## 🔒 **Security Features**

✅ **PKCE (Proof Key for Code Exchange)**
- Prevents authorization code interception
- No client secret needed
- Secure for SPAs

✅ **State Parameter**
- CSRF protection
- Verifies callback authenticity

✅ **Token Storage**
- Stored in localStorage
- Domain-scoped security
- Auto-loaded on page load

✅ **Proper Scopes**
- Only requests needed permissions
- Users can see what app can do

---

## 📋 **Environment Variables (Optional)**

Create `.env` for client ID:
```env
VITE_OSM_CLIENT_ID=your_client_id_here
```

Then update `oauthService.ts`:
```typescript
CLIENT_ID: import.meta.env.VITE_OSM_CLIENT_ID || 'YOUR_CLIENT_ID_HERE',
```

---

## ✅ **Testing Checklist**

### **Local Development:**
- [ ] Registered dev app on OSM
- [ ] Added client ID to code
- [ ] Set redirect URI: `http://localhost:5173/oauth/callback` (or `/#/oauth/callback`)
- [ ] Added routing for callback
- [ ] Run `npm run dev`
- [ ] Click "Login with OSM"
- [ ] Redirects to OSM
- [ ] Log in and authorize
- [ ] Redirects back
- [ ] See your name/avatar
- [ ] Submit button enabled

### **Production Deployment:**
- [ ] Registered prod app on OSM
- [ ] Updated client ID (or use same for both)
- [ ] Set redirect URI: `https://yourdomain.com/oauth/callback`
- [ ] Deploy to production
- [ ] Test login flow
- [ ] Test submission

---

## 🐛 **Troubleshooting**

### **"Invalid redirect_uri"**
→ Make sure redirect URI in code exactly matches OSM app settings
→ Check for trailing slashes

### **"Invalid client_id"**
→ Check CLIENT_ID in `oauthService.ts`
→ Make sure you copied it correctly from OSM

### **Callback page shows 404**
→ Add routing for `/oauth/callback`
→ Or use hash router: `/#/oauth/callback`

### **Token exchange fails**
→ Check browser console for errors
→ Verify PKCE code_verifier is stored before redirect
→ Check network tab for token endpoint response

### **User info not showing**
→ Check browser console for API errors
→ Verify token is valid
→ Check network tab for user details response

---

## 🎉 **Result**

Your app now has:
- ✅ Professional OSM login
- ✅ No manual token copying
- ✅ User avatars and names
- ✅ Proper attribution in changesets
- ✅ Security best practices
- ✅ OSM-compliant authentication

Users will love the smooth "Login with OSM" experience! 🚀
