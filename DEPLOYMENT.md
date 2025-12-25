# GitHub Pages Deployment Guide

## Overview
This project automatically deploys to GitHub Pages using GitHub Actions whenever you push to the `main` branch. **It's configured for custom domain usage by default.**

## Initial Setup

### 1. Create GitHub Repository
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: OSM Submit"

# Rename branch to main
git branch -M main

# Add your GitHub repository as remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 2. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. In the left sidebar, click **Pages**
4. Under **Source**, select **GitHub Actions**
5. That's it! The workflow will automatically deploy on the next push

### 3. Configure API Key (Optional)

If your app uses the Gemini API:

1. Go to repository **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GEMINI_API_KEY`
5. Value: Your actual Gemini API key
6. Click **Add secret**

## Deployment Process

### Automatic Deployment
Every time you push to `main`:
```bash
git add .
git commit -m "Your changes"
git push
```

The GitHub Actions workflow will:
1. ✅ Checkout your code
2. ✅ Setup Node.js 20
3. ✅ Install dependencies
4. ✅ Build the application
5. ✅ Deploy to GitHub Pages

### Manual Deployment
You can also trigger deployment manually:
1. Go to the **Actions** tab in your repository
2. Click on **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Select the `main` branch
5. Click **Run workflow**

## Accessing Your Deployed App

### With Custom Domain (Recommended)
After configuring your custom domain (see below), your app will be available at:
```
https://yourdomain.com
```
or
```
https://subdomain.yourdomain.com
```

### Without Custom Domain
If using GitHub Pages default URL:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

**Note:** If using the default GitHub Pages URL (without custom domain), you need to update `.github/workflows/deploy.yml`:
```yaml
env:
  BASE_PATH: '/YOUR_REPO_NAME/'  # Uncomment and set this
```

## Custom Domain (Recommended)

This project is **already configured for custom domain usage** (base path is set to '/').

To use a custom domain:

1. Go to repository **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `osm.yourdomain.com`)
3. Configure your DNS provider:
   - **For subdomain** (e.g., osm.yourdomain.com):
     - Add CNAME record: `osm` → `YOUR_USERNAME.github.io`
   - **For apex domain** (e.g., yourdomain.com):
     - Add A records pointing to GitHub's IPs:
       ```
       185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
       ```
     - Optionally add AAAA records for IPv6 support
4. Wait for DNS propagation (5-10 minutes to a few hours)
5. Enable **Enforce HTTPS** in GitHub Pages settings

## Troubleshooting

### Deployment Failed
1. Check the **Actions** tab for error messages
2. Ensure all dependencies are in `package.json`
3. Verify the build works locally: `npm run build`

### 404 Error After Deployment
1. Verify GitHub Pages source is set to **GitHub Actions**
2. Check that the workflow completed successfully
3. Wait a few minutes for DNS propagation

### Assets Not Loading
- **With custom domain**: Base path should be `/` (already configured)
- **Without custom domain**: Uncomment and set `BASE_PATH: '/YOUR_REPO_NAME/'` in `.github/workflows/deploy.yml`
- Clear browser cache and do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### API Key Not Working
1. Ensure the secret name is exactly `GEMINI_API_KEY`
2. Check it's added in repository settings (not environment secrets)
3. Re-run the workflow after adding the secret

## Workflow File Location
`.github/workflows/deploy.yml`

## Build Configuration
`vite.config.ts` - Controls the base path and build settings

## Monitoring Deployments
- View deployment status: **Actions** tab
- View deployment history: **Settings** → **Pages**
- Check live site: Click the deployment URL in **Actions**
