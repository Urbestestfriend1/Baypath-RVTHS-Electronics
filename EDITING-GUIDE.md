# Quick Editing Guide

Most day-to-day edits are in these files. Open a file on GitHub, select the pencil icon, make the changes, then commit to `main`.

## Customize the homepage

Open `data/site-config.js`.

- `brand` and `tagline` control the site name.
- `theme` controls backgrounds, panels, borders, text, and accent color.
- `heroImage` changes the full-width banner.
- `heroTitleTop`, `heroTitleAccent`, and `intro` change the headline and introduction.
- `homeCards` controls homepage shortcuts.
- `quickLinks` controls links in the homepage side panel.

For a local image, upload the file into `assets/images/`, then set its path:

```js
heroImage: "assets/images/my-workshop-photo.jpg"
```

A wide landscape photo works best for the banner.

## Edit a project or create another one

Open `data/projects.js`. It contains three worked examples: a 555 timer LED flasher, a current-limited LED, and an NPN transistor switch.

Copy a project object and change its `slug`, title, grade, category, summary, images, facts, principle, objectives, materials, tools, steps, gallery, files, and notes. Every slug must be unique and URL-friendly, e.g. `wooden-tool-tray`. Set `featured: true` to show it on the homepage. The detail page appears automatically at `#/projects/your-slug`.

## Change tabs and regular pages

- Tab structure: `data/navigation.js`
- Regular page text/cards: `data/pages.js`

A regular page needs matching entries in both files. Project pages use the slug and need no entry in `data/pages.js`.

## Add images and schematics

Upload images into `assets/images/`, then use that path in the relevant project or page object. JPG/WebP work well for photos; SVG/PNG work well for diagrams. PDFs can be linked from `assets/files/`.

Changes publish after the commit is pushed and GitHub Pages finishes its deployment.
