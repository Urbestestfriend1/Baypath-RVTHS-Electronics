/*
  SHOP CLASS HUB — SITE SETTINGS
  Common updates: name, colors, banner, homepage shortcuts, and quick links.
  Project details live in data/projects.js; tab structure lives in data/navigation.js.
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
  intro: "Project plans, circuit references, and step-by-step build guides for the work we do in class.",
  heroImage: "https://images.unsplash.com/photo-1773325076569-c166714c4097?auto=format&fit=crop&fm=jpg&ixid=NHwxMjA3fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
  heroImageAlt: "Workshop bench with tools and work surfaces",
  homeCards: [
    { eyebrow: "CIRCUIT DIAGRAMS", title: "Schematics", description: "Drawings grouped by grade, plus a shared circuit shelf.", image: "assets/images/schematic.svg", imageAlt: "Circuit schematic drawing", path: "/schematics", linkLabel: "Browse drawings" },
    { eyebrow: "BUILDS & NOTES", title: "Projects", description: "Project pages with schematics, parts, steps, and photos.", image: "assets/images/cover-555-timer.svg", imageAlt: "555 timer LED flasher circuit", path: "/projects", linkLabel: "Browse projects" },
    { eyebrow: "SHARED CIRCUITS", title: "Common circuits", description: "Useful examples such as the 555 timer and transistor switch.", image: "assets/images/cover-transistor-switch.svg", imageAlt: "Transistor switch circuit", path: "/schematics/common", linkLabel: "View circuits" },
    { eyebrow: "CLASS REFERENCE", title: "Resources", description: "Shop safety, tools, and general class information.", image: "assets/images/resources.svg", imageAlt: "Workshop reference illustration", path: "/resources", linkLabel: "View resources" }
  ],
  quickLinks: [
    { label: "Common circuits", path: "/schematics/common" },
    { label: "Shop safety", path: "/resources/safety" },
    { label: "Tools & equipment", path: "/resources/tools" },
    { label: "All projects", path: "/projects" }
  ]
};
