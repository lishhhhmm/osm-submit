# GitHub Secrets Setup for Deployment

## 🚀 **Environment Variables for GitHub Pages**

Your app needs OAuth credentials to work on GitHub Pages. Since `.env.local` only works locally, we use **GitHub Secrets** for deployment.

---

## 📋 **Step-by-Step Setup**

### **Step 1: Get Your OAuth Client ID**

1. Go to: https://www.openstreetmap.org/oauth2/applications
2. Find your registered app (or create one)
3. Copy the **Client ID**
4. (Optional) Copy **Client Secret** if you have one

---

### **Step 2: Add Secrets to GitHub**

1. **Go to your GitHub repository**
   - Example: `https://github.com/YOUR_USERNAME/osmsubmit`

2. **Click "Settings" tab** (top of page)

3. **In left sidebar:**
   - Click **"Secrets and variables"**
   - Then click **"Actions"**

4. **Click "New repository secret"** (green button)

5. **Add First Secret:**
   - **Name**: `VITE_OSM_CLIENT_ID`
   - **Value**: [Paste your Client ID]
   - Click "Add secret"

6. **Add Second Secret (if needed):**
   - Click "New repository secret" again
   - **Name**: `VITE_OSM_CLIENT_SECRET`
   - **Value**: [Paste your Client Secret]
   - Click "Add secret"

---

## ✅ **Verification**

After adding secrets, you should see:

```
Repository secrets
├─ VITE_OSM_CLIENT_ID  (Updated X minutes ago)
└─ VITE_OSM_CLIENT_SECRET  (Updated X minutes ago)
```

---

## 🔄 **How It Works**

### **Local Development** (Your Computer)
```
.env.local file
    ↓
Vite reads it during npm run dev
    ↓
App has OAuth credentials
```

### **GitHub Pages** (Deployment)
```
GitHub Secrets
    ↓
Workflow passes them to build
    ↓
Vite bakes them into dist/
    ↓
Deployed app has OAuth credentials
```

---

## 📁 **Updated Workflow**

The deployment workflow (`deploy.yml`) now includes:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_OSM_CLIENT_ID: ${{ secrets.VITE_OSM_CLIENT_ID }}
    VITE_OSM_CLIENT_SECRET: ${{ secrets.VITE_OSM_CLIENT_SECRET }}
```

This passes your secrets to the build process!

---

## 🔒 **Security**

✅ **Secrets are encrypted** by GitHub  
✅ **Never visible** in logs or UI  
✅ **Only available** during workflow runs  
✅ **Not exposed** in your repo code  
✅ **Safe for public repos** ✨

---

## 🎯 **Quick Setup Checklist**

- [ ] Register OAuth app on OpenStreetMap
- [ ] Copy Client ID
- [ ] Go to GitHub repo → Settings → Secrets → Actions
- [ ] Add `VITE_OSM_CLIENT_ID` secret
- [ ] (Optional) Add `VITE_OSM_CLIENT_SECRET` secret
- [ ] Push to main branch
- [ ] Watch workflow run
- [ ] Visit your GitHub Pages site
- [ ] Test OAuth login - should work! ✅

---

## 🐛 **Troubleshooting**

### **OAuth login fails on GitHub Pages**

**Check:**
1. Did you add the secret with exact name `VITE_OSM_CLIENT_ID`?
2. Did you push after updating the workflow?
3. Check Actions tab - did the build succeed?
4. In OSM app settings, is the redirect URI correct?
   - Should be: `https://yourdomain.com/oauth/callback`
   - Or with hash: `https://yourdomain.com/#/oauth/callback`

### **Workflow fails during build**

**Check:**
1. GitHub Actions tab for error messages
2. Secret names match exactly (case-sensitive)
3. Secrets have values (not empty)

### **"Client authentication failed"**

**Check:**
1. Client ID in GitHub Secret matches OSM app
2. Redirect URI in OSM app matches your deployed URL
3. Secret was added before the last deployment

---

## 🔄 **Updating Secrets**

If you need to change your OAuth credentials:

1. Go to: Settings → Secrets → Actions
2. Click on the secret name
3. Click "Update secret"
4. Paste new value
5. Save
6. Re-run workflow or push new commit

---

## 💡 **Pro Tips**

1. **Test locally first** with `.env.local`
2. **Use sandbox environment** for GitHub Pages testing
3. **Different OAuth apps** for local vs production is OK
4. **Check workflow logs** if something doesn't work

---

## 📝 **Summary**

**Local (.env.local):**
```env
VITE_OSM_CLIENT_ID=abc123...
```

**GitHub (Repository Secrets):**
```
Name: VITE_OSM_CLIENT_ID
Value: abc123...
```

**Both work!** Local for development, Secrets for deployment. 🎉

---

## 🎯 **Next Steps**

1. Add secrets to GitHub
2. Push this updated workflow
3. Wait for deployment
4. Test OAuth on your live site
5. Done! 🚀
