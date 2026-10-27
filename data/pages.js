/*
  PAGE COPY
  Navigation is managed in data/navigation.js. Project details come from data/projects.js.
*/
window.SHOP_PAGES = {
  "/schematics": {
    eyebrow: "Shared Circuit Reference",
    title: "Schematics",
    description: "Reusable circuit references for common electronics tasks. Use these pages to understand circuit purpose, review the schematic, and check relevant electrical details. Grade-specific builds and complete project write-ups live under Projects.",
    sections: [{ heading: "A shared circuit library", text: "These circuits are useful reference points across multiple classes and projects. Schematic pages focus on what the circuit does and how it is represented; build steps, parts lists, and full verification workflows are kept with the corresponding project guide." }],
    cards: [
      { title: "555 Timer LED Flasher", tag: "TIMING", description: "An astable 555 timer produces a repeating output.", image: "assets/images/schematic-555-timer.png", imageAlt: "555 timer schematic", path: "/schematics/555-timer-led-flasher", linkLabel: "View schematic" },
      { title: "LED Current Limiter", tag: "CIRCUIT FUNDAMENTALS", description: "A series resistor limits LED current from a DC supply.", image: "assets/images/schematic-led-current.png", imageAlt: "LED current-limiting schematic", path: "/schematics/led-current-limiter", linkLabel: "View schematic" },
      { title: "NPN Transistor Switch", tag: "TRANSISTORS", description: "A transistor switches a small load using a control signal.", image: "assets/images/schematic-transistor-switch.png", imageAlt: "NPN transistor switch schematic", path: "/schematics/npn-transistor-switch", linkLabel: "View schematic" }
    ]
  },
  "/schematics/common": {
    eyebrow: "Schematics / Shared Reference",
    title: "Common circuits",
    description: "A shelf of commonly used circuit references for timing, current limiting, and transistor switching. These pages explain the circuit's purpose and schematic, while assembly procedures stay in the separate project guides.",
    sections: [{ heading: "Circuit references", text: "Select a circuit to review its schematic and key design notes. For numbered assembly instructions, materials, testing, and troubleshooting, use the linked project guide from each schematic page." }],
    cards: [
      { title: "555 Timer LED Flasher", tag: "TIMING", description: "Astable timing circuit with a repeating LED output.", image: "assets/images/schematic-555-timer.png", imageAlt: "555 timer schematic", path: "/schematics/555-timer-led-flasher", linkLabel: "View schematic" },
      { title: "LED Current Limiter", tag: "CIRCUIT FUNDAMENTALS", description: "Series resistance controls current through an LED.", image: "assets/images/schematic-led-current.png", imageAlt: "LED current-limiting schematic", path: "/schematics/led-current-limiter", linkLabel: "View schematic" },
      { title: "NPN Transistor Switch", tag: "TRANSISTORS", description: "An NPN transistor controls current to a load.", image: "assets/images/schematic-transistor-switch.png", imageAlt: "NPN transistor switch schematic", path: "/schematics/npn-transistor-switch", linkLabel: "View schematic" }
    ]
  },
  "/schematics/555-timer-led-flasher": {
    eyebrow: "Schematics / Timing Circuits",
    title: "555 Timer LED Flasher",
    description: "A shared timing-circuit reference showing the NE555 in astable mode. The capacitor charges and discharges through the timing resistors, causing the output to switch repeatedly.",
    sections: [
      { heading: "Schematic", text: "The timing network sets the approximate blink rate. Confirm pin numbering, component polarity, and the ratings of the exact parts used before wiring.", image: "assets/images/schematic-555-timer.png", imageAlt: "NE555 astable LED flasher schematic" },
      { heading: "Design notes", text: "The timing resistors and capacitor establish the oscillation period. Supply and reset connections must match the diagram, and electrolytic capacitor polarity matters." }
    ],
    cards: [{ title: "Full project guide", tag: "BUILD GUIDE", description: "The separate project record includes materials, build steps, verification, and troubleshooting.", image: "assets/images/cover-555-timer.png", imageAlt: "555 timer LED flasher project illustration", path: "/projects/555-timer-led-flasher", linkLabel: "Open project guide" }]
  },
  "/schematics/led-current-limiter": {
    eyebrow: "Schematics / Circuit Fundamentals",
    title: "LED Current Limiter",
    description: "A basic series circuit using a resistor to keep LED current within a suitable range for a low-voltage DC supply.",
    sections: [
      { heading: "Schematic", text: "The resistor and LED are in series. Choose resistance using the supply voltage, the LED's forward voltage, and the desired current, then verify the ratings of the actual parts.", image: "assets/images/schematic-led-current.png", imageAlt: "LED current-limiting resistor circuit schematic" },
      { heading: "Design notes", text: "An LED is polarity-sensitive. A resistor reduces current but does not make an arbitrary supply or resistor value safe; calculate the expected current before connecting power." }
    ],
    cards: [{ title: "Full project guide", tag: "BUILD GUIDE", description: "Review the worked example, material list, assembly process, and checks in the separate guide.", image: "assets/images/cover-led-current.png", imageAlt: "LED and current-limiting resistor project illustration", path: "/projects/led-current-limiter", linkLabel: "Open project guide" }]
  },
  "/schematics/npn-transistor-switch": {
    eyebrow: "Schematics / Transistors",
    title: "NPN Transistor Switch",
    description: "A common low-side switching arrangement in which a small control signal lets an NPN transistor switch current through a separate load.",
    sections: [
      { heading: "Schematic", text: "The drawing shows the control input, base resistor, transistor terminals, load, and shared reference. Pin order differs among transistor packages, so use the datasheet for the specific part.", image: "assets/images/schematic-transistor-switch.png", imageAlt: "NPN transistor low-side switch schematic" },
      { heading: "Design notes", text: "Check the transistor's pinout, base-drive requirements, load current, and polarity before applying power. Inductive loads may need additional protection circuitry." }
    ],
    cards: [{ title: "Full project guide", tag: "BUILD GUIDE", description: "The complete example includes its material list, assembly details, verification, and troubleshooting.", image: "assets/images/cover-transistor-switch.png", imageAlt: "NPN transistor switch project illustration", path: "/projects/npn-transistor-switch", linkLabel: "Open project guide" }]
  },
  "/schematics/freshman": {
    eyebrow: "Legacy link / Moved",
    title: "Freshman projects have moved",
    description: "Grade-specific work is now organized under Projects. This old address remains available for bookmarked links.",
    sections: [{ heading: "Continue to Projects", text: "Open the Freshman project area to browse or add grade-specific project documentation." }],
    cards: [{ title: "Freshman projects", tag: "PROJECTS / FRESHMAN", description: "Open the new grade-level project area.", image: "assets/images/cover-555-timer.png", imageAlt: "Electronics project illustration", path: "/projects/freshman", linkLabel: "Open Freshman projects" }]
  },
  "/schematics/freshman/projects": {
    eyebrow: "Legacy link / Moved",
    title: "Freshman project schematics have moved",
    description: "Grade-specific project write-ups now live under Projects.",
    sections: [],
    cards: [{ title: "Freshman project list", tag: "PROJECTS / FRESHMAN", description: "Open the new Freshman project collection.", image: "assets/images/project.png", imageAlt: "Electronics project placeholder", path: "/projects/freshman/projects", linkLabel: "Open project list" }]
  },
  "/schematics/sophomore": {
    eyebrow: "Legacy link / Moved",
    title: "Sophomore projects have moved",
    description: "Grade-specific work is now organized under Projects. This old address remains available for bookmarked links.",
    sections: [{ heading: "Continue to Projects", text: "Open the Sophomore project area to browse or add grade-specific project documentation." }],
    cards: [{ title: "Sophomore projects", tag: "PROJECTS / SOPHOMORE", description: "Open the new grade-level project area.", image: "assets/images/cover-led-current.png", imageAlt: "Electronics project illustration", path: "/projects/sophomore", linkLabel: "Open Sophomore projects" }]
  },
  "/schematics/sophomore/projects": {
    eyebrow: "Legacy link / Moved",
    title: "Sophomore project schematics have moved",
    description: "Grade-specific project write-ups now live under Projects.",
    sections: [],
    cards: [{ title: "Sophomore project list", tag: "PROJECTS / SOPHOMORE", description: "Open the new Sophomore project collection.", image: "assets/images/project.png", imageAlt: "Electronics project placeholder", path: "/projects/sophomore/projects", linkLabel: "Open project list" }]
  },
  "/schematics/junior": {
    eyebrow: "Legacy link / Moved",
    title: "Junior projects have moved",
    description: "Grade-specific work is now organized under Projects. This old address remains available for bookmarked links.",
    sections: [{ heading: "Continue to Projects", text: "Open the Junior project area to browse or add grade-specific project documentation." }],
    cards: [{ title: "Junior projects", tag: "PROJECTS / JUNIOR", description: "Open the new grade-level project area.", image: "assets/images/cover-transistor-switch.png", imageAlt: "Electronics project illustration", path: "/projects/junior", linkLabel: "Open Junior projects" }]
  },
  "/schematics/junior/projects": {
    eyebrow: "Legacy link / Moved",
    title: "Junior project schematics have moved",
    description: "Grade-specific project write-ups now live under Projects.",
    sections: [],
    cards: [{ title: "Junior project list", tag: "PROJECTS / JUNIOR", description: "Open the new Junior project collection.", image: "assets/images/project.png", imageAlt: "Electronics project placeholder", path: "/projects/junior/projects", linkLabel: "Open project list" }]
  },
  "/schematics/senior": {
    eyebrow: "Legacy link / Moved",
    title: "Senior projects have moved",
    description: "Grade-specific work is now organized under Projects. This old address remains available for bookmarked links.",
    sections: [{ heading: "Continue to Projects", text: "Open the Senior project area to browse or add grade-specific project documentation." }],
    cards: [{ title: "Senior projects", tag: "PROJECTS / SENIOR", description: "Open the new grade-level project area.", image: "assets/images/workshop-banner.png", imageAlt: "Workshop project illustration", path: "/projects/senior", linkLabel: "Open Senior projects" }]
  },
  "/schematics/senior/projects": {
    eyebrow: "Legacy link / Moved",
    title: "Senior project schematics have moved",
    description: "Grade-specific project write-ups now live under Projects.",
    sections: [],
    cards: [{ title: "Senior project list", tag: "PROJECTS / SENIOR", description: "Open the new Senior project collection.", image: "assets/images/project.png", imageAlt: "Electronics project placeholder", path: "/projects/senior/projects", linkLabel: "Open project list" }]
  },
  "/projects": {
    eyebrow: "Class Projects",
    title: "Projects by grade",
    description: "Browse the work completed across the four years of the electronics program. Each year has its own project collection so finished builds, design records, documentation, and lessons learned stay organized by class level.",
    sections: [{ heading: "Choose your class year", text: "Select a grade below to find projects associated with that year. These collections are for real class projects and student builds; commonly used circuit references are in Schematics." }]
  },
  "/projects/freshman": {
    eyebrow: "Projects / Freshman",
    title: "Freshman projects",
    description: "Introductory projects and first-year builds. Records can capture the project purpose, design decisions, drawings, materials, testing results, and reflections appropriate to the assignment.",
    sections: [{ heading: "First-year project collection", text: "Open the Projects list to view documented Freshman builds. Shared circuit fundamentals remain in Schematics and are not automatically assigned to a grade." }]
  },
  "/projects/freshman/projects": {
    eyebrow: "Projects / Freshman / Project list",
    title: "Freshman project list",
    description: "Documented class projects assigned to the Freshman collection.",
    sections: []
  },
  "/projects/sophomore": {
    eyebrow: "Projects / Sophomore",
    title: "Sophomore projects",
    description: "Second-year project work, including builds that develop circuit design, measurement, component selection, and technical documentation skills.",
    sections: [{ heading: "Second-year project collection", text: "Open the Projects list to browse documented Sophomore builds. Add a project to this collection by setting its grade level to Sophomore in the project data." }]
  },
  "/projects/sophomore/projects": {
    eyebrow: "Projects / Sophomore / Project list",
    title: "Sophomore project list",
    description: "Documented class projects assigned to the Sophomore collection.",
    sections: []
  },
  "/projects/junior": {
    eyebrow: "Projects / Junior",
    title: "Junior projects",
    description: "Third-year project work with room for more involved systems, measurements, design iterations, and supporting technical records.",
    sections: [{ heading: "Third-year project collection", text: "Open the Projects list to browse documented Junior builds. Add a project to this collection by setting its grade level to Junior in the project data." }]
  },
  "/projects/junior/projects": {
    eyebrow: "Projects / Junior / Project list",
    title: "Junior project list",
    description: "Documented class projects assigned to the Junior collection.",
    sections: []
  },
  "/projects/senior": {
    eyebrow: "Projects / Senior",
    title: "Senior projects",
    description: "Senior-level builds, larger systems, capstone work, and polished documentation of completed designs.",
    sections: [{ heading: "Fourth-year project collection", text: "Open the Projects list to browse documented Senior builds. Add a project to this collection by setting its grade level to Senior in the project data." }]
  },
  "/projects/senior/projects": {
    eyebrow: "Projects / Senior / Project list",
    title: "Senior project list",
    description: "Documented class projects assigned to the Senior collection.",
    sections: []
  },
  "/inventory": {
    eyebrow: "Shop Inventory / Master Catalog",
    title: "Inventory",
    description: "A searchable master catalog for electronic components, wiring, connectors, hand tools, test equipment, consumables, and reusable shop assets. Each record can hold a part number, manufacturer, category, description, notes, quantity and unit, minimum stock level, condition, supplier, and a structured storage path. Search, filters, sorting, and pagination are designed to keep a very large list usable as it grows. The current starter rows are examples, not a verified count of Baypath stock.",
    sections: []
  },
  "/spotlights": {
    eyebrow: "Creator Showcase",
    title: "Spotlights",
    description: "Student-built creations and useful technical contributions, presented with creator credit, context, results, photos, and video when available. These showcases celebrate the finished work; build instructions live separately in the project guides.",
    sections: []
  },
  "/resources": {
    eyebrow: "Reference / Class Material",
    title: "Tools, safety & shop references",
    description: "A practical reference area for day-to-day shop work. Use the categories below to find tool guidance, measurement basics, safety reminders, and component-handling practices. Follow the shop's official procedures and instructor directions whenever they are more specific.",
    sections: [{ heading: "Use these pages as a bench-side reference", text: "Check the right tool and procedure before starting. These notes are a general learning aid; the instructor's directions, equipment manuals, posted rules, and school-approved safety procedures always take priority." }],
    cards: [
      { title: "Shop safety", tag: "START HERE", description: "Pre-work checks, electrical precautions, soldering and hot-tool safety, ESD, housekeeping, and stop-work guidance.", image: "assets/images/resources.png", imageAlt: "Shop tools and safety reference illustration", path: "/resources/safety", linkLabel: "Review safety guidance" },
      { title: "Tools & equipment", tag: "BENCH REFERENCE", description: "Digital multimeters, bench supplies, breadboards, soldering tools, hand tools, and equipment care.", image: "assets/images/schematic.png", imageAlt: "Technical circuit planning illustration", path: "/resources/tools", linkLabel: "Browse tools and equipment" },
      { title: "Multimeter basics", tag: "MEASUREMENT", description: "Choose the correct function and input, check leads, measure voltage safely, and use resistance or continuity only on de-energized circuits.", image: "assets/images/schematic-led-current.png", imageAlt: "LED current-limiting circuit schematic", path: "/resources/tools", linkLabel: "Open meter guidance" },
      { title: "Soldering & hot tools", tag: "HOT WORK", description: "Set up the work area, use the iron stand and fume extraction, and leave equipment safe when finished.", image: "assets/images/workshop-banner.png", imageAlt: "Workshop bench illustration", path: "/resources/safety", linkLabel: "Review safe work practices" },
      { title: "ESD & component handling", tag: "COMPONENT CARE", description: "Reduce electrostatic discharge risk and protect ICs and other sensitive parts during storage and assembly.", image: "assets/images/cover-transistor-switch.png", imageAlt: "Transistor switch project illustration", path: "/resources/safety", linkLabel: "Review handling guidance" },
      { title: "Power, polarity & wiring", tag: "BEFORE POWER-ON", description: "Check supply settings, polarity, rail connections, and possible shorts before applying power to a circuit.", image: "assets/images/cover-555-timer.png", imageAlt: "555 timer circuit project illustration", path: "/resources/tools", linkLabel: "Open equipment guidance" }
    ]
  },
  "/resources/safety": {
    eyebrow: "Resources / Safety",
    title: "Shop safety",
    description: "A categorized reminder list for electronics bench work. It does not replace Baypath's official safety handouts, posted rules, equipment manuals, or instructor direction.",
    sections: [
      { heading: "1. General shop and bench safety", text: "Before starting, understand the task and the shop-specific procedure. If a hazard or instruction is unclear, pause and ask the instructor rather than improvising.", bullets: [
        "Use the personal protective equipment and clothing required for the task; secure loose hair, jewelry, cords, and clothing near tools.",
        "Keep the bench uncluttered, dry, and well lit. Keep food and drinks away from components and electrical equipment.",
        "Inspect tools, cables, probes, and power supplies before use. Do not use damaged, frayed, cracked, or overheating equipment.",
        "Use equipment only after receiving the required instruction and permission. Keep walkways and emergency access clear."
      ]},
      { heading: "2. Electrical circuits and power supplies", text: "Most beginner circuit exercises should remain within the low-voltage DC limits assigned by the instructor. Mains voltage, high-energy batteries, and high-voltage circuits require separate approved procedures and direct supervision.", bullets: [
        "Switch off and disconnect the supply before rewiring, moving components, or correcting a short.",
        "Set the intended voltage and a sensible current limit before enabling a bench supply; check polarity and connections first.",
        "Never assume a circuit is unpowered. Verify it using an appropriate method and allow capacitors to discharge according to the instructor's procedure.",
        "Do not bypass interlocks, protective earth connections, fuses, or current limits. Stop if a supply, cable, or component becomes hot, smells unusual, smokes, or behaves unexpectedly."
      ]},
      { heading: "3. Digital multimeter safety", text: "The meter function, lead jacks, range, and ratings must match the measurement. Check the meter's markings and manual, and ask for a demonstration if uncertain.", bullets: [
        "Inspect the meter case and probe insulation. Use the black lead in COM and the red lead in the input specified for the selected measurement.",
        "For voltage, select AC or DC correctly and connect the meter in parallel across the intended points.",
        "For resistance, continuity, and diode tests, remove power first and follow the approved capacitor-discharge procedure.",
        "Current is measured in series: de-energize the circuit before opening it and inserting the meter, use the correctly fused current jack, and select a suitable range.",
        "Never place a meter in current mode directly across a power source; doing so can create a short circuit and may damage the meter or cause injury.",
        "After a current measurement, return the red lead to the voltage/resistance jack before the next voltage test."
      ]},
      { heading: "4. Soldering and hot tools", text: "Soldering irons and recently worked metal parts can cause burns. Use the ventilation and protective equipment required by the shop.", bullets: [
        "Use the proper iron stand and approved fume extraction; keep hands and face away from the plume.",
        "Treat the tip and nearby metal as hot. Never leave a powered iron unattended or place it on the bench, wires, or a project surface.",
        "Keep the work area free of flammable materials and manage cords so they cannot pull the iron off the bench.",
        "Turn off and unplug equipment as instructed, allow it to cool in its stand, and wash hands after soldering or handling solder and flux."
      ]},
      { heading: "5. ESD and sensitive components", text: "Electrostatic discharge can damage parts even when no visible spark occurs.", bullets: [
        "Use the grounded mat, wrist strap, or other ESD controls specified by the instructor.",
        "Handle ICs and sensitive modules by their edges; avoid touching pins and exposed contacts.",
        "Store sensitive parts in their designated ESD-safe packaging and keep them away from static-generating materials when practical.",
        "Disconnect power before inserting or removing ICs, sensors, or modules unless the equipment is explicitly designed for hot-swapping."
      ]},
      { heading: "6. Hand tools, cutting, and housekeeping", text: "Choose tools suited to the task and keep the workpiece stable.", bullets: [
        "Cut away from your body and keep fingers out of the tool's cutting path; wear eye protection where required.",
        "Use the correct driver, stripper, pliers, or cutter rather than forcing a mismatched tool.",
        "Collect wire offcuts and component leads promptly; small scraps can puncture skin or cause electrical shorts.",
        "Store tools safely and report damaged equipment instead of returning it to service."
      ]},
      { heading: "7. If something goes wrong", text: "Stop work at once if you see smoke, arcing, a damaged lead, a hot component, or any unexpected behavior.", bullets: [
        "If safe to do so, turn off and isolate the power source without touching exposed conductors or a person in contact with electricity.",
        "Notify the instructor immediately and follow the shop's emergency and incident-reporting procedures.",
        "Do not touch a person who may still be in contact with an energized source; alert the instructor and emergency responders and follow formal training.",
        "Do not restart the setup until the cause has been reviewed and the instructor authorizes it."
      ]}
    ]
  },
  "/resources/tools": {
    eyebrow: "Resources / Tools & Equipment",
    title: "Tools & equipment",
    description: "Quick-reference notes for the main tool groups used at an electronics bench. Follow the equipment manual and instructor's operating procedure for the specific model in front of you.",
    sections: [
      { heading: "Digital multimeters (DMMs)", text: "Use a DMM to measure voltage, resistance, continuity, and—when the meter supports it and the procedure calls for it—current or diode drop. The front-panel jack labels and meter ratings matter as much as the dial setting.", bullets: [
        "Before use: check the case, fuse status where appropriate, leads, probe insulation, and the meter's voltage/category ratings.",
        "Voltage: choose AC or DC and an appropriate range; place probes in parallel across the points being checked.",
        "Resistance / continuity / diode: disconnect power first and ensure stored energy is discharged according to the approved procedure.",
        "Current: insert the meter in series, use the specified fused current input, start with the appropriate high range, and follow the meter manual.",
        "Never measure current by placing the meter across a supply. Return the red lead to the voltage/ohms jack afterward.",
        "When reading an unexpected result, stop and verify the function, range, lead jacks, polarity, and circuit reference before changing connections."
      ]},
      { heading: "Bench DC power supplies", text: "A bench supply can provide a controlled low-voltage source for approved projects. It can still damage components if the voltage, polarity, or current limit is wrong.", bullets: [
        "Keep output disabled while wiring and changing circuit connections.",
        "Set the required voltage and a conservative current limit before enabling output.",
        "Check positive and negative connections, breadboard rails, and possible shorts before switching on.",
        "If the supply enters current limit or the circuit behaves unexpectedly, switch off and inspect the setup rather than repeatedly trying again."
      ]},
      { heading: "Breadboards and jumper wires", text: "Breadboards are for temporary low-voltage prototype circuits. Internal row and power-rail connections vary by board, so check its layout before wiring.", bullets: [
        "Identify the connected rows, center channel, and any split power rails from the board's markings or documentation.",
        "Keep power disconnected while inserting, removing, or rearranging parts and jumpers.",
        "Check that IC pins straddle the center channel and that polarized parts face the intended direction.",
        "Look for stray wire strands, off-by-one connections, and positive-to-ground shorts before powering the circuit."
      ]},
      { heading: "Soldering tools and fume extraction", text: "Use the station, iron tip, temperature guidance, and extraction equipment assigned for the job.", bullets: [
        "Place the iron in its stand whenever it is not in your hand; keep cords and hot tips away from people and project wiring.",
        "Use approved local fume extraction and the protective equipment required by the shop.",
        "Keep the tip clean using the approved method. Do not touch the tip or assume it has cooled immediately after switching off.",
        "Turn off, unplug, and cool equipment according to the station's procedure before storage."
      ]},
      { heading: "Hand tools and wire preparation", text: "Pliers, flush cutters, wire strippers, screwdrivers, and crimpers each have a specific job.", bullets: [
        "Match wire stripper and crimper sizes to the conductor and terminal; inspect the finished connection for damage or loose strands.",
        "Use cutters with the cut-off directed away from faces and eyes, and collect clipped leads immediately.",
        "Use insulated tools where specified, but do not treat insulation as permission to work on energized circuits.",
        "Return tools to their assigned storage locations and report broken or loose parts."
      ]},
      { heading: "ESD controls and component storage", text: "ICs, MOSFETs, sensors, and microcontroller boards may be sensitive to static discharge.", bullets: [
        "Use the ESD mat, wrist strap, and packaging specified by the instructor.",
        "Handle components by the edges and avoid touching pins or connector contacts.",
        "Keep parts identified and stored in the appropriate labeled bins or ESD-safe bags.",
        "Check polarity, pinout, and datasheet before fitting an unfamiliar component."
      ]},
      { heading: "Care, calibration, and records", text: "Good equipment records help the next person use the tool correctly and spot issues early.", bullets: [
        "Record tool identifier, location, accessories, and the relevant manual or datasheet when known.",
        "Report a damaged lead, missing probe, failed fuse, uncertain calibration status, or abnormal behavior to the instructor.",
        "Do not open or repair measuring equipment or power supplies unless authorized.",
        "Keep measurement notes with units, range/function, test points, supply conditions, and relevant uncertainty."
      ]}
    ]
  },
  "/about": {
    eyebrow: "About",
    title: "Electronics",
    description: "A shared workshop library for the projects, circuit diagrams, inventory, and practical references used in the electronics shop. It is organized around common tasks: find the information, understand the plan, gather the correct parts, follow the work in order, and check the result. The content is stored in small editable data files so projects, inventory records, navigation, and page descriptions can be maintained without redesigning the site.",
    sections: [{ heading: "How it is organized", text: "Class schematics are grouped by year, common circuits have their own shared shelf, and each project follows the same layout so its parts, drawing, and build notes are easy to find." }]
  }
};
