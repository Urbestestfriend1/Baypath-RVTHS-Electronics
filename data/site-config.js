/*
  SHOP CLASS HUB — SIMPLE SITE SETTINGS
  This is the first file to edit when you want to customize the site.
  Change the text, colors, banner, and homepage shortcuts below.
  For project content, use data/projects.js. For tabs, use data/navigation.js.
*/
window.SHOP_CONFIG = {
  brand: "SHOP CLASS",
  tagline: "BAYPATH RVTHS",
  schoolName: "Baypath Regional Vocational Technical High School",

  // Theme colors. Use standard hex colors, e.g. "#17191b".
  theme: {
    background: "#111315",
    surface: "#191c1f",
    raised: "#222629",
    border: "#363b40",
    text: "#e9e9e5",
    muted: "#b0b5b5",
    dim: "#858d91",
    accent: "#d9b76b"
  },

  // Homepage banner: replace with a local path such as "assets/images/my-banner.jpg"
  // or a direct image URL. A wide landscape photo works best.
  heroEyebrow: "BAYPATH REGIONAL VOCATIONAL TECHNICAL HIGH SCHOOL",
  heroTitleTop: "SHOP CLASS",
  heroTitleAccent: "Build skills. Make things.",
  intro: "Your home for project builds, schematics, and useful shop references.",
  heroImage: "https://images.unsplash.com/photo-1773325076569-c166714c4097?auto=format&fit=crop&fm=jpg&ixid=NHwxMjA3fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
  heroImageAlt: "Workshop bench with tools and work surfaces",

  // Homepage shortcut cards. Add, remove, or reorder these entries.
  homeCards: [
    { eyebrow: "PLANS / DRAWINGS", title: "Schematics", description: "Project plans and technical drawings, organized by grade.", image: "assets/images/schematic.svg", imageAlt: "Technical schematic drawing", path: "/schematics", linkLabel: "Browse schematics" },
    { eyebrow: "BUILDS / DOCUMENTATION", title: "Projects", description: "Photos, schematics, materials, and build steps in one place.", image: "assets/images/project.svg", imageAlt: "Project on a workbench", path: "/projects", linkLabel: "View projects" },
    { eyebrow: "SHARED REFERENCES", title: "Common references", description: "Useful information shared across grades and projects.", image: "assets/images/resources.svg", imageAlt: "Workshop reference tools", path: "/schematics/common", linkLabel: "Open common" },
    { eyebrow: "CLASS SUPPORT", title: "Resources", description: "Safety material, tool information, and class references.", image: "assets/images/resources.svg", imageAlt: "Workshop reference tools", path: "/resources", linkLabel: "Open resources" }
  ],

  // Links shown in the homepage side panel.
  quickLinks: [
    { label: "Common schematics", path: "/schematics/common" },
    { label: "Shop safety", path: "/resources/safety" },
    { label: "Tools & equipment", path: "/resources/tools" },
    { label: "All projects", path: "/projects" }
  ]
};
