# Streamly Marketing Website

Cinematic dark marketing site for Streamly (iOS / iPadOS / tvOS / macOS IPTV player). Mirrors the app's `AppBackground.swift` design language: red `#DC2626` accent, deep purple-black base, 6-layer radial backdrop.

## File layout

```
marketing-website/
├── index.html         # Landing — hero (Apple TV) + platforms carousels + 8 feature sections + pricing
├── privacy.html       # Privacy Policy (mirrors LegalTextView.swift)
├── terms.html         # Terms of Use (mirrors LegalTextView.swift)
├── support.html       # FAQ + contact
├── styles.css         # Shared chrome (nav, footer, type, colors, phone-frame, tv-frame, carousel)
├── carousel.js        # ~80 lines vanilla JS — auto-rotate, pause-on-hover, keyboard, a11y
├── assets/
│   ├── logo-horizontal.png         # Nav + footer wordmark (no longer used; live text wordmark)
│   ├── logo-stacked.png            # Reserved for future use
│   ├── app-icon-256.png            # Favicon + apple-touch-icon
│   ├── app-icon-1024.png           # OG image (social share preview)
│   ├── app-store-badge.svg         # "Download on the App Store" CTA
│   │
│   ├── appletv-home.png            # Hero mockup + Platforms carousel slide 1
│   ├── appletv-livechannels.png    # Live Channels feature section + Platforms carousel
│   ├── appletv-movies.png          # Platforms carousel
│   ├── appletv-moviedetails.png    # Movies feature section + Platforms carousel
│   ├── appletv-series.png          # Platforms carousel
│   ├── appletv-series-continuewatching.png # Series feature section + Cross-device sync
│   ├── appletv-more-like-this.png  # Reserved (rail close-up)
│   │
│   ├── iphone-home.png             # Platforms carousel slide 1
│   ├── iphone-favorites.png        # Platforms carousel
│   ├── iphone-movies.png           # Platforms carousel
│   ├── iphone-movie-details.png    # Platforms carousel
│   ├── iphone-series.png           # Reserved (replaced by Apple TV in feature section)
│   ├── iphone-series-details.png   # Platforms carousel
│   ├── iphone-search.png           # Search feature section + Platforms carousel
│   ├── iphone-playlists.png        # Playlists feature section + Platforms carousel
│   ├── iphone-offline.png          # NEW — Downloads feature section (pre-framed marketing asset)
│   │
│   ├── rail-continue-watching.png  # Recommendations rail
│   ├── rail-top-picks.png          # Recommendations rail
│   ├── rail-trending.png           # Recommendations rail
│   └── rail-because-you-watched.png # Recommendations rail
├── prototypes/        # The 4 original direction explorations (archive — keep for reference)
└── README.md          # This file
```

The site is 4 static HTML files + 1 stylesheet + 1 JS file + 1 SVG badge + 23 PNG assets. No build step, no JS framework, no server. Drop on any static host.

## Local preview

```bash
open marketing-website/index.html
```

Or run a tiny local server (useful for testing relative links):

```bash
cd marketing-website && python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

Recommended: keep this site in a dedicated repo (e.g. `yfarag/streamly-website`) rather than the iOS app repo, so you can iterate on copy / design without touching the app.

```bash
# From the iOS app repo
cd marketing-website
git init
git remote add origin git@github.com:yfarag/streamly-website.git
git add .
git commit -m "Initial Streamly marketing site"
git branch -M main
git push -u origin main
```

Then in GitHub: repo Settings → Pages → Source: `main` branch, root folder. Site goes live at `https://yfarag.github.io/streamly-website/` within ~30 seconds.

To use a custom domain (e.g. `streamly.app`):
1. Settings → Pages → Custom domain → enter `streamly.app`.
2. At your domain registrar, add a CNAME record pointing `streamly.app` → `yfarag.github.io`.
3. Wait for DNS to propagate (~10 min); GitHub auto-provisions an HTTPS cert.

The App Store Connect Support URL field already references `yfarag.github.io/streamly-website/support` (per the App Review replies). Make sure `support.html` is reachable at that path before resubmitting any new build.

## What's a placeholder, what's not

| Element | Status |
|---|---|
| Color palette, fonts, layout, copy | ✅ Final |
| Logo wordmark | ✅ Live HTML text ("streamly", 900-weight, white) — crisp at any zoom |
| Favicon + apple-touch-icon | ✅ Real app icon (256px) |
| OG social-share image | ✅ Real 1024×1024 app icon |
| **Hero mockup** | ✅ Apple TV home screenshot in `.tv-frame` (16:9 large) |
| **Platforms carousel — Apple TV** | ✅ 6 real tvOS screenshots auto-rotating (Home → Live → Movies → Movie details → Series CW → Series Featured) |
| **Platforms carousel — iPhone** | ✅ 7 real iPhone screenshots auto-rotating (Home → Live → Movies → Movie details → Series details → Search → Playlists) |
| Live Channels section | ✅ Real Apple TV live channels screenshot (Bein Sport feed) |
| Movies section | ✅ Real Apple TV movie details screenshot ("A Great Awakening") |
| Series section | ✅ Real Apple TV series Continue Watching screenshot |
| Search section | ✅ Real iPhone Advanced Search screenshot |
| Recommendations section | ✅ Four real rail close-ups stacked |
| **Downloads / Watch Offline section (NEW)** | ✅ Pre-framed iPhone marketing screenshot ("Download & watch offline") |
| Playlists section | ✅ Real iPhone playlists screenshot |
| **Cross-device sync section (NEW)** | ✅ Apple TV home with Pro sync banner visible |
| App Store download badge | 🟡 Hand-drawn SVG that approximates Apple's official badge. Before public launch, replace with the real one from <https://tools.applemediaservices.com/app-store/> |
| Privacy + Terms text | ✅ Copied from `Shared/Features/Menu/LegalTextView.swift` |
| Support FAQ | ✅ Written for Streamly |

### Carousel behavior

- **Auto-rotate** every 4.5 s (iPhone) / 5 s (Apple TV)
- **Pause** on hover, focus-within, or when the browser tab is hidden
- **Dot indicators** are clickable and ARIA-labeled (real `<button>` elements)
- **Keyboard support**: focus the carousel-wrapper and press ←/→
- **Respects `prefers-reduced-motion`**: auto-rotate disabled but dots still work
- Add or remove slides by editing the `<img class="carousel-slide">` list inside `[data-carousel]` — no JS changes required

### Adding real iPad or macOS screenshots later

The Figma SVG templates at `AppStore/screenshots/{ipad,macos}/figma/frame-*.svg` are **empty bezel templates** — open in Figma, drop your platform screenshot into the `Screen-Placeholder` layer, export as PNG. For iPad use `.tv-frame` (aspect-ratio: 16/9 stretched) or add a `.ipad-frame` class with `aspect-ratio: 4/3`. For macOS, add a `.mac-frame` class with `aspect-ratio: 16/10` and a browser-window chrome treatment.

## Updating the legal text

The privacy policy and terms are duplicated between:
1. `Shared/Features/Menu/LegalTextView.swift` (in-app)
2. `marketing-website/privacy.html` + `terms.html` (website)

Both must say the same thing. When you update one, update the other. The `Last updated:` line in both should match.

The comment block above `LegalTextView.privacyPolicy` already notes "Mirrors the canonical Privacy Policy published at github.com/yfarag/streamly-website" — keep that synced.

## Future improvements (post-launch)

- [ ] Real device-mockup screenshots (export from Figma or Xcode previews)
- [ ] SVG logo replacing the text wordmark
- [ ] Official Apple "Download on the App Store" badge with deep-link to your App Store page
- [ ] OpenGraph image (`og:image`) for social sharing — 1200×630 hero screenshot
- [ ] Favicon set (`favicon.ico`, Apple touch icon)
- [ ] `robots.txt` and `sitemap.xml` for SEO
- [ ] A `/press` page if you start pitching to MacStories / 9to5Mac / etc.
- [ ] A `/changelog` page surfacing what's new in each version
- [ ] Localized versions (start with the languages already in `Shared/Localizable.xcstrings`: ar / de / es / fr / pt-BR)
