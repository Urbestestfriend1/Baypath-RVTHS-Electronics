# Workshop — Shop Class Hub

A modular, responsive static site for GitHub Pages. It has a designed home page, replaceable image assets, nested navigation, page search, breadcrumb navigation, and content that is kept separate from the layout code.

## Publish with GitHub Pages

1. Open this repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose branch **main** and folder **/(root)**, then save.
5. After the deployment finishes, use the URL displayed on the Pages settings screen.

There is no build step or package manager. Changes pushed to `main` will be published by Pages when enabled.

## Project layout

```
index.html                   Main HTML shell and script/style links
data/
  site-config.js             Homepage text, cards, and image paths
  navigation.js              Top tabs, subtabs, and hierarchy
  pages.js                   Page titles, descriptions, sections, cards
assets/
  css/styles.css             Theme and responsive design
  js/app.js                  Navigation, search, and page rendering
  images/                    Replaceable SVG artwork and future photos
```

## Edit the homepage and images

Open `data/site-config.js`. Change the values under `heroTitleTop`, `heroTitleAccent`, and `intro` to update the hero area. Change `heroImage` to change the large banner. Each `homeCards` entry has its own `image`, `imageAlt`, and text.

To replace an image, add the file under `assets/images/` and update the matching image path. JPG, PNG, WebP, and SVG are suitable formats; compressed JPG/WebP generally work well for photos. Update the alt text when the picture changes.

## Add a page or subtab

1. Open `data/navigation.js` and add a navigation item with a unique path, for example:
   ```js
   { label: "Measurement charts", path: "/schematics/common/measurement-charts" }
   ```
2. Open `data/pages.js` and add an object with the same path as its key:
   ```js
   "/schematics/common/measurement-charts": {
     eyebrow: "SCHEMATICS / COMMON",
     title: "Measurement charts",
     description: "Reference charts for the shop.",
     sections: [
       {
         heading: "Quick reference",
         text: "Explain what this chart covers.",
         image: "assets/images/measurement-chart.png",
         imageAlt: "Shop measurement chart"
       }
     ]
   }
   ```
3. Add the image at the specified path, if used, and commit the changes.

A `children` array on a navigation entry creates subtabs beneath it. Give every page a matching entry in `data/pages.js`.

## Edit a page

In `data/pages.js`, every page can have:
- `eyebrow`, `title`, `description`
- `sections`: each section supports `heading`, `text`, optional `image`, `imageAlt`, and `bullets`
- `cards`: optional cards with `title`, `description`, `image`, `imageAlt`, `tag`, and optionally `path` and `linkLabel`
- `callout`: optional highlighted note with `title` and `text`

Keep these fields as text, not raw HTML.

## Change the design

Edit `assets/css/styles.css`. The main theme variables are at the top under `:root`, including `--bg`, `--panel`, `--text`, and `--lime`.

## Notes

- This is a static website. GitHub Pages can serve pages, images, downloads, and client-side interactions, but it does not provide private user accounts or a secure database by itself.
- A public repository and public Pages site are visible to others. Don't upload private student information or restricted class files; follow school policy and teacher instructions.
- Use teacher-approved material for safety procedures. This starter site is not a replacement for instruction or supervision.
