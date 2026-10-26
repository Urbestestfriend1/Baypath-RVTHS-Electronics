/*
  PAGE CONTENT
  Navigation labels and hierarchy live in data/navigation.js.
  The /projects route is rendered from data/projects.js using the reusable project template.
  Add or edit text in this file; keep raw HTML out of content fields.
*/
window.SHOP_PAGES = {
  "/schematics": {
    eyebrow: "DRAWINGS / PLANS / REFERENCES",
    title: "Schematics",
    description: "Technical drawings, wiring diagrams, and project plans, organized so the right reference is easy to find.",
    sections: [{ heading: "Browse by grade", text: "Choose a grade for its project plans, or open Common for references shared across classes. Add approved PDFs, diagrams, and notes as you build out this library." }],
    callout: { title: "Keep drawings easy to use", text: "Give each file a clear name and a short note about what it covers. Put shared references in Common instead of keeping duplicate copies." }
  },
  "/schematics/freshman": {
    eyebrow: "SCHEMATICS / FRESHMAN",
    title: "Freshman schematics",
    description: "First-year drawings, project plans, and technical references.",
    sections: [{ heading: "Freshman library", text: "Add freshman project plans, measurements, wiring diagrams, material lists, and notes that explain each drawing." }]
  },
  "/schematics/freshman/projects": {
    eyebrow: "SCHEMATICS / FRESHMAN / PROJECTS",
    title: "Freshman project schematics",
    description: "Plans and supporting information for freshman projects.",
    sections: [{ heading: "What belongs here?", text: "Add a schematic or drawing, a link to its project detail page, parts or materials, and any dimensions needed before building." }]
  },
  "/schematics/sophomore": {
    eyebrow: "SCHEMATICS / SOPHOMORE",
    title: "Sophomore schematics",
    description: "Second-year plans, project drawings, and technical reference material.",
    sections: [{ heading: "Sophomore library", text: "Add drawings, downloadable plans, material lists, photos, and reference notes for sophomore work." }]
  },
  "/schematics/sophomore/projects": {
    eyebrow: "SCHEMATICS / SOPHOMORE / PROJECTS",
    title: "Sophomore project schematics",
    description: "Plans and supporting information for sophomore projects.",
    sections: [{ heading: "What belongs here?", text: "Add each project's main plan, supporting diagrams, materials, dimensions, and a link to its project page." }]
  },
  "/schematics/junior": {
    eyebrow: "SCHEMATICS / JUNIOR",
    title: "Junior schematics",
    description: "Third-year drawings, advanced builds, and technical references.",
    sections: [{ heading: "Junior library", text: "Add approved drawings, advanced project plans, material lists, and notes for junior projects." }]
  },
  "/schematics/junior/projects": {
    eyebrow: "SCHEMATICS / JUNIOR / PROJECTS",
    title: "Junior project schematics",
    description: "Plans and supporting information for junior projects.",
    sections: [{ heading: "What belongs here?", text: "Add each project's main plan, supporting diagrams, materials, dimensions, and a link to its project page." }]
  },
  "/schematics/senior": {
    eyebrow: "SCHEMATICS / SENIOR",
    title: "Senior schematics",
    description: "Fourth-year plans, capstone work, and advanced technical references.",
    sections: [{ heading: "Senior library", text: "Add drawings, capstone plans, material lists, photos, and useful reference notes." }]
  },
  "/schematics/senior/projects": {
    eyebrow: "SCHEMATICS / SENIOR / PROJECTS",
    title: "Senior project schematics",
    description: "Plans and supporting information for senior projects.",
    sections: [{ heading: "What belongs here?", text: "Add each project's main plan, supporting diagrams, materials, dimensions, and a link to its project page." }]
  },
  "/schematics/common": {
    eyebrow: "SCHEMATICS / SHARED LIBRARY",
    title: "Common schematics",
    description: "Reference drawings, symbols, charts, and technical notes that apply across grades.",
    sections: [{ heading: "Shared reference shelf", text: "Use this for common symbols, measurement references, wiring conventions, and diagrams used in multiple projects." }],
    callout: { title: "One source of truth", text: "If a reference applies to everyone, keep it here and link to it from other pages rather than uploading copies." }
  },
  "/projects": {
    eyebrow: "PROJECT LIBRARY",
    title: "Projects",
    description: "Every project has the same organized page structure: overview, featured image, schematic, materials, tools, build steps, gallery, and downloadable files."
  },
  "/resources": {
    eyebrow: "REFERENCE / PROCEDURES / SUPPORT",
    title: "Resources",
    description: "Useful links, approved guides, and class references collected in one place.",
    sections: [{ heading: "Resource library", text: "Use the subtabs for instructor-approved safety information, tool guides, procedures, and other shared material." }]
  },
  "/resources/safety": {
    eyebrow: "RESOURCES / SAFETY",
    title: "Shop safety",
    description: "A clear location for teacher-approved safety procedures, reminders, and class documents.",
    sections: [{ heading: "Use official class guidance", text: "Add your teacher's safety rules, PPE requirements, and official procedures. Always follow your instructor's directions and posted shop rules." }],
    callout: { title: "Safety first", text: "This page is a place to organize official material, not a replacement for training, supervision, or machine-specific instructions." }
  },
  "/resources/tools": {
    eyebrow: "RESOURCES / TOOLS & EQUIPMENT",
    title: "Tools & equipment",
    description: "Tool references, identification guides, and approved use notes in one location.",
    sections: [{ heading: "Build the tool index", text: "Add tool names, photos, intended uses, PPE reminders, and links to approved operating instructions." }]
  },
  "/about": {
    eyebrow: "ABOUT THIS SITE",
    title: "About Shop Class Hub",
    description: "A practical, editable reference site for schematics, projects, and class resources.",
    sections: [{ heading: "Designed to be maintained", text: "The navigation, page content, project data, styling, scripts, and images are all kept in separate files. You can update sections without rebuilding the entire site." }]
  }
};
