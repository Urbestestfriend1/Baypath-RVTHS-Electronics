/*
  SITE CONFIGURATION
  Change the homepage text and image paths here. Replace files inside assets/images/
  whenever you want new visuals; keep the matching image path below up to date.
*/
window.SHOP_CONFIG = {
  brand: "WORKSHOP",
  tagline: "SHOP CLASS HUB",
  intro: "A better home for schematics, project ideas, class references, and the things you make.",
  heroTitleTop: "Build skills.",
  heroTitleAccent: "Make things.",
  heroImage: "assets/images/workshop-banner.svg",
  heroImageAlt: "Illustrated workshop bench with project plans and tools",
  homeCards: [
    { eyebrow: "PLANS / DRAWINGS", title: "Schematics", description: "Project plans and technical drawings organized by grade and topic.", image: "assets/images/schematic.svg", imageAlt: "Technical plan on a blueprint grid", path: "/schematics", linkLabel: "Explore schematics" },
    { eyebrow: "IDEAS / BUILDS", title: "Project gallery", description: "Collect finished projects, in-progress builds, and inspiration.", image: "assets/images/project.svg", imageAlt: "Wooden project on a workbench", path: "/projects", linkLabel: "Browse projects" },
    { eyebrow: "SHARED KNOWLEDGE", title: "Common references", description: "Useful diagrams and notes that apply across grades.", image: "assets/images/resources.svg", imageAlt: "Reference notebook and drafting tools", path: "/schematics/common", linkLabel: "Open references" },
    { eyebrow: "READY FOR THE SHOP", title: "Resources", description: "Create a reliable home for approved guides and class resources.", image: "assets/images/resources.svg", imageAlt: "Workshop tools neatly arranged", path: "/resources", linkLabel: "Browse resources" }
  ],
  feature: {
    eyebrow: "A LIBRARY THAT GROWS",
    title: "From first sketch to finished build.",
    description: "Add drawings, photos, material lists, instructions, and helpful links as the semester moves along.",
    image: "assets/images/project.svg",
    imageAlt: "Project workbench illustration",
    path: "/projects",
    linkLabel: "Explore the project space"
  }
};
