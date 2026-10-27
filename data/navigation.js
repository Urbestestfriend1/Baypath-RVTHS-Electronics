/*
  NAVIGATION TREE
  Keep the primary workspace tools near the top. Every regular path should have a
  matching data/pages.js entry; /projects and /inventory use their own data files.
*/
window.SHOP_NAVIGATION = [
  { label: "Home", path: "/", icon: "⌂" },
  { label: "Inventory", path: "/inventory", icon: "▦" },
  { label: "Projects", path: "/projects", icon: "◇" },
  { label: "Spotlights", path: "/spotlights", icon: "✦" },
  { label: "Schematics", path: "/schematics", icon: "▤", children: [
    { label: "Freshman", path: "/schematics/freshman", children: [
      { label: "Projects", path: "/schematics/freshman/projects" }
    ]},
    { label: "Sophomore", path: "/schematics/sophomore", children: [
      { label: "Projects", path: "/schematics/sophomore/projects" }
    ]},
    { label: "Junior", path: "/schematics/junior", children: [
      { label: "Projects", path: "/schematics/junior/projects" }
    ]},
    { label: "Senior", path: "/schematics/senior", children: [
      { label: "Projects", path: "/schematics/senior/projects" }
    ]},
    { label: "Common circuits", path: "/schematics/common" }
  ]},
  { label: "Resources", path: "/resources", icon: "⌁", children: [
    { label: "Safety", path: "/resources/safety" },
    { label: "Tools & equipment", path: "/resources/tools" }
  ]},
  { label: "About", path: "/about", icon: "i" }
];
