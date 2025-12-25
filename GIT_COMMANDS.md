# Quick Git Commands for GitHub Deployment

## First Time Setup

# 1. Initialize git repository (if not already done)
git init

# 2. Add all files to staging
git add .

# 3. Create initial commit
git commit -m "Initial commit: OSM Submit with GitHub Pages deployment"

# 4. Rename branch to main
git branch -M main

# 5. Add your GitHub repository (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. Push to GitHub
git push -u origin main

## After First Setup - Regular Updates

# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit with a message
git commit -m "Description of your changes"

# 4. Push to GitHub (triggers automatic deployment)
git push

## Check Repository Status

# View current status
git status

# View commit history
git log --oneline -10

# View remote URL
git remote -v

## If You Need to Change Repository URL

git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
