/*
  NAVIGATION TREE
  Add or rearrange sections here. Every path should have a matching data/pages.js entry,
  except /projects which is backed by the catalog in data/projects.js.
*/
window.SHOP_NAVIGATION = [
  { label: "Home", path: "/", icon: "⌂" },
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
    { label: "Common", path: "/schematics/common" }
  ]},
  { label: "Projects", path: "/projects", icon: "◇" },
  { label: "Resources", path: "/resources", icon: "⌁", children: [
    { label: "Shop Safety", path: "/resources/safety" },
    { label: "Tools & Equipment", path: "/resources/tools" }
  ]},
  { label: "About", path: "/about", icon: "i" }
];
