# OSM OAuth 2.0 Requirements - Current Status & Next Steps

## ⚠️ **CRITICAL: Current Implementation is Outdated**

Our current approach of **manually entering OAuth tokens is NOT the proper way** to authenticate with OSM as of 2024.

---

## 📋 **What Changed in 2024**

### **July 1, 2024 - Major Change:**
- ❌ **HTTP Basic Auth** - REMOVED
- ❌ **OAuth 1.0a** - REMOVED  
- ✅ **OAuth 2.0 ONLY** - REQUIRED

**Reason:** Security improvements

---

## 🔴 **Current Implementation Issues**

### **What We're Doing Now:**
```typescript
// User manually pastes OAuth token
<input type="password" value={token} />
localStorage.setItem('osm_oauth_token', token);
```

### **Problems:**
1. ❌ **No proper login flow** - Users manually get tokens elsewhere
2. ❌ **No user identity** - We don't know WHO is editing
3. ❌ **No permission scopes** - Can't request specific permissions
4. ❌ **Not user-friendly** - Technical users only
5. ❌ **Security concerns** - Token exposure, no refresh mechanism
6. ❌ **Against OSM guidelines** - Should use proper OAuth flow

---

## ✅ **What We SHOULD Be Doing**

### **Proper OAuth 2.0 Authorization Code Flow with PKCE**

This is the **official, recommended approach** for single-page applications.

### **1. Register App with OSM**
- Go to: https://www.openstreetmap.org/oauth2/applications
- Register app with:
  - **Name**: "OSM Submit"
  - **Redirect URI**: `https://yourdomain.com/oauth/callback`
  - **Scopes**: `read_prefs write_api` (read user info + edit map)
- Receive: **Client ID** (no client secret needed for PKCE)

### **2. Implement Login Flow**

#### **Step 1: User Clicks "Login with OSM"**
```typescript
// Generate PKCE values
const codeVerifier = generateRandomString(128);
const codeChallenge = await sha256(codeVerifier);

// Store verifier
localStorage.setItem('pkce_verifier', codeVerifier);

// Redirect to OSM
const authUrl = 'https://www.openstreetmap.org/oauth2/authorize?' +
  `response_type=code` +
  `&client_id=${CLIENT_ID}` +
  `&redirect_uri=${REDIRECT_URI}` +
  `&scope=read_prefs write_api` +
  `&code_challenge=${codeChallenge}` +
  `&code_challenge_method=S256` +
  `&state=${randomState}`;

window.location.href = authUrl;
```

#### **Step 2: OSM Redirects Back**
```
https://yourdomain.com/oauth/callback?code=AUTH_CODE&state=...
```

#### **Step 3: Exchange Code for Token**
```typescript
const response = await fetch('https://www.openstreetmap.org/oauth2/token', {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    code: AUTH_CODE,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier // Retrieved from localStorage
  })
});

const { access_token } = await response.json();
// Now use this token for API requests!
```

---

## 🎯 **Benefits of Proper OAuth**

### **User Experience:**
- ✅ Click "Login with OSM" button
- ✅ Redirected to OSM (official website)
- ✅ Log in with existing OSM credentials
- ✅ Grant permission to app
- ✅ Redirected back - ready to edit
- ✅ See username/avatar in app

### **Security:**
- ✅ User never sees the token
- ✅ Token can't be stolen from input field
- ✅ Proper scopes (read vs write permissions)
- ✅ Can revoke access from OSM settings
- ✅ PKCE prevents code interception

### **Functionality:**
- ✅ Get user details (name, ID, preferences)
- ✅ Attribute changes to correct user
- ✅ Better changeset comments
- ✅ Professional, legitimate app

---

## 🔧 **What Needs to Change**

### **1. Remove Manual Token Input**
```diff
- <input type="password" placeholder="Paste token..." />
+ <button>Login with OpenStreetMap</button>
```

### **2. Add OAuth Flow**
- Create `/oauth/callback` page
- Implement PKCE generation
- Handle authorization redirect
- Exchange code for token
- Store token securely

### **3. Update UI**
```typescript
// Show user info when logged in
<div>
  <img src={user.avatar} />
  <span>{user.displayName}</span>
  <button onClick={logout}>Logout</button>
</div>
```

### **4. Update API Calls**
```typescript
// Include user info in changesets
const changeset = {
  user: currentUser.displayName,
  uid: currentUser.id,
  tags: { created_by: 'OSM Submit', comment: '...' }
};
```

---

## 📝 **Required Scopes**

For our app, we need:

- **`read_prefs`** - Read user preferences and details
- **`write_api`** - Create/modify/delete map data
- ~~`write_gpx`~~ - Not needed (GPS traces)
- ~~`write_diary`~~ - Not needed (blog posts)

---

## 🚀 **Implementation Priority**

### **Option A: Full OAuth (Recommended)**
**Effort:** Medium  
**User Experience:** ⭐⭐⭐⭐⭐  
**Security:** ⭐⭐⭐⭐⭐  
**OSM Compliance:** ✅ Full

**Steps:**
1. Register OAuth app on OSM
2. Implement PKCE flow
3. Create callback handler
4. Update UI for login/logout
5. Store tokens properly

### **Option B: Keep Current + Warning**
**Effort:** Low  
**User Experience:** ⭐⭐  
**Security:** ⭐⭐⭐  
**OSM Compliance:** ⚠️ Works but not recommended

**Add warning:**
```
⚠️ Advanced Users Only
This app requires manual OAuth token generation.
For security, we recommend using iD or JOSM editors instead.
```

---

## 📚 **Resources**

### **Official Docs:**
- OSM OAuth 2.0: https://wiki.openstreetmap.org/wiki/OAuth
- API v0.6: https://wiki.openstreetmap.org/wiki/API_v0.6
- Register App: https://www.openstreetmap.org/oauth2/applications

### **Libraries:**
- **JavaScript**: `osmlab/osm-auth` - https://github.com/osmlab/osm-auth
- **PKCE Helper**: Built-in Web Crypto API

### **Example Flow:**
```
User → "Login" → OSM Website → User approves → 
Redirect back → Exchange code → Get token → 
Fetch user info → Ready to edit
```

---

## 🎯 **Recommendation**

**Implement proper OAuth 2.0 with PKCE** for:
1. **Better UX** - One-click login
2. **Security** - No exposed tokens
3. **Compliance** - Proper OSM integration
4. **Features** - User info, better changesets
5. **Credibility** - Professional app

**Timeline:**
- Setup OAuth app: 15 minutes
- Implement PKCE flow: 2-3 hours
- Update UI: 1 hour
- Testing: 1 hour

**Total:** ~4-5 hours for complete, proper implementation

---

## ⚠️ **Current State**

**Status:** ⚠️ Works but NOT recommended  
**Issue:** Manual token approach is outdated  
**Risk:** Users may have security concerns  
**Fix:** Implement proper OAuth 2.0 flow

---

Would you like me to implement the proper OAuth 2.0 flow? It will make the app much more professional and user-friendly!
