/*
  PAGE CONTENT
  Each key must match a path in data/navigation.js.
  Edit these text fields to update pages. Add a page here whenever you add a route.
  Optional section fields: heading, text, image, imageAlt, bullets.
  Optional cards fields: title, description, image, imageAlt, tag, path, linkLabel.
*/
window.SHOP_PAGES = {
  "/schematics": {
    eyebrow: "DRAWINGS / PLANS / REFERENCES",
    title: "Schematics",
    description: "A central library for technical drawings, project plans, and shared reference material.",
    sections: [{ heading: "Find the right section", text: "Choose a grade to find project plans, or open Common for references that apply across classes. Add PDFs, diagrams, photos, and notes as the library takes shape." }],
    callout: { title: "Make every file easy to find", text: "Use clear names and add a short note about what each drawing is for. Keep shared references in Common rather than duplicating them." }
  },
  "/schematics/freshman": {
    eyebrow: "SCHEMATICS / FRESHMAN",
    title: "Freshman schematics",
    description: "First-year drawings, starter builds, and project-specific reference material.",
    sections: [{ heading: "Your freshman library", text: "Add freshman project plans, measurements, diagrams, material lists, and notes that help explain each drawing." }]
  },
  "/schematics/freshman/projects": {
    eyebrow: "SCHEMATICS / FRESHMAN / PROJECTS",
    title: "Freshman projects",
    description: "Project plans and supporting material for freshman shop projects.",
    sections: [{ heading: "Project entry template", text: "For each project, add the drawing or PDF, a photo of the finished example, required materials, key dimensions, and build notes." }],
    callout: { title: "Ready for your first project", text: "Replace this starter text with the actual project details when you are ready." }
  },
  "/schematics/sophomore": {
    eyebrow: "SCHEMATICS / SOPHOMORE",
    title: "Sophomore schematics",
    description: "A dedicated place for second-year project plans and technical references.",
    sections: [{ heading: "Build out this library", text: "Add drawings, downloadable plans, material lists, photos, and notes for sophomore projects here." }]
  },
  "/schematics/sophomore/projects": {
    eyebrow: "SCHEMATICS / SOPHOMORE / PROJECTS",
    title: "Sophomore projects",
    description: "Project plans and supporting material for sophomore shop projects.",
    sections: [{ heading: "Project entry template", text: "Add each project with its plan, materials, measurements, build notes, and reference photos." }]
  },
  "/schematics/junior": {
    eyebrow: "SCHEMATICS / JUNIOR",
    title: "Junior schematics",
    description: "Third-year drawings, advanced builds, and technical reference material.",
    sections: [{ heading: "Build out this library", text: "Add drawings, material lists, photos, and notes for junior projects here." }]
  },
  "/schematics/junior/projects": {
    eyebrow: "SCHEMATICS / JUNIOR / PROJECTS",
    title: "Junior projects",
    description: "Project plans and supporting material for junior shop projects.",
    sections: [{ heading: "Project entry template", text: "Add each project with its plan, materials, measurements, build notes, and reference photos." }]
  },
  "/schematics/senior": {
    eyebrow: "SCHEMATICS / SENIOR",
    title: "Senior schematics",
    description: "Fourth-year plans, capstone builds, and advanced technical references.",
    sections: [{ heading: "Build out this library", text: "Add drawings, project plans, material lists, photos, and notes for senior projects here." }]
  },
  "/schematics/senior/projects": {
    eyebrow: "SCHEMATICS / SENIOR / PROJECTS",
    title: "Senior projects",
    description: "Project plans and supporting material for senior shop projects.",
    sections: [{ heading: "Project entry template", text: "Add each project with its plan, materials, measurements, build notes, and reference photos." }]
  },
  "/schematics/common": {
    eyebrow: "SCHEMATICS / SHARED LIBRARY",
    title: "Common references",
    description: "Useful plans, symbols, charts, and technical notes shared across grades.",
    sections: [{ heading: "Shared reference shelf", text: "Use this page for common symbols, measurement references, general diagrams, and files used by more than one class." }],
    callout: { title: "One source of truth", text: "If a reference applies to everyone, keep it here instead of uploading separate copies to each grade." }
  },
  "/projects": {
    eyebrow: "IDEAS / BUILDS / DOCUMENTATION",
    title: "Project gallery",
    description: "A visual index for project ideas, finished builds, and documentation that can grow over time.",
    cards: [
      { title: "Project spotlight", description: "Replace this card with a real build, a short description, and photos.", image: "assets/images/project.svg", imageAlt: "Illustrated project", tag: "FEATURED BUILD" },
      { title: "In progress", description: "Document stages of a build with progress photos, materials, and lessons learned.", image: "assets/images/schematic.svg", imageAlt: "Illustrated plan", tag: "BUILD LOG" },
      { title: "Ideas and inspiration", description: "Collect future project concepts and the references that support them.", image: "assets/images/resources.svg", imageAlt: "Illustrated reference tools", tag: "IDEAS" }
    ]
  },
  "/resources": {
    eyebrow: "REFERENCE / HOW-TO / CLASS SUPPORT",
    title: "Shop resources",
    description: "Practical information that helps people prepare, work safely, and find the right tool or process.",
    sections: [{ heading: "A home for class references", text: "Use the subtabs for teacher-approved safety information, tool guides, procedures, and other shared resources." }]
  },
  "/resources/safety": {
    eyebrow: "RESOURCES / SAFETY",
    title: "Shop safety",
    description: "A clear home for teacher-approved safety procedures, reminders, and class documents.",
    sections: [{ heading: "Add official class material", text: "Put the shop safety rules, PPE reminders, and teacher-provided procedures here. Always follow your instructor's directions and posted shop rules." }],
    callout: { title: "Safety content should be authoritative", text: "Use your teacher's official materials as the source of truth. This starter page is not a replacement for training or supervision." }
  },
  "/resources/tools": {
    eyebrow: "RESOURCES / TOOLS & EQUIPMENT",
    title: "Tools & equipment",
    description: "Tool references, identification guides, and approved usage notes in one organized place.",
    sections: [{ heading: "Make the tool library useful", text: "Add tool names, photos, what each tool is used for, and links to approved operating instructions." }]
  },
  "/about": {
    eyebrow: "ABOUT THIS SITE",
    title: "A better home for shop class",
    description: "This website is designed to keep class references organized, visual, and easy to update.",
    sections: [{ heading: "Built to grow", text: "Navigation, content, styling, and images are stored separately so the site can expand without rebuilding its layout." }]
  }
};
