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
