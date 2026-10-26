/*
  SHOP CLASS HUB — SITE SETTINGS
  Edit this file for the site name, theme palette, homepage library cards, and quick links.
  Project records live in data/projects.js; inventory records live in data/inventory.js.
*/
window.SHOP_CONFIG = {
  brand: "ELECTRONICS",
  tagline: "BAYPATH RVTHS",
  schoolName: "Baypath Regional Vocational Technical High School",
  theme: {
    background: "#0b0b0f",
    surface: "#141419",
    raised: "#1d1d24",
    border: "#34343d",
    text: "#eeeeF3",
    muted: "#b9b9c3",
    dim: "#91919d",
    accent: "#b5a4d4"
  },
  heroEyebrow: "BAYPATH REGIONAL VOCATIONAL TECHNICAL HIGH SCHOOL",
  heroTitleTop: "ELECTRONICS",
  heroTitleAccent: "Plan it. Build it. Test it.",
  intro: "A working reference for shop projects, schematics, parts, equipment, and the details that help a build go right.",
  heroImage: "assets/images/inventory-shelf.svg",
  heroImageAlt: "Illustration of organized labeled component storage bins",
  homeCards: [
    {
      eyebrow: "PARTS / LOCATIONS / COUNTS",
      title: "Inventory",
      description: "Search the master shop catalog by part number, name, category, storage area, quantity, or notes. Filter and sort the complete list, review stock status, and export the current results when you need to work with the data in a spreadsheet.",
      image: "assets/images/inventory-shelf.svg",
      imageAlt: "Organized component drawers with part labels",
      path: "/inventory",
      linkLabel: "Find a part"
    },
    {
      eyebrow: "BUILD / DOCUMENT / TEST",
      title: "Projects",
      description: "Follow a project from its purpose and design choices through the schematic, parts and tools, numbered assembly steps, verification checks, and troubleshooting notes. Keep the reasons behind the design close to the actual build procedure.",
      image: "assets/images/cover-555-timer.svg",
      imageAlt: "555 timer LED flasher project illustration",
      path: "/projects",
      linkLabel: "Browse project files"
    },
    {
      eyebrow: "CIRCUITS / DIAGRAMS",
      title: "Schematics",
      description: "Open circuit drawings by class year or use the common-circuit shelf for shared references. Use each diagram to plan connections and check your wiring, while confirming part ratings and pinouts from the relevant datasheet.",
      image: "assets/images/schematic.svg",
      imageAlt: "Technical circuit-planning illustration",
      path: "/schematics",
      linkLabel: "Browse drawings"
    },
    {
      eyebrow: "SHARED TECHNICAL REFERENCE",
      title: "Common circuits",
      description: "Review reusable circuit examples for timing, LED current limiting, and transistor switching. Each reference includes the design idea, a schematic, component list, build instructions, and ways to test the result.",
      image: "assets/images/cover-transistor-switch.svg",
      imageAlt: "Small transistor switch project illustration",
      path: "/schematics/common",
      linkLabel: "Open circuit shelf"
    },
    {
      eyebrow: "SAFETY / EQUIPMENT / CLASS",
      title: "Resources",
      description: "Find shop safety material, tool and equipment references, and shared class notes. The goal is to keep practical information easy to locate and close at hand when working at the bench.",
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
