# Shop Class Hub

A modular static site for Baypath RVTHS. GitHub Pages serves it directly; no build step or package manager is required.

## Where to make changes

| Task | File |
|---|---|
| Site name, colors, banner, homepage cards, quick links | `data/site-config.js` |
| Main tabs and subtabs | `data/navigation.js` |
| Project descriptions, schematics, parts, steps, files | `data/projects.js` |
| Other page copy and cards | `data/pages.js` |
| Layout and visual styling | `assets/css/styles.css` |

## Project library

The gallery starts with three editable reference builds:

- **555 Timer LED Flasher** — an astable timer circuit with a roughly one-second blink.
- **LED and Current-Limiting Resistor** — LED polarity, series resistance, and Ohm's law.
- **NPN Transistor as a Switch** — a low-side switch controlled by a pushbutton.

Each object in `data/projects.js` defines the gallery card and detail page: main image, schematic, parts list, tools, build sequence, gallery, and links. Copy an object, choose a unique URL-friendly `slug`, then update its content. Project pages are generated automatically.

Upload local photos or diagrams to `assets/images/` and reference them with paths such as `assets/images/my-project.jpg`. PDFs can live in `assets/files/` and be linked from the project's `files` list.

## Add a tab

1. Add a route in `data/navigation.js`. Nested `children` arrays create subtabs.
2. For a regular content page, add the same path in `data/pages.js`.
3. Project detail routes are generated from the project's `slug` and do not need a separate page entry.

## Customize appearance

Open `data/site-config.js` to adjust the theme colors, banner, homepage shortcuts, and quick links. Use `assets/css/styles.css` for deeper spacing, typography, or layout changes.

## Publish

Commit changes to `main`. GitHub Pages deploys them automatically after the build completes.

## Notes

- This is a public static website. Do not upload private student information or restricted class files.
- The example circuits use low-voltage DC. Check the exact component datasheets and follow the instructor's directions before powering a circuit.
