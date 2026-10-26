/*
  SITE CONFIGURATION
  Change homepage wording and image paths here.
  Replace assets/images/workshop-banner.svg with your own photo, or change heroImage
  to a file you upload into assets/images/.
*/
window.SHOP_CONFIG = {
  brand: "SHOP CLASS",
  tagline: "BAYPATH RVTHS",
  heroEyebrow: "BAYPATH REGIONAL VOCATIONAL TECHNICAL HIGH SCHOOL",
  heroTitleTop: "SHOP CLASS",
  heroTitleAccent: "Build skills. Make things.",
  intro: "Your home for project builds, schematics, and useful shop references.",
  heroImage: "assets/images/workshop-banner.svg",
  heroImageAlt: "Workshop bench illustration with plans and tools",
  homeCards: [
    { eyebrow: "PLANS / DRAWINGS", title: "Schematics", description: "Find drawings and diagrams, organized by grade and topic.", image: "assets/images/schematic.svg", imageAlt: "Technical schematic drawing", path: "/schematics", linkLabel: "Open schematics" },
    { eyebrow: "BUILDS / DOCUMENTATION", title: "Projects", description: "Project pages with photos, plans, materials, and build steps.", image: "assets/images/project.svg", imageAlt: "Project on a workbench", path: "/projects", linkLabel: "View projects" },
    { eyebrow: "SHARED REFERENCES", title: "Common", description: "Helpful references used across grades and projects.", image: "assets/images/resources.svg", imageAlt: "Workshop reference tools", path: "/schematics/common", linkLabel: "Open common" }
  ]
};
