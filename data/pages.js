/*
  PAGE COPY
  Navigation is managed in data/navigation.js. Project details come from data/projects.js.
*/
window.SHOP_PAGES = {
  "/schematics": {
    eyebrow: "DRAWINGS / CIRCUITS / PLANS",
    title: "Schematics",
    description: "Circuit diagrams and project drawings, grouped by class year and shared reference.",
    sections: [{ heading: "Browse schematics", text: "Use the grade sections for class projects, or visit Common for circuits and references that are useful across the program." }],
    cards: [
      { title: "Common schematics", tag: "SHARED REFERENCE", description: "Circuit fundamentals and repeat-use examples, including the 555 timer.", image: "assets/images/schematic-555-timer.svg", imageAlt: "555 timer schematic", path: "/schematics/common", linkLabel: "View common circuits" }
    ]
  },
  "/schematics/freshman": {
    eyebrow: "SCHEMATICS / FRESHMAN",
    title: "Freshman schematics",
    description: "Foundational drawings and circuit references for first-year work.",
    sections: [{ heading: "First-year reference", text: "Simple circuits, component symbols, resistor values, and introductory diagrams belong here." }]
  },
  "/schematics/freshman/projects": {
    eyebrow: "SCHEMATICS / FRESHMAN / PROJECTS",
    title: "Freshman project schematics",
    description: "Drawings for first-year projects, from basic circuits to hands-on build exercises.",
    sections: [{ heading: "Project drawings", text: "Plans and circuit diagrams used alongside freshman project work." }]
  },
  "/schematics/sophomore": {
    eyebrow: "SCHEMATICS / SOPHOMORE",
    title: "Sophomore schematics",
    description: "Circuit plans and technical drawings for second-year work.",
    sections: [{ heading: "Second-year reference", text: "A place for more involved circuits, subsystem diagrams, and project-specific drawings." }]
  },
  "/schematics/sophomore/projects": {
    eyebrow: "SCHEMATICS / SOPHOMORE / PROJECTS",
    title: "Sophomore project schematics",
    description: "Project drawings and supporting circuit references for sophomore work.",
    sections: [{ heading: "Project drawings", text: "Plans, measurements, and supporting diagrams for second-year builds." }]
  },
  "/schematics/junior": {
    eyebrow: "SCHEMATICS / JUNIOR",
    title: "Junior schematics",
    description: "Advanced circuit diagrams and plans for third-year projects.",
    sections: [{ heading: "Third-year reference", text: "Advanced diagrams, design references, and project documentation." }]
  },
  "/schematics/junior/projects": {
    eyebrow: "SCHEMATICS / JUNIOR / PROJECTS",
    title: "Junior project schematics",
    description: "Circuit plans and supporting drawings for junior projects.",
    sections: [{ heading: "Project drawings", text: "Project schematics and technical notes for third-year builds." }]
  },
  "/schematics/senior": {
    eyebrow: "SCHEMATICS / SENIOR",
    title: "Senior schematics",
    description: "Capstone drawings, advanced circuit plans, and final-year project references.",
    sections: [{ heading: "Fourth-year reference", text: "Capstone plans, detailed schematics, and documentation for larger projects." }]
  },
  "/schematics/senior/projects": {
    eyebrow: "SCHEMATICS / SENIOR / PROJECTS",
    title: "Senior project schematics",
    description: "Plans and documentation for senior and capstone builds.",
    sections: [{ heading: "Project drawings", text: "Schematics and supporting engineering notes for senior projects." }]
  },
  "/schematics/common": {
    eyebrow: "SCHEMATICS / SHARED REFERENCE",
    title: "Common circuits",
    description: "A small library of useful circuits that come up across electronics projects.",
    sections: [{ heading: "Circuit examples", text: "These reference builds cover timing, current limiting, and transistor switching. Each page includes a schematic, parts list, build sequence, and notes on what to measure." }],
    cards: [
      { title: "555 Timer LED Flasher", tag: "TIMING CIRCUITS", description: "An astable 555 timer produces a repeating output and blinks an LED.", image: "assets/images/cover-555-timer.svg", imageAlt: "555 timer LED flasher", path: "/projects/555-timer-led-flasher", linkLabel: "Open circuit" },
      { title: "LED and Current-Limiting Resistor", tag: "CIRCUIT FUNDAMENTALS", description: "Use Ohm's law to estimate current in a simple series circuit.", image: "assets/images/cover-led-current.svg", imageAlt: "LED and current-limiting resistor circuit", path: "/projects/led-current-limiter", linkLabel: "Open circuit" },
      { title: "NPN Transistor as a Switch", tag: "TRANSISTORS", description: "A small control current switches an LED load through an NPN transistor.", image: "assets/images/cover-transistor-switch.svg", imageAlt: "NPN transistor switch", path: "/projects/npn-transistor-switch", linkLabel: "Open circuit" }
    ]
  },
  "/projects": {
    eyebrow: "PROJECT LIBRARY",
    title: "Projects",
    description: "Build notes, circuit diagrams, parts, and test steps for projects used in the shop."
  },
  "/resources": {
    eyebrow: "REFERENCE / CLASS MATERIAL",
    title: "Resources",
    description: "Useful class references, equipment information, and shared documents.",
    sections: [{ heading: "Class references", text: "General shop information, safety material, and tool references in one place." }]
  },
  "/resources/safety": {
    eyebrow: "RESOURCES / SAFETY",
    title: "Shop safety",
    description: "Safety material and class procedures for work in the shop.",
    sections: [{ heading: "Follow the shop rules", text: "Use the official safety handouts, posted procedures, and your instructor's guidance whenever you work with tools, machines, or electrical equipment." }]
  },
  "/resources/tools": {
    eyebrow: "RESOURCES / TOOLS & EQUIPMENT",
    title: "Tools & equipment",
    description: "Notes and references for the tools and equipment used in class.",
    sections: [{ heading: "Equipment reference", text: "Tool names, setup notes, and manufacturer instructions can be collected here so they are easy to find when needed." }]
  },
  "/about": {
    eyebrow: "ABOUT",
    title: "Shop Class",
    description: "A shared reference for the projects, circuit diagrams, and skills covered in the shop.",
    sections: [{ heading: "How it is organized", text: "Class schematics are grouped by year, common circuits have their own shared shelf, and each project follows the same layout so its parts, drawing, and build notes are easy to find." }]
  }
};
