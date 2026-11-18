# Ados_portfolio

Personal portfolio of **Aditya Garg**, a final-year B.Tech student in Instrumentation & Control Engineering at NSUT, New Delhi, focused on FPGA / RTL design, verification and board bring-up.

It is a static site written in plain HTML, CSS and JavaScript, with no build step and no frameworks.

## Structure

```
index.html        the site: six pages (Home, About, Research, Pro-Folio, CV, Contact) shown one at a time
css/style.css     theme tokens (dark + light), layout, components
js/main.js        page router (#about, #cv …), theme toggle, mobile nav, project filters, feature-row cycler, aurora parallax, résumé viewer
js/cloth.js       pinned résumé sheet: Verlet cloth that unrolls, bends when dragged, opens the viewer on click
js/cursor.js      liquid-glass droplet cursor with ripples (desktop only, off for reduced motion)
assets/           favicon, avatar/profile photos, résumé PDF + pre-rendered page images
ANALYSIS.md       analysis of the reference site (namaicv.com) and design decisions
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages

Go to **Settings → Pages → Build and deployment**, set Source to *Deploy from a branch*, and pick `main` / `(root)`.
The site will be served at `https://aditya-eng.github.io/Ados_portfolio/`.

## Pages

Each page is a `<section data-page="Name" id="…">` in `index.html`. Only the page named in the URL hash is shown (`#home`, `#about`, `#research`, `#projects`, `#cv`, `#contact`), so links, the back button and bookmarks all work. A tiny script in `<head>` picks the page before first paint, so there is no flash. To add a page, add a section with `data-page` and add its id to the list in that `<head>` script and to the `data-route` rules in `style.css`.

## Editing content

All content lives in `index.html`:
- **Projects** are `<article class="card" data-tags="rtl embedded python">` blocks. The `data-tags` values drive the filter chips. A card's `.link` stretches over the whole card, so clicking anywhere on it opens the project.
- **Theme colours** are CSS variables at the top of `css/style.css`: `--navy` `#14213D`, `--cream` `#F4EDE0` and `--coral` `#FF6B5B`. Dark and light tokens follow them.
- **Fonts** are Unbounded (display), Manrope (body) and Martian Mono (labels), all from Google Fonts.
- **Glass:** add the `glass` class to any element for the frosted liquid-glass surface.
