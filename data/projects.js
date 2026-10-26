/*
  PROJECT CATALOG + PROJECT PAGE TEMPLATE
  Copy the object below to add a project. Give every project a unique, URL-friendly slug.
  Replace image paths with files you add under assets/images/ (or assets/files/ for PDFs).
  This entry is intentionally a DEMO TEMPLATE; edit it or delete it when your first real project is ready.

  Supported fields:
  slug, title, grade, category, status, featured, template, summary, description,
  featuredImage, featuredImageAlt, schematicImage, schematicAlt,
  objectives[], materials[{name, quantity, notes}], tools[],
  steps[{title, description, image, imageAlt}], gallery[{image, alt, caption}],
  files[{label, href, description}], notes
*/
window.SHOP_PROJECTS = [
  {
    slug: "project-template",
    title: "Project Template — Edit Me",
    grade: "Select grade",
    category: "Select category",
    status: "Template",
    featured: true,
    template: true,
    summary: "A reusable starting point for each project page. Replace the text and images with your actual project details.",
    description: "Describe what the project does, who it is for, and what the finished build should accomplish. Keep this as a short overview that students can understand before they start.",
    featuredImage: "assets/images/project.svg",
    featuredImageAlt: "Placeholder image — replace with a photo of the finished project",
    schematicImage: "assets/images/schematic.svg",
    schematicAlt: "Placeholder schematic — replace with the project's actual drawing",
    objectives: [
      "Add the main skill or concept students should learn.",
      "Describe the intended result or how the project should work.",
      "Add any important design constraints or requirements."
    ],
    materials: [
      { name: "Example material", quantity: "Add quantity", notes: "Replace with the required size, part number, or specification." }
    ],
    tools: ["Add the required tool", "Add another tool or machine"],
    steps: [
      { title: "Planning", description: "Add the first step, planning notes, measurements, or preparation instructions.", image: "", imageAlt: "" },
      { title: "Build", description: "Describe the main construction or assembly step.", image: "", imageAlt: "" },
      { title: "Test and finish", description: "Explain how to check the finished project and record any final notes.", image: "", imageAlt: "" }
    ],
    gallery: [
      { image: "assets/images/project.svg", alt: "Placeholder project image — replace with your own photo", caption: "Finished build or overall project view" },
      { image: "assets/images/schematic.svg", alt: "Placeholder plan image — replace with another project photo", caption: "Plan, detail, or work-in-progress photo" }
    ],
    files: [
      { label: "Project schematic (replace me)", href: "assets/images/schematic.svg", description: "Replace the link with the actual PDF, drawing, or downloadable file." }
    ],
    notes: "Add instructor notes, special requirements, test results, or links to related class resources here."
  }
];
