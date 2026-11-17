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
| Research page renders empty | Research section built around the **RCAAI paper** with headline numbers, plus open research questions |
| "Recent Projects" heading repeated 8× in the DOM | Semantic, de-duplicated markup (`section`, `article`, `nav`, skip link, ARIA states) |
| Logos without numbers | **Quantified results** throughout (−35.7% LUT4, +55% Fmax, 65,536 pairs, 360,000 transfers) |
| Content spread over 6 pages | Single page with anchored sections; the nav highlights the current section |
| Light theme only | Dark and light themes that follow the OS setting, plus a manual toggle |

## 5. Translating it to Aditya

| Reference element | Aditya's version |
|---|---|
| "Howdy! I'm Namai" | "Hey! I'm Aditya." |
| Roles line | RTL Designer · FPGA Tinkerer · Board Bring-up · Hackathon Regular |
| Headshot | An animated **testbench terminal** showing his real results, since verification is his signature |
| "Featured by" (NASA) | **Recognised by:** RCAAI paper, SIH 2024 finalist, AtomQuest semi-finalist, HackWithMAIT 3rd |
| "Imagine it build it" | "I don't trust a board until I've measured it working." |
| Softwares logo grid | Grouped **Toolbox**: HDL, simulation and FPGA, boards and analog, lab bench, platforms, Python |
| Visual identity | A **"thinking rocks"** theme: copper PCB traces with signal pulses, a chip logo, and a layer stack from software down to the physics of the board |

## 6. Deliberately left out

- **Phone number.** It's in the profile, but it doesn't belong on a public site.
- **CGPA.** Not shown; it can be added to the CV section if wanted.
- **Letter of recommendation quotes.** LORs are usually confidential.
- **Named target labs and programmes** (EPFL E3, USTC). These are application details, not portfolio content.
- **The `SIH_internal_code_ados` repo link.** That repo has committed AWS IoT private keys. The project is described, but the repo isn't linked until the keys are revoked and purged from history.
- **Items marked [Inferred]** in the profile, such as interests guessed from forks.
