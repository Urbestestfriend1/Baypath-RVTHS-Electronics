# Shop Class — Baypath RVTHS

A modular, responsive static website for GitHub Pages. The design uses a dark workshop theme, a full-width homepage banner, nested navigation, instant client-side page changes, searchable sections, and reusable project detail pages.

## GitHub Pages

This repository is configured around a static site with no build step.

1. Open **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Use branch **main** and folder **/(root)**.
4. Save. GitHub Pages will publish the current files after the build finishes.

## File map

```
index.html                   Shared HTML shell
data/
  site-config.js             Brand, homepage wording, banner and card images
  navigation.js              Tabs and nested subtabs
  pages.js                   Copy and sections for ordinary pages
  projects.js                Project catalog and reusable project-page data
assets/
  css/styles.css             Color theme, layout, responsive styling
  js/app.js                  Navigation, search, page and project rendering
  images/                    Replaceable local image files and icon
```

## Change the banner or homepage

Open `data/site-config.js` and edit:
- `heroImage`: path to the wide banner.
- `heroImageAlt`: accessible description of the image.
- `heroTitleTop`, `heroTitleAccent`, and `intro`: homepage text.
- `homeCards`: homepage shortcuts, with an image and route per card.

To use your own photo, upload it into `assets/images/` and point `heroImage` to it. A wide landscape image (roughly 1800 × 600 px or similar) works well. The banner is full-bleed across the top; the text is a separate HTML overlay, so changing the photo does not mean editing the design.

## Replace an image

1. Add your photo or drawing to `assets/images/` (prefer JPG or WebP for photos, PNG for transparent screenshots, and SVG for vector drawings).
2. Change the image path in `data/site-config.js`, `data/pages.js`, or `data/projects.js`, depending on where it's used.
3. Commit the change. No code changes are required beyond the image path.

## Add a tab or subtab

Edit `data/navigation.js`. Each navigation entry has a label and a unique route path. Nested `children` arrays make subtabs.

Example:
```js
{ label: "Measurement charts", path: "/schematics/common/measurement-charts" }
```

For all ordinary pages, also add a matching entry in `data/pages.js`:
```js
"/schematics/common/measurement-charts": {
  eyebrow: "SCHEMATICS / COMMON",
  title: "Measurement charts",
  description: "Useful measurement references for the shop.",
  sections: [
    {
      heading: "Quick reference",
      text: "Add a short explanation.",
      image: "assets/images/measurement-chart.png",
      imageAlt: "Measurement chart"
    }
  ]
}
```

`/projects` is special: it is rendered from `data/projects.js` and does not need a separate entry in `data/pages.js`.

## Reusable project page template

Edit `data/projects.js`. The file contains an example object with all the main fields. Copy the object for a new project and change the `slug` to a unique URL-friendly value.

Each project can have:
- `title`, `slug`, `grade`, `category`, `status`, and `summary`
- `featuredImage` and `featuredImageAlt`
- `description` and `objectives`
- `schematicImage` and `schematicAlt`
- `materials` (name, quantity, notes) and `tools`
- `steps` (title, instructions, optional image)
- `gallery` (image, alt text, caption)
- `files` (label, href, description) and `notes`
- `featured: true` to show it on the homepage
- `template: true` to label the entry as a sample

Example paths:
- Gallery: `#/projects`
- Project detail: `#/projects/project-template`

Upload images into `assets/images/` and set the relevant paths. You can include PDF schematics in the repository as well, for example under a new `assets/files/` folder, then point `schematicImage` or `files[].href` to the relevant file. For a PDF, a download link in `files` is often better than trying to show it as an image.

## Edit the design

Open `assets/css/styles.css`. The main theme colors are at the top in `:root`:
- `--bg`: main background
- `--surface` and `--surface-2`: panels
- `--text`, `--muted`: text colors
- `--accent`: yellow highlight color

## Notes

- This is a static website. GitHub Pages serves pages, photos, PDFs and client-side features but does not provide private accounts or a secure database by itself.
- Repository files and a public Pages site may be visible to anyone. Do not upload private student information or restricted class materials. Follow school policies.
- Keep safety information aligned with the official material and instructions provided by your teacher.
