# Quick Editing Guide

Most updates can be made directly on GitHub: open the file, select the pencil icon, edit the text or values, then commit the change to `main`. GitHub Pages publishes the update automatically.

## Where to edit things

| What you want to change | File |
|---|---|
| Site colors, name, homepage headline, banner, and shortcuts | `data/site-config.js` |
| Tabs and subtabs | `data/navigation.js` |
| Project descriptions, design process, parts, build steps, checks, images, and links | `data/projects.js` |
| Other page text and cards | `data/pages.js` |
| Overall layout, colors, spacing, and visual design details | `assets/css/styles.css` |
| Page structure and project layout logic | `assets/js/app.js` |

**For ordinary content updates, start with a data file.** You should not need to edit the JavaScript layout code to add a project or change its instructions.

## Change the colors or homepage

Open `data/site-config.js`.

- The `theme` object controls the background, panels, borders, text, muted text, and main accent color.
- `heroTitleTop`, `heroTitleAccent`, and `intro` control the homepage headline and introduction.
- `heroImage` and `heroImageAlt` control the large banner image and its description.
- `homeCards` controls the four main homepage shortcuts.
- `quickLinks` controls the links in the homepage side panel.

To use your own image, upload it into `assets/images/`, then set its relative path, for example:

```js
heroImage: "assets/images/my-workshop-photo.jpg"
```

A wide landscape image usually works best. For deeper layout changes, edit `assets/css/styles.css`; the responsive styles are grouped near the bottom.

## Edit a project or create another one

Open `data/projects.js`. The file starts with three worked examples: a 555 timer LED flasher, an LED current-limiting circuit, and an NPN transistor switch.

Copy one full project object, paste it into the project list, then update its fields. Give every project a unique, URL-friendly `slug`, such as `wooden-tool-tray`. The project page is generated automatically at `#/projects/your-slug`. Set `featured: true` to make it eligible for the homepage project area.

### The project page has separate sections

- `summary` and `description`: what the project does and how it works.
- `facts`: short details shown near the top, such as supply voltage, skill level, and build type.
- `objectives`: what the student should learn.
- `principle`: the core idea or formula behind the circuit.
- `designProcess`: decisions to make **before** wiring or assembling the project.
- `schematicImage` and `schematicAlt`: the drawing used as the connection map.
- `materials` and `tools`: parts, quantities, ratings, and equipment.
- `steps`: numbered physical build instructions.
- `verification`: what the finished build should do and how to check it.
- `troubleshooting`: common problems, likely causes, and what to check.
- `files`: datasheets and useful outside references.
- `gallery`: photos, drawings, or other supporting images.
- `notes`: limitations, safety reminders, or extra context.

### How to write build steps

Each object in the `steps` array can use four fields. The title and description are required for a useful step; the other fields are optional.

```js
{
  title: "Wire the power",
  description: "Connect the positive supply to the board's positive rail.",
  why: "The circuit needs the correct supply voltage to operate.",
  check: "Confirm polarity and voltage before connecting power.",
  image: "assets/images/my-wiring-photo.jpg",
  imageAlt: "Power rails connected on the breadboard"
}
```

The page displays the instruction first, then separates **Why it matters** from **Check before moving on**. Use one action per step. Keep design decisions in `designProcess`; keep the actual assembly order in `steps`.

### Design process, verification, and troubleshooting

All three are editable arrays in the same project object. Each design-process item has a `title` and `description`. Each verification item also has a `title` and `description`. Each troubleshooting item has a `problem`, `cause`, and `fix`.

```js
designProcess: [
  { title: "Define the goal", description: "Write down what the finished project needs to do." }
],
verification: [
  { title: "Expected result", description: "Describe what should happen during a test." }
],
troubleshooting: [
  { problem: "The LED stays off", cause: "Polarity may be reversed.", fix: "Disconnect power and check the LED orientation." }
],
```

These fields are used to build the separate Design Process and Test & Troubleshoot sections. They are not hidden in the general project description.

## Change tabs or regular pages

- Tab and subtab structure: `data/navigation.js`
- Regular page text, sections, and cards: `data/pages.js`

A regular content page normally needs a matching route in both files. Project detail pages are created from a project's slug and do not need a separate `data/pages.js` entry.

## Add images and references

Upload images into `assets/images/` and point to them from the relevant data object. JPG/WebP are useful for photos; SVG/PNG are good for schematics. PDFs can live in `assets/files/` and can be linked through a project's `files` array.

## Publish and troubleshoot

Commit the changes to `main`. GitHub Pages runs its deployment automatically. If the live site still shows an older layout, try a hard refresh with **Ctrl + Shift + R**.

The website is public. Do not upload private student information or restricted class files. The sample electronics builds are low-voltage DC examples; confirm part ratings and follow the instructor's directions before powering a circuit.
