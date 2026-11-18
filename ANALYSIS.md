# Reference analysis: namaicv.com

This is an analysis of [namaicv.com](https://www.namaicv.com/) (Namai Chandra, Robotics & Embodied Systems Researcher), which was the reference for this portfolio. I scraped it on 17 Nov 2026 by fetching the raw HTML and the sub-pages About, Research and Pro-Folio.

## 1. Platform and tech

| Item | Finding |
|---|---|
| Builder | **Wix** (Thunderbolt renderer); about 900 references to `wix`/`parastorage` in the HTML |
| Page weight | About **485 KB of HTML** before any JS or images load |
| Fonts | `Poppins` / `Poppins SemiBold` (body), `Lulo Clean` (wide all-caps display), `DIN Next Light` |
| Palette | Mostly black and white (`#000`, `#fff`), with a red accent (`#FF4040`) and cyan/red/purple glow overlays (`rgba(10,189,240,.3)`, `rgba(254,1,1,.3)`, `rgba(128,21,232,.9)`) |
| Images | Served as AVIF through Wix's media CDN |
| Footer note | "best experienced on pc", which suggests mobile is a weak point |

## 2. Information architecture

**Top nav:** Home · About · Research · Pro-Folio · CV · Contact · More

| Page | Content |
|---|---|
| **Home** | Headshot · "Howdy! I'm Namai" · one-line mission ("I build adaptive robotic systems, combining mechanical design, fabrication, embedded electronics, sensing, and control.") · roles line ("Researcher, YouTuber, 3D Printing Tech Enthusiast") · **"Featured by"** logo (NASA citizen science) · education and research interests · **Recent Projects** carousel · "Wanna see more of my work?" with social icons |
| **About** | "A Bit About Me…" story · institutions and affiliations · philosophy ("intelligence is not just about models, but about how well the entire system works together in the real world") · YouTube channels · tagline "Imagine it build it" · **"Softwares"** logo grid (Blender, Fusion 360, Vivado, Quartus, MATLAB…) |
| **Research** | Heading only; no entries rendered in the scrape |
| **Pro-Folio** | Category tags (Product Design, Animation & Graphics) and sections (Mechatronics, Blender). Each **card** has a thumbnail, a bold title, a one-line tagline and a "View Project" link. Examples: MemoryPalace (HackMIT 2026, 2nd), CanSat (ISRO top 10), Eco Mender FPGA Bot |
| **CV** | Separate page |
| **Contact** | Separate page |

## 3. What works (adopted)

1. **A friendly first-person hero.** "Howdy! I'm Namai" followed by a precise one-line mission. Casual and credible at once.
2. **A "Featured by" strip** placed right under the hero, so third-party credibility shows before you scroll.
3. **Card-based projects** with a short "tagline + title + link" pattern that scans quickly.
4. **Category tags** for projects, which help a multidisciplinary person segment their work.
5. **A tools/software grid** that shows breadth at a glance.
6. **A repeated "Wanna see more of my work?" CTA** at the bottom of every page.
7. **A personal philosophy line** that makes the person memorable ("Imagine it build it").

## 4. What doesn't work (improved here)

| namaicv.com | This portfolio |
|---|---|
| Wix runtime, ~485 KB of HTML plus heavy JS | Hand-written static HTML, CSS and JS with no frameworks, deployable on GitHub Pages |
| "Best experienced on pc" | Mobile-first responsive layout with a hamburger nav at ≤760px and no horizontal scroll |
| Category tags that aren't working filters | **Working filter chips** (All / RTL & FPGA / Embedded & Analog / Python & Hackathons) |
| Research page renders empty | Research section built around the **B.Tech MRPM project** with headline numbers, plus open research questions |
| "Recent Projects" heading repeated 8× in the DOM | Semantic, de-duplicated markup (`section`, `article`, `nav`, skip link, ARIA states) |
| Logos without numbers | **Quantified results** throughout (−35.7% LUT4, +55% Fmax, 65,536 pairs, 360,000 transfers) |
| Content spread over 6 pages | Single page with anchored sections; the nav highlights the current section |
| Light theme only | Dark and light themes that follow the OS setting, plus a manual toggle |

## 5. Translating it to Aditya

| Reference element | Aditya's version |
|---|---|
| "Howdy! I'm Namai" | "Hey! I'm Aditya." |
| Roles line | RTL Designer · FPGA Tinkerer · Board Bring-up · Hackathon Regular |
| Headshot | A circular avatar beside his full name in the hero, plus a glass-framed portrait in About |
| "Featured by" (NASA) | **Recognition row:** Eco-Fest runner-up, SIH 2024 finalist, AtomQuest semi-finalist, HackWithMAIT 3rd, 7 boards brought up |
| CV page | Résumé PDF (`assets/Aditya_Garg_Resume.pdf`) with View and Download buttons in the CV section |
| "Imagine it build it" | "I don't trust a board until I've measured it working." |
| Softwares logo grid | Grouped **Toolbox**: HDL, simulation and FPGA, boards and analog, lab bench, platforms, Python |
| Visual identity | A **"thinking rocks"** theme: copper PCB traces with signal pulses, a chip logo, and a layer stack from software down to the physics of the board |

## 6. Visual redesign: "Tidewell" reference (v2)

The second reference was a screenshot of a travel site called "Tidewell", taken from a social video, so the like, share and save counts are overlays. These are its elements and how they were adapted:

| Tidewell element | Adapted as |
|---|---|
| Navy background, coral aurora glow, **reeded (fluted) glass** striations | `.hero__aurora` (three blurred radial blobs; the coral one follows the pointer) under `.hero__reeds` (a repeating vertical gradient with a light backdrop blur). Reused on the Research paper and Contact panels |
| Centred **glass pill nav**, coral dot on the active link | `.nav__links.glass`; the active section gets a coral dot through scroll-spy |
| Round cream icon button at top right | Theme toggle (`.round--cream`) |
| Floating **frosted booking card** with a drag handle, sub-cards, big numbers with a chip between ("Fri 14 · 2 nights · Sun 16") and a coral pill badge | `.hero-card`: "LUT4 345 · −35.7% · 222", "Fmax 42.96 · 4 stages · 66.47", and the badge "65,536 / 65,536 pairs · 0 mismatches" |
| Huge light-weight cream headline, bottom-left | "I arrange rocks until they think." in Unbounded 400 |
| Coral pill CTA with ↗ next to a plain text link | `.btn--coral` and `.btn--text` |
| Five-column feature row with line icons and a **coral progress segment** | `.features`: recognition items; the segment cycles every 3.2 s and pauses on hover |

**Palette:** navy `#14213D`, cream `#F4EDE0`, coral `#FF6B5B`. Text on coral buttons is navy, which gives about 5.7:1 contrast. In light mode, coral text darkens to `#B53A29` so it passes AA on cream.

**Type:** The fonts asked for (SK Nomerok, Nerro, Xenon Nue) are commercial or have unclear licences, so the site uses free Google Fonts with the same wide, geometric feel: **Unbounded** for display, **Manrope** for body and **Martian Mono** for labels.

**Liquid glass:** `.glass` combines `backdrop-filter: blur(22px) saturate(170%)`, a translucent cream fill, an inner top highlight and a diagonal specular sheen (`::after`). A fixed page-wide aurora sits behind the content so the glass always has colour to refract. Browsers without `backdrop-filter` fall back to an opaque fill.

## 7. Interaction references (v3)

### Himanshu Singh, [himanshus-design.vercel.app](https://himanshus-design.vercel.app/) (via Wall of Portfolios)
- **Concept:** "Himanshu's Playground", an infinite, draggable canvas ("drag to explore") on a green pixel-terrain background with a protractor ruler. Work pieces sit on the canvas like objects on a desk.
- **The "unwrap" effect:** the résumé is a **pinned sheet of paper simulated as cloth**: a 9×12 Verlet particle grid with structural, shear and bend constraints, pinned at the top-centre. It's rendered to a canvas with per-triangle affine texture mapping and lighting from the triangle normals, so the paper's back face shows when it curls. Hovering ruffles it, grabbing a point lets you bend and peel it in 3D, and a click (no drag) opens a viewer that **slides up** from the bottom (`translateY(100%) → 0`, `cubic-bezier(.77,0,.18,1)`).
- **Background:** the pixel terrain ripples like water around the cursor (radial `sin` waves in a noise heightfield).

**Adapted here (`js/cloth.js`):** the same idea, implemented from scratch for the CV section. The sheet starts **rolled up like a scroll and unrolls under gravity** the first time it scrolls into view. Hovering ruffles it, you can drag and bend it, and clicking opens the résumé viewer. With reduced motion it renders flat and still opens on click.

### Shalmali Gaikwad, [meshmeadow.vercel.app](https://meshmeadow.vercel.app/) (via Wall of Portfolios)
- React and Framer Motion on a pink pastel canvas with 3D-character illustrations, draggable carousels (`drag="x"`) and bouncing headline letters.
- **Cursor:** custom pixel-art SVG cursors (`cursor-default.svg` arrow, `cursor-pointer.svg` hand) applied site-wide through CSS `cursor: url(...)`.

**Adapted here (`js/cursor.js`):** rather than a static pixel cursor, a **liquid-glass water droplet**. A precise cream dot tracks the pointer, while a frosted lens (backdrop blur and brightness, a specular highlight, inner shadows) glides behind it with easing. The lens **stretches along its velocity** like a moving drop, sheds **ripple rings** as it moves, splashes on click and swells over interactive elements. It only runs on fine pointers (desktop) and is turned off for reduced motion.

### Résumé "black screen" fix
Opening the PDF in a new tab hands it to the browser's PDF viewer. That viewer shows a dark grey or black canvas while it loads, and in-app browsers (Instagram, LinkedIn, WhatsApp) often can't render PDFs at all. The site now opens an **in-page viewer** that slides up and shows a pre-rendered image of the page (`assets/resume-page.jpg`) with a shimmer placeholder. The image is preloaded when you hover a trigger, so it's ready when the panel arrives. "Open PDF" and "Download" are still there for the real file.

### Draggable windows: assessment (not built)
Both references let you drag things around: Himanshu's whole site is a draggable canvas, and Meshmeadow has draggable carousels. A "desktop with draggable windows" metaphor would suit an FPGA/RTL portfolio. For example, a **Lab Bench** section could have floating windows for a GTKWave-style waveform of the async FIFO, a terminal replaying the MRPM testbench, a KiCad board render and the résumé. Windows would drag, focus to the front, minimise to a dock and snap back.
- **Viable:** yes. Pointer events plus `transform`, a z-index stack and an optional snap grid come to about 200–300 lines of vanilla JS, with no framework needed.
- **Fun:** high. It turns "I verify hardware" into something visitors can poke at.
- **Costs:** keyboard and screen-reader access need a non-drag fallback. Phones have no room for windows, so it would collapse to stacked cards there. Recruiters skimming for 30 seconds may not discover it. Overlapping windows can also hide content.
- **Recommendation:** add it as one **contained section** (a playground) under a normal scrolling page, not as the whole site, so the fast recruiter path stays intact.

## 8. Round 4 changes

- **Separate pages.** The site is no longer one long scroll. Each nav item shows its own page (hash-routed, with the back button, deep links, per-page titles and a previous/next pager in the footer). Without JavaScript it falls back to the full scrolling page.
- **Clickable project cards.** The whole card opens the repo. Four projects have no public repo (RISC-V core, FemtoRV SoC, ultrasonic ranging, RPi intrusion detector), so they say "No public repo yet" and aren't clickable.
- **Research cut-off fixed.** The research card and the cloth résumé both used the class `.paper`, so the research card inherited the cloth's fixed height (~335px) with `overflow: hidden`. The research card is now `.study`.
- **Photo rings removed.** Both photos are plain circles, and the coral outline on the small nav avatar is gone.
- **Contact puns.** "Let's ___ that sh*t." with a rotating verb (build, debug, synthesise, ship, route, measure, tape out), plus pun cards for email, GitHub, résumé and time zone.

## 9. Deliberately left out

- **Phone number and CGPA** are not in the page text. Both do appear in the linked résumé PDF, which he chose to publish.
- **RCAAI.** The paper was accepted, but he didn't proceed with it, so the site doesn't claim a publication.
- **Letter of recommendation quotes.** LORs are usually confidential.
- **Named target labs and programmes** (EPFL E3, USTC). These are application details, not portfolio content.
- **The `SIH_internal_code_ados` repo link.** That repo has committed AWS IoT private keys. The project is described, but the repo isn't linked until the keys are revoked and purged from history.
- **Items marked [Inferred]** in the profile, such as interests guessed from forks.
