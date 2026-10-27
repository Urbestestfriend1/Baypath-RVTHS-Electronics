/*
  NAVIGATION TREE
  Projects are grouped by class year. Schematics is the shared library of reusable circuits.
*/
window.SHOP_NAVIGATION = [
  { label: "Home", path: "/", icon: "⌂" },
  { label: "Inventory", path: "/inventory", icon: "▦" },
  { label: "Schematics", path: "/schematics", icon: "▤", children: [
    { label: "Common circuits", path: "/schematics/common" }
  ]},
  { label: "Spotlights", path: "/spotlights", icon: "✦" },
  { label: "Projects", path: "/projects", icon: "◇", children: [
    { label: "Freshman", path: "/projects/freshman", image: "assets/images/cover-555-timer.png", children: [
      { label: "Projects", path: "/projects/freshman/projects" }
    ]},
    { label: "Sophomore", path: "/projects/sophomore", image: "assets/images/cover-led-current.png", children: [
      { label: "Projects", path: "/projects/sophomore/projects" }
    ]},
    { label: "Junior", path: "/projects/junior", image: "assets/images/cover-transistor-switch.png", children: [
      { label: "Projects", path: "/projects/junior/projects" }
    ]},
    { label: "Senior", path: "/projects/senior", image: "assets/images/workshop-banner.png", children: [
      { label: "Projects", path: "/projects/senior/projects" }
    ]}
  ]},
  { label: "Resources", path: "/resources", icon: "⌁", children: [
    { label: "Safety", path: "/resources/safety" },
    { label: "Tools & equipment", path: "/resources/tools" }
  ]},
  { label: "About", path: "/about", icon: "i" }
];
