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

## 7. Deliberately left out

- **Phone number and CGPA** are not in the page text. Both do appear in the linked résumé PDF, which he chose to publish.
- **RCAAI.** The paper was accepted, but he didn't proceed with it, so the site doesn't claim a publication.
- **Letter of recommendation quotes.** LORs are usually confidential.
- **Named target labs and programmes** (EPFL E3, USTC). These are application details, not portfolio content.
- **The `SIH_internal_code_ados` repo link.** That repo has committed AWS IoT private keys. The project is described, but the repo isn't linked until the keys are revoked and purged from history.
- **Items marked [Inferred]** in the profile, such as interests guessed from forks.
