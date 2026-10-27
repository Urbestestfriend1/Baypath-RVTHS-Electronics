/*
  PAGE COPY
  Navigation is managed in data/navigation.js. Project details come from data/projects.js.
*/
window.SHOP_PAGES = {
  "/schematics": {
    eyebrow: "Drawings / Circuits / Plans",
    title: "Schematics",
    description: "A structured library of circuit drawings and project plans, grouped by class year with a shared shelf for circuits that are useful across the program. Use these pages when you need to understand a connection before you wire it, compare a design, or keep a drawing alongside a build.",
    sections: [{ heading: "Browse schematics", text: "Start with your class-year section when you need a drawing tied to coursework, or use Common for reusable examples that apply to more than one project. Each diagram is a reference for planning and checking connections, not a substitute for checking component ratings and the instructor's instructions." }],
    cards: [
      { title: "Common schematics", tag: "SHARED REFERENCE", description: "Circuit fundamentals and repeat-use examples, including the 555 timer.", image: "assets/images/schematic-555-timer.png", imageAlt: "555 timer schematic", path: "/schematics/common", linkLabel: "View common circuits" }
    ]
  },
  "/schematics/freshman": {
    eyebrow: "Schematics / Freshman",
    title: "Freshman schematics",
    description: "Introductory circuit drawings and component references for first-year work. Use this section to build confidence reading symbols, tracing current paths, identifying polarity, and matching the drawing to a physical breadboard.",
    sections: [{ heading: "First-year reference", text: "Simple circuits, component symbols, resistor values, and introductory diagrams belong here." }]
  },
  "/schematics/freshman/projects": {
    eyebrow: "Schematics / Freshman / Projects",
    title: "Freshman project schematics",
    description: "Drawings for first-year projects, from basic circuits to hands-on build exercises.",
    sections: [{ heading: "Project drawings", text: "Plans and circuit diagrams used alongside freshman project work." }]
  },
  "/schematics/sophomore": {
    eyebrow: "Schematics / Sophomore",
    title: "Sophomore schematics",
    description: "Circuit plans and technical drawings for second-year work, with room for subsystem layouts, measurements, and the connection details that become important as projects grow more involved.",
    sections: [{ heading: "Second-year reference", text: "A place for more involved circuits, subsystem diagrams, and project-specific drawings." }]
  },
  "/schematics/sophomore/projects": {
    eyebrow: "Schematics / Sophomore / Projects",
    title: "Sophomore project schematics",
    description: "Project drawings and supporting circuit references for sophomore work.",
    sections: [{ heading: "Project drawings", text: "Plans, measurements, and supporting diagrams for second-year builds." }]
  },
  "/schematics/junior": {
    eyebrow: "Schematics / Junior",
    title: "Junior schematics",
    description: "A collection point for more advanced circuit diagrams and project plans. Keep drawings clear, label the important signals and power rails, and attach notes that help another student reproduce the setup accurately.",
    sections: [{ heading: "Third-year reference", text: "Advanced diagrams, design references, and project documentation." }]
  },
  "/schematics/junior/projects": {
    eyebrow: "Schematics / Junior / Projects",
    title: "Junior project schematics",
    description: "Circuit plans and supporting drawings for junior projects.",
    sections: [{ heading: "Project drawings", text: "Project schematics and technical notes for third-year builds." }]
  },
  "/schematics/senior": {
    eyebrow: "Schematics / Senior",
    title: "Senior schematics",
    description: "A home for senior-level technical drawings, capstone circuits, and supporting documentation. Use it to keep the latest revision, relevant measurements, and part references together with the final plan.",
    sections: [{ heading: "Fourth-year reference", text: "Capstone plans, detailed schematics, and documentation for larger projects." }]
  },
  "/schematics/senior/projects": {
    eyebrow: "Schematics / Senior / Projects",
    title: "Senior project schematics",
    description: "Plans and documentation for senior and capstone builds.",
    sections: [{ heading: "Project drawings", text: "Schematics and supporting engineering notes for senior projects." }]
  },
  "/schematics/common": {
    eyebrow: "Schematics / Shared Reference",
    title: "Common circuits",
    description: "A shared shelf of dependable circuit examples for common electronics tasks. Each reference is intended to explain the circuit's job, show the connections, identify the required parts, and give you a sensible way to test the result.",
    sections: [{ heading: "Circuit examples", text: "These worked examples cover three useful building blocks: a 555 timer that produces a repeating output, a resistor that limits LED current, and an NPN transistor that switches a small load. Each project page keeps its design reasoning, schematic, parts and tools, numbered build steps, verification checks, and common troubleshooting advice in one consistent workflow." }],
    cards: [
      { title: "555 Timer LED Flasher", tag: "TIMING CIRCUITS", description: "An astable 555 timer produces a repeating output and blinks an LED.", image: "assets/images/cover-555-timer.png", imageAlt: "555 timer LED flasher", path: "/projects/555-timer-led-flasher", linkLabel: "Open circuit" },
      { title: "LED and Current-Limiting Resistor", tag: "CIRCUIT FUNDAMENTALS", description: "Use Ohm's law to estimate current in a simple series circuit.", image: "assets/images/cover-led-current.png", imageAlt: "LED and current-limiting resistor circuit", path: "/projects/led-current-limiter", linkLabel: "Open circuit" },
      { title: "NPN Transistor as a Switch", tag: "TRANSISTORS", description: "A small control current switches an LED load through an NPN transistor.", image: "assets/images/cover-transistor-switch.png", imageAlt: "NPN transistor switch", path: "/projects/npn-transistor-switch", linkLabel: "Open circuit" }
    ]
  },
  "/projects": {
    eyebrow: "Project Library",
    title: "Projects",
    description: "A project library built around how work actually gets done: begin with the purpose, understand the design choices, review the drawing and parts, follow the physical build steps in order, then verify the result. Supporting references and troubleshooting notes stay with each project so the important details are not scattered across separate documents."
  },
  "/inventory": {
    eyebrow: "Shop Inventory / Master Catalog",
    title: "Inventory",
    description: "A searchable master catalog for electronic components, wiring, connectors, hand tools, test equipment, consumables, and reusable shop assets. Each record can hold a part number, manufacturer, category, description, notes, quantity and unit, minimum stock level, condition, supplier, and a structured storage path. Search, filters, sorting, and pagination are designed to keep a very large list usable as it grows. The current starter rows are examples, not a verified count of Baypath stock.",
    sections: []
  },
  "/resources": {
    eyebrow: "Reference / Class Material",
    title: "Resources",
    description: "A practical reference area for the information that is useful during day-to-day shop work: safety guidance, tool and equipment notes, and shared class material. Keep official procedures easy to find and use these pages to supplement the instructor's instructions rather than replace them.",
    sections: [{ heading: "Class references", text: "General shop information, safety material, and tool references in one place." }]
  },
  "/resources/safety": {
    eyebrow: "Resources / Safety",
    title: "Shop safety",
    description: "Safety material and class procedures for work in the shop.",
    sections: [{ heading: "Follow the shop rules", text: "Use the official safety handouts, posted procedures, and your instructor's guidance whenever you work with tools, machines, soldering equipment, power supplies, or electrical circuits. Read the relevant procedure before starting, inspect equipment before using it, and stop to ask for guidance if a setup or hazard is unclear. This page is a place to organize approved references—not to invent or replace shop rules." }]
  },
  "/resources/tools": {
    eyebrow: "Resources / Tools & Equipment",
    title: "Tools & equipment",
    description: "Notes and references for the tools and equipment used in class.",
    sections: [{ heading: "Equipment reference", text: "Keep tool names, equipment identifiers, setup notes, maintenance details, and manufacturer instructions together so the right information is available at the bench. A useful entry should explain what the tool is for, where to find it, the checks required before use, and the reference or manual that covers its operation." }]
  },
  "/about": {
    eyebrow: "About",
    title: "Electronics",
    description: "A shared workshop library for the projects, circuit diagrams, inventory, and practical references used in the electronics shop. It is organized around common tasks: find the information, understand the plan, gather the correct parts, follow the work in order, and check the result. The content is stored in small editable data files so projects, inventory records, navigation, and page descriptions can be maintained without redesigning the site.",
    sections: [{ heading: "How it is organized", text: "Class schematics are grouped by year, common circuits have their own shared shelf, and each project follows the same layout so its parts, drawing, and build notes are easy to find." }]
  }
};
