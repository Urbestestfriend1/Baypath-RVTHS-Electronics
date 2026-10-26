/*
  SHOP CLASS HUB — SITE SETTINGS
  Edit this file for the site name, theme palette, homepage library cards, and quick links.
  Project records live in data/projects.js; inventory records live in data/inventory.js.
*/
window.SHOP_CONFIG = {
  brand: "SHOP CLASS",
  tagline: "BAYPATH RVTHS",
  schoolName: "Baypath Regional Vocational Technical High School",
  theme: {
    background: "#090711",
    surface: "#120f1e",
    raised: "#1c1730",
    border: "#312746",
    text: "#f4f0ff",
    muted: "#c1b7d9",
    dim: "#9284ae",
    accent: "#c9a8ff"
  },
  heroEyebrow: "BAYPATH REGIONAL VOCATIONAL TECHNICAL HIGH SCHOOL",
  heroTitleTop: "SHOP CLASS",
  heroTitleAccent: "Plan it. Build it. Test it.",
  intro: "A working reference for shop projects, schematics, parts, equipment, and the details that help a build go right.",
  heroImage: "assets/images/inventory-shelf.svg",
  heroImageAlt: "Illustration of organized labeled component storage bins",
  homeCards: [
    {
      eyebrow: "BUILD / DOCUMENT / TEST",
      title: "Projects",
      description: "Follow a project from its purpose and design decisions through the schematic, parts list, numbered assembly steps, verification checks, and troubleshooting notes.",
      image: "assets/images/cover-555-timer.svg",
      imageAlt: "555 timer LED flasher project illustration",
      path: "/projects",
      linkLabel: "Browse project files"
    },
    {
      eyebrow: "PARTS / LOCATIONS / COUNTS",
      title: "Inventory",
      description: "Search a master stock catalog by part number, name, category, storage area, quantity, or notes. Filter and sort the full list, then export the current results to CSV.",
      image: "assets/images/inventory-shelf.svg",
      imageAlt: "Organized component drawers with part labels",
      path: "/inventory",
      linkLabel: "Find a part"
    },
    {
      eyebrow: "CIRCUITS / DIAGRAMS",
      title: "Schematics",
      description: "Open circuit drawings by class year or use the common-circuit shelf for shared references. Each diagram is meant to support the actual planning and wiring work.",
      image: "assets/images/schematic.svg",
      imageAlt: "Technical circuit-planning illustration",
      path: "/schematics",
      linkLabel: "Browse drawings"
    },
    {
      eyebrow: "SHARED TECHNICAL REFERENCE",
      title: "Common circuits",
      description: "A set of reusable circuit examples for timing, LED current limiting, and transistor switching, with their own component lists and testing steps.",
      image: "assets/images/cover-transistor-switch.svg",
      imageAlt: "Small transistor switch project illustration",
      path: "/schematics/common",
      linkLabel: "Open circuit shelf"
    },
    {
      eyebrow: "SAFETY / EQUIPMENT / CLASS",
      title: "Resources",
      description: "Keep shop safety information, tool and equipment references, and shared class notes together in one place so useful details are easier to locate.",
      image: "assets/images/resources.svg",
      imageAlt: "Shop tools and safety reference illustration",
      path: "/resources",
      linkLabel: "Open resources"
    }
  ],
  quickLinks: [
    { label: "Shop inventory", path: "/inventory" },
    { label: "Common circuits", path: "/schematics/common" },
    { label: "Shop safety", path: "/resources/safety" },
    { label: "Tools & equipment", path: "/resources/tools" },
    { label: "All projects", path: "/projects" }
  ]
};
