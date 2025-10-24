# Deployment Guide

## Repository Structure

```
chromatic-blur/
├── dist/                    # Distribution files
│   └── chromatic-blur.js   # Main plugin (copied from root)
├── examples/               # Example files
│   └── demo.html          # Original demo
├── index.html             # Landing page (GitHub Pages)
├── chromatic-blur.js      # Source plugin file
├── README.md              # Documentation
├── package.json           # npm configuration
├── LICENSE                # MIT License
└── DEPLOYMENT.md          # This file
```

## Step 1: Initialize Git Repository

```bash
# Initialize git if not already done
git init

# Add remote
git remote add origin https://github.com/restyler/chromatic-blur.git

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: ChromaticBlur.js v1.0.0

- Add chromatic aberration blur effect plugin
- Add interactive landing page with live controls
- Add comprehensive documentation
- Set up npm package structure"
```

## Step 2: Push to GitHub

```bash
# Push to main branch
git push -u origin main
```

## Step 3: Enable GitHub Pages

### Option A: Using GitHub Web Interface

1. Go to https://github.com/restyler/chromatic-blur
2. Click on **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Your site will be published at: `https://restyler.github.io/chromatic-blur/`

### Option B: Using gh CLI

```bash
# Enable GitHub Pages from command line
gh repo edit --enable-pages --pages-branch main --pages-root /
```

## Step 4: Publish to npm

### First Time Setup

```bash
# Login to npm (you'll need an npm account)
npm login

# Verify your login
npm whoami
```

### Publish Package

```bash
# Ensure dist folder is up to date
npm run prepublishOnly

# Dry run to see what will be published
npm publish --dry-run

# Publish to npm
npm publish

# For scoped packages (if you want @restyler/chromatic-blur)
npm publish --access public
```

After publishing, your package will be available:
- **npm**: `npm install chromatic-blur`
- **unpkg CDN**: `https://unpkg.com/chromatic-blur@latest/dist/chromatic-blur.js`
- **jsDelivr CDN**: `https://cdn.jsdelivr.net/npm/chromatic-blur@latest/dist/chromatic-blur.js`

## Step 5: Update README with CDN Links

After publishing to npm, update your README.md with the actual CDN links:

```markdown
## Installation

### Via CDN (Recommended)

```html
<!-- unpkg -->
<script type="module">
  import ChromaticBlur from 'https://unpkg.com/chromatic-blur@1.0.0/dist/chromatic-blur.js';
  const blur = new ChromaticBlur('.element');
</script>

<!-- jsDelivr -->
<script type="module">
  import ChromaticBlur from 'https://cdn.jsdelivr.net/npm/chromatic-blur@1.0.0/dist/chromatic-blur.js';
  const blur = new ChromaticBlur('.element');
</script>
```

### Via npm

```bash
npm install chromatic-blur
```

```javascript
import ChromaticBlur from 'chromatic-blur';
const blur = new ChromaticBlur('.element');
```
```

## Updating the Package

```bash
# 1. Make your changes to chromatic-blur.js

# 2. Update version in package.json (semver)
# - Patch: 1.0.0 -> 1.0.1 (bug fixes)
# - Minor: 1.0.0 -> 1.1.0 (new features, backward compatible)
# - Major: 1.0.0 -> 2.0.0 (breaking changes)

# 3. Commit changes
git add .
git commit -m "Update: description of changes"
git push

# 4. Create a git tag
git tag v1.0.1
git push --tags

# 5. Publish to npm
npm run prepublishOnly
npm publish

# GitHub Pages will auto-update from the main branch
```

## Quick Commands Reference

```bash
# Check current directory structure
ls -la

# View git status
git status

# Check if GitHub Pages is enabled
gh repo view --json hasPages -q .hasPages

# View package on npm
npm view chromatic-blur

# Test the package locally
npm link
# Then in another project:
npm link chromatic-blur
```

## Troubleshooting

### GitHub Pages not updating?
- Wait 2-3 minutes after pushing
- Check Actions tab for deployment status
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

### npm publish fails?
- Check if package name is available: `npm view chromatic-blur`
- Make sure you're logged in: `npm whoami`
- Check package.json for errors: `npm run prepublishOnly`

### CDN not serving files?
- Wait 5-10 minutes after npm publish
- Try clearing CDN cache by adding `?v=timestamp` to URL
- Verify package was published: https://www.npmjs.com/package/chromatic-blur

## Next Steps

1. ✅ Add a nice README badge for npm version
2. ✅ Add GitHub stars badge
3. ✅ Consider adding a changelog (CHANGELOG.md)
4. ✅ Set up GitHub Actions for automated testing
5. ✅ Add more examples to the examples/ folder
