# School Brand Assets Replacement Guide

Replace the placeholder images in this directory with your school's actual logos and brand imagery:

1. **`app-icon-placeholder.png`** / **`app-icon-placeholder.svg`**:
   - Location: `/public/images/app-icon-placeholder.png`
   - Description: Your school logo / application emblem.
   - Recommended Size: 512x512 PNG with transparent background.

2. **`splash-placeholder.png`** / **`splash-placeholder.svg`**:
   - Location: `/public/images/splash-placeholder.png`
   - Description: Splash screen displayed when launching the installed PWA on mobile.
   - Recommended Size: 1080x1920 or 1200x630.

3. **PWA Icons in `/public/icons/`**:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)

The application references these dynamically via `/public/manifest.json` and layout headers.
