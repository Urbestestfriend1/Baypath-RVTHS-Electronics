# Quick editing guide

## Start here: `data/site-config.js`

This is the main customization file.

- **Website title:** `brand` and `tagline`
- **Colors:** the values under `theme`
- **Homepage banner:** `heroImage`
- **Homepage words:** `heroTitleTop`, `heroTitleAccent`, `intro`
- **Homepage shortcut cards:** `homeCards`
- **Quick links on the home page:** `quickLinks`

## Add a picture

Upload it into `assets/images/`. Then paste its path into the field you want to use, such as:

```js
heroImage: "assets/images/my-workshop-photo.jpg"
```

For the banner, use a wide landscape photo.

## Add a project

Open `data/projects.js`, copy the sample project object, and give it a new unique `slug`. Change the title, grade, category, summary, photos, schematic, materials, tools, instructions, gallery, and files. The project detail page is made automatically.

Set `featured: true` if you want the project shown on the homepage. Change `template: false` once the sample has become a real project.

## Change tabs and pages

- Tabs and subtabs: `data/navigation.js`
- Normal page text and images: `data/pages.js`

New normal pages need both a navigation entry and a matching entry in `data/pages.js`. Project pages only need a project object.

## Publish

Commit your edits to `main`. GitHub Pages republishes the site automatically. See `README.md` for examples and more detail.
