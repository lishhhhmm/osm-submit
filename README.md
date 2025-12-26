# OSM Submit

**OSM Submit** is a modern web application designed for OpenStreetMap (OSM) contributors. It provides an intuitive interface to create and preview OSM-compliant Point of Interest (POI) submissions with real-time XML payload generation.

## Features

- 🗺️ **Interactive POI Editor** - User-friendly form to input location details and tags
- 📍 **Coordinate Support** - Precise latitude/longitude input for accurate mapping
- 🏷️ **OSM Tag Management** - Support for name, amenity, cuisine, and custom tags
- 📄 **Raw XML Preview** - Real-time generation of OSM API-compliant XML payloads
- 🌙 **Dark Mode** - Automatic theme switching for comfortable viewing
- 📱 **Responsive Design** - Fully optimized for desktop and mobile devices
- ⚡ **Fast & Modern** - Built with React, TypeScript, and Vite

## Quick Start with Docker

The easiest way to run and test the application locally:

```bash
# Start the application
docker compose up -d

# The app will be available at http://localhost:3000
```

**Features:**
- Hot reload enabled - code changes update automatically
- Mock OAuth for testing - no HTTPS needed locally
- Vite dev server with fast builds

To stop the application:

```bash
docker compose down
```

### Local OAuth Testing

When running on `localhost`, the app uses **mock OAuth** instead of real OSM authentication:

1. Click "🔧 Mock Login (Dev)" button
2. Choose a test scenario:
   - ✅ Success - Login as TestUser
   - ❌ Fail - Invalid Credentials
   - ❌ Fail - User Denied Access
3. Experience the full OAuth callback flow
4. POI data is preserved throughout

This lets you test the complete submission workflow without needing HTTPS or real OSM credentials.

## Deploy to GitHub Pages

This project is configured for automatic deployment to GitHub Pages with custom domain support. Follow these steps:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository **Settings**
   - Navigate to **Pages** section
   - Under **Source**, select **GitHub Actions**

3. **Automatic Deployment**:
   - Every push to the `main` branch will automatically trigger a build and deployment
   - The deployment process takes 1-2 minutes

4. **Configure Your Custom Domain** (Recommended):
   - In repository **Settings** → **Pages** → **Custom domain**
   - Enter your domain (e.g., `osm.yourdomain.com`)
   - Configure DNS at your domain provider:
     - For subdomain: Add CNAME record pointing to `YOUR_USERNAME.github.io`
     - For apex domain: Add A records to GitHub's IPs (see GitHub docs)
   - Enable **Enforce HTTPS** after DNS propagates

5. **Alternative: GitHub Pages URL** (Without custom domain):
   - Your app will be at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
   - Update `.github/workflows/deploy.yml` to uncomment and set:
     ```yaml
     BASE_PATH: '/YOUR_REPO_NAME/'
     ```


5. **Configure OAuth for OpenStreetMap** (REQUIRED):
   
   **For Local Development:**
   - Edit `.env.local` and add your OAuth Client ID:
     ```env
     VITE_OSM_CLIENT_ID=your_client_id_here
     ```
   - See `ENV_SETUP.md` for details
   
   **For GitHub Pages Deployment:**
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Add secret: `VITE_OSM_CLIENT_ID` with your Client ID
   - See `GITHUB_SECRETS_SETUP.md` for step-by-step guide
   
   **Register OAuth App:**
   - Visit: https://www.openstreetmap.org/oauth2/applications
   - Create new application
   - Add redirect URI: `https://yourdomain.com/oauth/callback`
   - Copy Client ID
   - See `OAUTH_SETUP_GUIDE.md` for complete instructions

6. **Optional - Add API Key Secret**:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Add a new secret named `GEMINI_API_KEY` with your API key


## Manual Setup (Development)

If you prefer to run without Docker:

**Prerequisites:** Node.js 20+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

**Note:** Local development uses mock OAuth - see "Local OAuth Testing" section above.

## Building for Production

```bash
npm run build
npm run preview
```

## Technology Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Icons**: Lucide React
- **AI Integration**: Google Generative AI
- **Deployment**: GitHub Pages (production), Docker (local dev)

## Documentation

- `OAUTH_SETUP_GUIDE.md` - Complete OAuth configuration guide
- `ENV_SETUP.md` - Environment variable setup
- `GITHUB_SECRETS_SETUP.md` - GitHub Pages deployment secrets
- `DOCS_INDEX.md` - Complete documentation index

## License

© 2025 OSM Submit. Designed for OpenStreetMap contributors.
