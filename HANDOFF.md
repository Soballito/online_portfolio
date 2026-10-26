# Handoff: publish Nico Soballa's portfolio website

You are picking up a finished personal portfolio website for **Nico Soballa** (mechanical engineer, project manager, product designer, Dortmund). The site was designed and built in a Claude chat session. Your job is to **publish it properly as a public website**, fix the few open items listed below, and leave the repo in a state Nico can maintain.

Nico is the owner. Ask him before anything that costs money, needs his accounts (GitHub, domain registrar, hosting), or is irreversible.

---

## 1. What is in this repository

```
online_portfolio/
├── HANDOFF.md            ← this file
├── site/                 ← THE WEBSITE. Deploy this folder as-is. Source of truth.
│   ├── index.html        ← complete page: HTML + inline CSS + inline JS (~260 KB)
│   ├── favicon.svg
│   └── images/           ← all images used by the site (~6.5 MB)
├── source/               ← how index.html was generated (reference only, see §6)
│   ├── site_body.html, site.css, site_app.js, 10_engines.js, 00_icons.js
│   ├── i18n_de.js        ← German texts, keyed by the English original
│   ├── i18n.js           ← ENG/DEU switch logic
│   ├── build_site.py, icons2.py, set_meta.py
│   └── design-system/tokens.json, bundle.css
```

`site/` is fully static: no build step, no server code, no dependencies. It works from any static host. Verified: loads with no console errors and no 404s, all pages and all 7 project pages open, language switch works.

## 2. How the site works (so you don't break it)

- **Single page, hash routing.** Pages are `#portfolio` (default), `#personal-information`, `#skills`, `#contact`, `#disclaimer`. Project detail pages are an overlay (`#pp`) opened from the portfolio. No server rewrites needed.
- **Landing screen.** Black screen "[meet nico soballa]"; a click plays a pixel transition into the portfolio. A direct link to a hash (e.g. `/#skills`) skips it. The landing always stays English.
- **ENG / DEU switch** (top left). German texts live in a `DE` object in the inline script (from `source/i18n_de.js`), keyed by the exact English string. The choice is remembered in `localStorage` (`ns-lang`). **If you change an English text, update its German key too**, or that text stays English in DEU mode.
- **Mouse trail switch** (top right): red pixel line behind the content, off by default. A red hint "NEED A RED THREAD?" appears after 10 s on the portfolio.
- **Images:** each project image has a tiny greyscale `*_px.png` (shown pixelated) and a full `*.jpg` revealed under the cursor square. Keep both files when replacing an image.
- **Fonts:** Pixelify Sans, Roboto, Roboto Mono, currently from Google Fonts (see §3, item 1).
- Respects `prefers-reduced-motion`. Custom cursor and trail are off on touch devices.

## 3. Before going live: fix these

1. **Self-host the fonts (GDPR, Germany).** The page loads `fonts.googleapis.com`. German courts (LG München, 3 O 17493/20) have ruled that loading Google Fonts from Google's servers without consent shares the visitor's IP unlawfully. Download the woff2 files for Pixelify Sans (400, 700), Roboto (400, 500) and Roboto Mono (400, 500), put them in `site/fonts/`, replace the three `<link>` tags in `<head>` with local `@font-face` rules, and confirm the page looks identical.
2. **Impressum and Datenschutzerklärung.** Nico lives in Germany and this is a professional site, so it most likely needs an Impressum (§ 5 DDG) and a privacy notice (DSGVO). Add them as two more hash pages (or small separate HTML files) linked from the footer, next to "Disclaimer". **Ask Nico** which name/address he wants published, and suggest he checks the final wording with a generator (e.g. e-recht24) or a lawyer; don't invent legal text and present it as reviewed. The privacy notice should mention: hosting provider, server logs, `localStorage` for the language choice, no cookies, no tracking, and external links (LinkedIn).
3. **Social preview.** Add Open Graph / Twitter meta tags (`og:title`, `og:description`, `og:image`, `og:url`). Make an `og-image.png` (1200×630) in the site's style: light #F4F4F4 background, "NICO SOBALLA" in Pixelify Sans on a red #FF002C band, the role line underneath.
4. **Image weight (nice to have).** Convert the large JPGs in `site/images/` to WebP/AVIF at the same dimensions, or at least recompress them. Keep the `_px.png` files as they are.
5. **Page title / description.** Currently `Nico Soballa` / `Portfolio of Nico Soballa`. Suggest something better to Nico, e.g. "Nico Soballa – Mechanical Engineer & Product Designer".

## 4. Privacy: do not publish these

- **Never commit Nico's CV PDFs** (`.gitignore` blocks `cv/` and `*.pdf`). The CVs contain Nico's home address, phone number and date of birth. If Nico wants a CV download on the site, ask first and make a version without address, phone and birth date.
- The site itself shows only his LinkedIn. Keep it that way unless he asks.

## 5. Publishing (recommended path)

Ask Nico which host he wants. Default suggestion: **GitHub Pages** (free, simple) or **Netlify / Cloudflare Pages** (free, easy custom domain + HTTPS).

GitHub Pages:
1. The repo already exists: `soballito/online_portfolio`. Free GitHub Pages needs it to be public.
2. Work on a branch and open a PR, or commit to `main` if Nico prefers.
3. Publish `site/` as the Pages root: either a GitHub Actions workflow that uploads `site/` (`actions/upload-pages-artifact` with `path: site`, then `actions/deploy-pages`), or move the contents of `site/` to the repo root / `docs/`.
4. Custom domain (if he has one, e.g. `nicosoballa.de`): add a `CNAME` file in the published folder, tell Nico which DNS records to set at his registrar, and enable "Enforce HTTPS".
5. After deploy, check the live URL in a browser: landing → portfolio transition, every page, a project page, ENG/DEU switch, mobile width (390 px), no console errors, no failed requests (in particular no request to `fonts.googleapis.com` once §3.1 is done).

Commit messages should be plain and descriptive. Don't push without Nico's go-ahead.

## 6. About `source/` (maintenance)

`site/index.html` was generated by `source/build_site.py`, which concatenates the design-system tokens and components with `site.css`, `site_body.html` and the JS files. **The script contains hard-coded absolute paths from the original build environment and won't run as-is.** Two options; ask Nico which he prefers:

- **Simple (recommended for him):** treat `site/index.html` as the source of truth and edit it directly. Keep `source/` only as reference.
- **Maintainable:** split `site/index.html` into `site/styles.css`, `site/app.js` and a lean `index.html`, so texts and styles are easy to edit. Do this carefully: the JS is one IIFE in a fixed order (icons → engines → app → German texts → language switch). Verify behaviour is identical afterwards.

Editing tips:
- English texts are in the HTML (and some in the `SKILLS` array and the `.pp-stories` blocks inside the script / body). Each project page's texts live in a hidden `<div class="pp-stories">` with one `data-story="p-0X"` block per project.
- Project index rows (context, role, year) are the `<li><a href="#p-0X">` rows in the "Index" list. The project page reads context, role and year from there.
- German: add or adjust the matching entry in the `DE` object.

## 7. Content facts to keep consistent

- Availability: **From April 2027** (site and CV agree).
- Current job: Innovation – Smart City, Wirtschaftsförderung Dortmund, since 01.10.2025 (confirmed). The IFR job is listed as 01/2023 – 09/2025.
- The "Disclaimer" page states the site was made with AI assistance and some images were edited with AI. Keep it.
- Image credits shown on the project pages: every BACE HUB image "Source: THE ARC", every SAFETY STIRRUP (AERO) image "Source: Sprenger", the LEGO image "Source: LEGO" (German: "Quelle: …"); the surf photo "© Agnieszka Pokrywka". Keep these when replacing images. Credits are set via `data-credit` on the `img2`–`img5` lines and appended to `cap1` in `.pp-stories`.

## 8. Design reference (if you touch the look)

- Colours: background #F4F4F4, ink #0E0E10, red accent #FF002C, electric blue #2A33E8 (design system).
- Type: Pixelify Sans (display, uppercase), Roboto (body), Roboto Mono (labels, uppercase, tracked).
- Motifs: static dot grid, text that forms itself from symbols, pixelated images revealed under a square cursor, pixel icons drawn from bitmaps in `ICON_BITMAPS`.
