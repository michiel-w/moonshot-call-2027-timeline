# Moonshot Flanders — Call 2027 Timeline

A self-contained HTML/CSS/JavaScript timeline of the key dates of the Moonshot
Flanders Call 2027 on a white background (League Spartan font). A rocket travels
along a dotted `#54b897` trajectory from Earth (bottom left: two partially
overlapping `#b8ddd1` circles at 50% opacity) to the Moon (top right, photo asset).
The rocket's position is driven by **the visitor's local date** (shown as a TODAY
badge in the top-left corner of the frame): on 30/01/2027 it sits on the
pre-proposal deadline dot, on 01/05/2027 between "selection + LOI start" and "full
proposal deadline". Each phase is marked with an orange `#fbaa00` dot and date,
plus an **i** info icon — hover, focus or tap it for details.

## Files

- `index.html` — page markup and the SVG scene (Earth, Moon, flag, trajectory, rocket)
- `style.css` — League Spartan styling, brand colours, tooltips, animations
- `script.js` — phase data, date-driven rocket position, hover tooltips
- `assets/moon.webp` — moon image (optional; a drawn moon is used as fallback)
- `assets/rocket.png` — rocket from the Moonshot logo (optional; a drawn rocket is used as fallback)

No build step and no dependencies — plain static files. The font is loaded from
Google Fonts, so the page needs internet access once to fetch League Spartan.

## Brand assets

Download the official Moonshot logo (which contains the rocket) from the
[communication guidelines page](https://www.moonshotflanders.be/en/about/communication-guidelines)
("Download logos as zip file" at the bottom), extract the rocket as
`assets/rocket.png`, and place your moon image at `assets/moon.webp` (WebP).
Brand colours: `#2AB29C`, `#19445F`, `#DDDDDD`.

## Run locally

Open `index.html` in any modern browser.

## Host on GitHub Pages

1. Push these files to a GitHub repository (repository root).
2. In the repository, go to **Settings → Pages → Build and deployment → Source**,
   choose **Deploy from a branch**, select your default branch (e.g. `main`) and
   `/` (root), then **Save**.
3. After a minute the site is live at `https://<username>.github.io/<repo>/`.

## Customize the dates or texts

Edit the `PHASES` array at the top of `script.js`. Each entry has:

- `iso` — the date as `YYYY-MM-DD` (used to place the dot on the trajectory)
- `label` — optional display label (defaults to `DD/MM/YYYY`)
- `short` — short label shown next to the dot
- `title` / `text` — shown in the hover tooltip

`START`, `END` and `ROCKET_IMAGE_OFFSET_DEG` (rocket rotation; 45 because the logo
rocket points diagonally up-right) are also at the top of `script.js`.
