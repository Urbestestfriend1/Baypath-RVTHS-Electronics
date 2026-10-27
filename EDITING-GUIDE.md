# Quick Editing Guide

Most updates can be made directly on GitHub: open the file, select the pencil icon, edit the text or values, then commit the change to `main`. GitHub Pages publishes the update automatically.

## Where to edit things

| What you want to change | File |
|---|---|
| Site colors, name, homepage headline, banner, and shortcuts | `data/site-config.js` |
| Tabs and subtabs | `data/navigation.js` |
| Project descriptions, design process, parts, build steps, checks, images, and links | `data/projects.js` |
| Inventory parts, counts, categories, storage paths, suppliers, and notes | `data/inventory.js` |
| Other page text and cards | `data/pages.js` |
| Overall layout, colors, spacing, and visual design details | `assets/css/styles.css` |
| Page structure and project layout logic | `assets/js/app.js` |

**For ordinary content updates, start with a data file.** You should not need to edit the JavaScript layout code to add a project or change its instructions.

## Appearance setting

The site starts in **light mode**. Select **Dark mode** in the top-right header to switch the current browser to the dark palette. The setting is saved in that browser so it stays selected across page navigation and reloads. It is a local preference: it does not change the mode for other visitors. If browser storage is blocked, the site still works with light mode as the default.

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

## Manage the shop inventory

Open `data/inventory.js`. This file is the inventory source of truth. The current 25 rows are explicitly marked as examples; their quantities, makers, and `DEMO` locations are not verified Baypath shop records. Replace or remove those rows before relying on the counts.

The inventory page includes on-page help for search, categories, storage areas, stock status, sorting, resetting filters, and exporting. It supports 25/50/100/200-row pagination too. These controls only change the current browser view. To make a permanent stock change, edit `data/inventory.js` and commit the file to GitHub.

### Pick the right category and location

- **Category describes what the item is.** Examples already used in the sample data include Resistors, Capacitors, LEDs & Displays, Integrated Circuits, Connectors, Hand Tools, and Wires & Cables. Reuse an existing category label rather than making near-duplicates such as `LED`, `LEDs`, and `LED parts`.
- **Storage area describes where it is kept.** Use a consistent room, lab, or named work area. Then record the cabinet, shelf/drawer, and bin in the `location` object. The storage-area filter uses the `area` value; the more detailed fields appear in the table and search.
- **Quantity is the counted amount, with a unit.** For example, use `quantity: 120, unit: "pcs"` for 120 individual pieces. Choose a unit that matches how the stock is issued and counted.
- **Unknown is not the same as zero.** Use `quantity: null` when no reliable count exists; the site marks that row as **Count needed**. Use `quantity: 0` only after confirming the item is out of stock.
- **Minimum quantity is the restock threshold.** If the count is positive but at or below a positive `minimumQuantity`, the row is flagged as low stock. Set a realistic minimum for commonly used consumables; avoid treating a guess as a verified count.

Each record can use these fields:

- `id`: unique internal record ID. Keep it unique.
- `partNumber`: your internal stock number or manufacturer SKU.
- `name`, `manufacturer`, `category`: the label used to recognize and group the item.
- `description` and `notes`: what the part is for, compatibility reminders, condition details, or handling information.
- `location`: an object with `area`, `cabinet`, `shelf`, and `bin` so storage can be searched and clearly displayed.
- `quantity` and `unit`: the latest counted amount and its unit (`pcs`, `sets`, `reels`, `units`, etc.). Use `null` if the count has not been verified; do not use zero to mean “unknown.”
- `minimumQuantity`: the restock threshold. A positive quantity at or below this value is shown as low stock.
- `condition`, `supplier`, `datasheet`, and `updatedAt`: optional recordkeeping and reference details.
- `recordType: "example"`: marks a demonstration row. Remove this field when the record has been replaced with real, verified shop data.

Example record:

```js
{
  id: "BAY-0001",
  partNumber: "RES-1K-025W",
  name: "1 kΩ resistor, ¼ W",
  manufacturer: "Manufacturer name",
  category: "Resistors",
  description: "Through-hole resistor for general circuit work.",
  location: {
    area: "Electronics Lab",
    cabinet: "Component cabinet A",
    shelf: "Drawer A01",
    bin: "Bin 01"
  },
  quantity: 120,
  unit: "pcs",
  minimumQuantity: 25,
  condition: "New",
  supplier: "Supplier name",
  datasheet: "",
  updatedAt: "2026-10-26",
  notes: "Verify tolerance and power rating before use."
}
```

For a large catalog, keep part numbers consistent, use the same spelling for storage areas and categories, and update the count date whenever you perform a stock check. Include units so a box, a set, and an individual part are not accidentally treated as the same quantity. CSV export exports the currently filtered result set; it does not import changes back into the website.

## Change tabs or regular pages

- Tab and subtab structure: `data/navigation.js`
- Regular page text, sections, and cards: `data/pages.js`

A regular content page normally needs a matching route in both files. Project detail pages are created from a project's slug and do not need a separate `data/pages.js` entry.

## Add images and references

Upload images into `assets/images/` and point to them from the relevant data object. JPG/WebP are useful for photos; SVG/PNG are good for schematics. PDFs can live in `assets/files/` and can be linked through a project's `files` array.

## Publish and troubleshoot

Commit the changes to `main`. GitHub Pages runs its deployment automatically. If the live site still shows an older layout, try a hard refresh with **Ctrl + Shift + R**.

The website is public. Do not upload private student information or restricted class files. The sample electronics builds are low-voltage DC examples; confirm part ratings and follow the instructor's directions before powering a circuit.


## Featured project of the week

Edit `data/projects.js`. Projects marked `featured: true` rotate in the home-page banner each Monday. Leave only one project marked true for a fixed weekly spotlight, or mark multiple projects true to rotate among them. Set `featuredBy` to the contributor's approved display name. The current reference projects do not yet contain verified contributor names, so replace the `Contributor credit pending` placeholders before publishing a named credit.

## Replacing website images

All current website image assets live in `assets/images/` as PNG files. To replace an image without changing code, upload a new PNG using the same filename and dimensions/aspect ratio where practical. The image references are in `data/projects.js`, `data/pages.js`, `data/site-config.js`, and `index.html`. Keep transparent backgrounds for marks/icons where applicable.


## Creator Spotlights (separate from build guides)

Add showcase entries in `data/spotlights.js`. The homepage chooses a published spotlight marked `featured: true` and rotates among multiple featured entries by week. Set `published: true` only when creator permission/credit, summary, story, contribution, image, and all included media are ready. The dedicated `#/spotlights/<slug>` page is for the finished creation and its impact; it does not render tutorial assembly steps.

Recommended fields: `slug`, `published`, `featured`, `title`, `creatorName`, `classYear`, `category`, `dateLabel`, `summary`, `story`, `contribution`, `highlights`, `featuredImage`, `featuredImageAlt`, optional `gallery`, and optional `videoId`.

For a video, set `videoId` to the 11-character YouTube video ID (not the full URL). The site embeds it using YouTube's privacy-enhanced `youtube-nocookie.com` player. Leave the field out if there is no approved video.


## Projects vs. Schematics

- **Projects** is organized by class year: Freshman, Sophomore, Junior, and Senior. A project record should have a `gradeLevel` (or a matching `grade` / `classYear`) of Freshman, Sophomore, Junior, or Senior to appear in that year's project list.
- **Schematics** is the shared reference shelf for reusable circuits. It focuses on what the circuit does and how to read the drawing; the linked project guide contains the full materials list and build/testing instructions.
- Three general circuit examples (555 timer, LED current limiter, NPN transistor switch) remain available as project guides and are linked from Schematics. They are not assigned to a grade unless a class record explicitly identifies the year.
- Old bookmarked `/schematics/freshman`, `/schematics/sophomore`, `/schematics/junior`, and `/schematics/senior` paths now point visitors to the new Projects structure.


## Custom invitation email template

A branded, mobile-friendly invitation template is stored at `docs/supabase-invite-email-template.html`. To apply its design, open the Supabase project dashboard, go to **Authentication → Email Templates → Invite user**, and paste in the template's HTML. The template uses Supabase's `{{ .ConfirmationURL }}` variable for the secure invite action. The live app routes confirmed invitees to its password-setup screen; the email template itself must be saved in Supabase's dashboard to change the actual email appearance.

The invitation function redirects to the site's base URL so it is more likely to match the already-approved redirect URL. The app recognizes Supabase's `type=invite` callback and provides the password form. Password-reset emails use the same base URL and open the reset-password form when Supabase returns `type=recovery`.
