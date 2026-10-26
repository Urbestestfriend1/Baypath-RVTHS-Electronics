# Shop Class Hub — editing guide

A dark, compact, modular website for Baypath RVTHS. It is a static website hosted with GitHub Pages; there is no build step.

## The three files you will use most

| What you want to change | Open this file |
|---|---|
| Website name, colors, homepage text, banner image, homepage shortcut cards, quick links | `data/site-config.js` |
| Main tabs and subtabs | `data/navigation.js` |
| Projects, project photos, schematic, parts list, tools, steps, gallery and downloads | `data/projects.js` |
| Other page titles, text, images and sections | `data/pages.js` |
| Layout and fonts | `assets/css/styles.css` (only for deeper design changes) |

For most updates, you do **not** need to edit `index.html` or `assets/js/app.js`.

## Change the banner or colors

Open `data/site-config.js`.

- Change `heroImage` to an image path such as `assets/images/my-banner.jpg`, or a direct image URL.
- Change `heroTitleTop`, `heroTitleAccent`, and `intro` to edit the homepage copy.
- Under `theme`, edit `background`, `surface`, `raised`, `border`, `text`, `muted`, `dim`, and `accent`. Use hex colors such as `#191c1f`.
- Edit the `homeCards` array to rename, reorder, add, or remove homepage shortcuts.
- Edit `quickLinks` to update the right-side links on the homepage.

For photos, upload the image into `assets/images/` and use that file path. Wide photos work best for the homepage banner.

## Add or edit a project

Open `data/projects.js`. Copy the sample project object and change at least:

1. `slug`: a unique URL-friendly name, like `wooden-tool-tray` (no spaces).
2. `title`, `grade`, `category`, `summary`, and `description`.
3. `featuredImage` and `featuredImageAlt`.
4. `schematicImage` and `schematicAlt`.
5. `objectives`, `materials`, `tools`, `steps`, `gallery`, `files`, and `notes`.

Upload project photos and drawings into `assets/images/` and point the fields to those paths. For PDFs, you can put files into an `assets/files/` folder and use the path in `files[].href`. Set `featured: true` to show a real project on the home page. When you turn the sample into an actual project, change `template: true` to `template: false`.

The project page is generated automatically at `#/projects/your-slug`. You do not need to create a separate HTML page.

## Add a new navigation tab or subtab

1. Add an entry to `data/navigation.js`. Nested `children` arrays create subtabs.
2. If it is a normal content page, add an entry with the same path in `data/pages.js`.
3. Routes under `/projects/...` are created automatically from the project slug and do not need a separate page entry.

Example navigation item:

```js
{ label: "Measurement charts", path: "/schematics/common/measurement-charts" }
```

Example content entry in `data/pages.js`:

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

## Save and publish changes

1. Open the file in GitHub.
2. Click the pencil icon to edit, or use **Add file → Upload files** to add pictures.
3. Commit the changes to `main`.
4. GitHub Pages publishes the changes automatically after its deployment finishes.

Changes to page content and configuration normally need only a file edit and commit.

## Notes

- All repository files and a public Pages site may be visible to anyone. Do not upload private student information or restricted class materials.
- This is a static site. It can display pages, images, PDFs, and client-side features, but it does not provide private accounts or a secure database by itself.
- Safety information should come from the official instructions supplied by the teacher.
