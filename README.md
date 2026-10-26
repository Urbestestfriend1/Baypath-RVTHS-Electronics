# Baypath RVTHS Shop Class Hub

A modular static website for Baypath RVTHS. GitHub Pages serves the site directly; no build step or package manager is required.

## Edit the site

| Task | File |
|---|---|
| Site name, theme colors, banner, homepage cards, quick links | `data/site-config.js` |
| Main tabs and subtabs | `data/navigation.js` |
| Project descriptions, design workflow, schematics, parts, steps, checks, and files | `data/projects.js` |
| Other page copy and cards | `data/pages.js` |
| Overall layout, colors, spacing, and responsive styling | `assets/css/styles.css` |
| Navigation and page rendering logic | `assets/js/app.js` |

Use the data files for normal content changes. The layout and project-page sections are generated from those values.

## Project library

The gallery starts with three editable reference builds:

- **555 Timer LED Flasher** — an astable timer circuit with a roughly one-second blink.
- **LED and Current-Limiting Resistor** — LED polarity, series resistance, and Ohm's law.
- **NPN Transistor as a Switch** — a low-side switch controlled by a pushbutton.

Project pages now separate the work into a guided order: **Project brief → Design process → Schematic → Parts & tools → Build instructions → Test & troubleshoot → References → Gallery**.

Each project object in `data/projects.js` includes the content for its page. In particular:

- `designProcess` explains the decisions to make before assembly.
- `steps` is the numbered, physical build sequence. Each step can include `why` and `check` fields so the instruction is easier to follow and verify.
- `verification` describes expected behavior and measurements.
- `troubleshooting` lists common problems, possible causes, and fixes.

Copy a project object, choose a unique URL-friendly `slug`, then update its content. Set `featured: true` to make a project eligible for the homepage project area. The details page appears automatically at `#/projects/your-slug`.

Upload local images into `assets/images/` and reference them with paths such as `assets/images/my-project.jpg`. PDF datasheets can live in `assets/files/` and be linked through the project's `files` list.

## Add tabs or regular pages

1. Add the route in `data/navigation.js`. Nested `children` arrays create subtabs.
2. Add matching regular-page content in `data/pages.js`.
3. Project detail routes are generated from each project's `slug` and do not require a separate page entry.

## Customize appearance

Change the core colors in the `theme` object in `data/site-config.js`. Edit `assets/css/styles.css` for deeper layout and visual changes. The responsive rules are at the bottom of the stylesheet.

## Publish and safety

Commit updates to `main`; GitHub Pages deploys automatically.

This is a public static website. Do not upload private student information or restricted class files. The sample circuits are low-voltage DC examples. Verify part specifications and follow the instructor's directions before powering a circuit.
