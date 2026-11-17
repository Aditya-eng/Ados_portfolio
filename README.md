# Ados_portfolio

Personal portfolio of **Aditya Garg**, a final-year B.Tech student in Instrumentation & Control Engineering at NSUT, New Delhi, focused on FPGA / RTL design, verification and board bring-up.

It is a static site written in plain HTML, CSS and JavaScript, with no build step and no frameworks.

## Structure

```
index.html        single-page site (Hero, About, Research, Pro-Folio, CV, Contact)
css/style.css     theme tokens (dark + light), layout, components
js/main.js        theme toggle, mobile nav, project filters, typed terminal, PCB-trace canvas
assets/           favicon
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

## Editing content

All content lives in `index.html`:
- **Projects** are `<article class="card" data-tags="rtl embedded python">` blocks. The `data-tags` values drive the filter chips.
- **Theme colours** are CSS variables at the top of `css/style.css` (`--accent` is copper, `--signal` is the green used for PASS).
