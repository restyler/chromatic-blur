# CDN Distribution Guide

## Overview

Once you publish to npm, your package is automatically available on major CDNs **for free**:

## 1. Publish to npm (Required)

```bash
# Login to npm (one-time setup)
npm login

# Build the minified version
npm run build

# Publish to npm registry
npm publish
```

## 2. CDNs (Automatic)

After publishing to npm, your package is immediately available on these CDNs:

### unpkg (Instant, no setup required)

- **Minified**: `https://unpkg.com/chromatic-blur@1.0.0/dist/chromatic-blur.min.js`
- **Dev version**: `https://unpkg.com/chromatic-blur@1.0.0/dist/chromatic-blur.js`
- **Latest**: `https://unpkg.com/chromatic-blur@latest/dist/chromatic-blur.min.js`

### jsDelivr (Instant, no setup required)

- **Minified**: `https://cdn.jsdelivr.net/npm/chromatic-blur@1.0.0/dist/chromatic-blur.min.js`
- **Dev version**: `https://cdn.jsdelivr.net/npm/chromatic-blur@1.0.0/dist/chromatic-blur.js`
- **Latest**: `https://cdn.jsdelivr.net/npm/chromatic-blur/dist/chromatic-blur.min.js`

### Cloudflare cdnjs (Manual submission)

If you want to be on cdnjs (optional, less commonly used):

1. Go to https://github.com/cdnjs/packages
2. Create a pull request with your package info
3. Wait for approval (can take days/weeks)

**Recommendation**: Skip cdnjs. unpkg and jsDelivr are more than sufficient and are the industry standard.

## 3. Usage Examples

After publishing v1.0.0, users can use your plugin like this:

```html
<!-- unpkg -->
<script type="module">
  import ChromaticBlur from 'https://unpkg.com/chromatic-blur@1.0.0/dist/chromatic-blur.min.js';
  const blur = new ChromaticBlur('.navbar');
</script>

<!-- jsDelivr (recommended for production) -->
<script type="module">
  import ChromaticBlur from 'https://cdn.jsdelivr.net/npm/chromatic-blur@1.0.0/dist/chromatic-blur.min.js';
  const blur = new ChromaticBlur('.navbar');
</script>
```

## 4. Update Your README

After publishing, update the CDN links in README.md to use the actual version number instead of `1.0.0`.

## Verification

After publishing to npm, verify CDN availability:

1. Visit: https://www.npmjs.com/package/chromatic-blur
2. Wait 2-3 minutes
3. Test unpkg: `curl -I https://unpkg.com/chromatic-blur/dist/chromatic-blur.min.js`
4. Test jsDelivr: `curl -I https://cdn.jsdelivr.net/npm/chromatic-blur/dist/chromatic-blur.min.js`

## Version Management

When you publish a new version:

```bash
# Update version in package.json (e.g., 1.0.0 → 1.0.1)
npm version patch  # or minor, or major

# Build and publish
npm run build
npm publish

# Push version tag to GitHub
git push --tags
```

CDNs will automatically serve the new version!

## Performance Notes

- **unpkg**: Served via Cloudflare, globally distributed
- **jsDelivr**: Multi-CDN (Cloudflare, Fastly, CloudFlare), better for production
- **File sizes**:
  - Minified: 6.4 KB
  - Gzipped: 2.1 KB (what users actually download)

## Free and Forever

All of these CDNs are:
- ✅ Free forever
- ✅ No registration required (except npm)
- ✅ Globally distributed
- ✅ HTTPS enabled
- ✅ Automatic updates when you publish new versions
