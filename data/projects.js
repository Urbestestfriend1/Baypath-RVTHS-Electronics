/*
  PROJECT LIBRARY
  Each object generates a project card and detail page. Copy an object to create another,
  then give it a unique, URL-friendly slug.
*/
window.SHOP_PROJECTS = [
  {
    slug: "555-timer-led-flasher",
    title: "555 Timer LED Flasher",
    grade: "Foundations",
    category: "Timing circuits",
    status: "Reference build",
    featured: true,
    summary: "A classic 555 timer circuit that turns a steady 5 V supply into a repeating blink.",
    description: "The NE555 runs in astable mode: a capacitor charges and discharges through two resistors, and the output switches high and low as it does. It is a useful first look at timing circuits because every part has a visible job.",
    featuredImage: "assets/images/cover-555-timer.svg",
    featuredImageAlt: "555 timer IC, resistors, capacitor, and blinking LED on a breadboard",
    schematicImage: "assets/images/schematic-555-timer.svg",
    schematicAlt: "Astable NE555 LED flasher schematic with timing resistors and capacitor",
    facts: [
      { label: "Supply", value: "5 V DC" },
      { label: "Level", value: "Beginner" },
      { label: "Rate", value: "About 1 blink/sec" },
      { label: "Build", value: "Breadboard" }
    ],
    principle: {
      title: "What sets the blink rate?",
      text: "R1, R2, and C1 set how quickly the timing capacitor charges and discharges. Larger resistance or capacitance slows the blink; smaller values speed it up.",
      formula: "f ≈ 1.44 / ((R1 + 2 × R2) × C1)"
    },
    objectives: [
      "Recognize the 555 timer's supply, reset, trigger, threshold, discharge, control, and output pins.",
      "See how an RC network creates a repeating timing cycle.",
      "Measure the output and compare the observed blink rate with a calculated estimate."
    ],
    materials: [
      { name: "NE555 timer IC", quantity: "1", notes: "A DIP-8 package is convenient for a solderless breadboard." },
      { name: "R1 resistor", quantity: "1 kΩ", notes: "¼ W; from +5 V to pin 7." },
      { name: "R2 resistor", quantity: "68 kΩ", notes: "¼ W; from pin 7 to the joined pins 2 and 6." },
      { name: "R3 resistor", quantity: "330 Ω", notes: "¼ W; in series with the LED." },
      { name: "C1 electrolytic capacitor", quantity: "10 µF, 10 V or higher", notes: "Positive lead to the joined pins 2 and 6; negative lead to ground." },
      { name: "C2 ceramic capacitor", quantity: "10 nF", notes: "From pin 5 (control) to ground." },
      { name: "C3 ceramic capacitor", quantity: "100 nF", notes: "Across the timer's supply pins, close to the IC." },
      { name: "LED", quantity: "1", notes: "A standard red LED is easy to see at this blink rate." },
      { name: "Breadboard and jumper wires", quantity: "As needed", notes: "Keep connections around the timing parts short and tidy." },
      { name: "Regulated DC supply", quantity: "5 V", notes: "Low-voltage DC only." }
    ],
    tools: ["Digital multimeter", "Breadboard jumper wires", "Component datasheet"],
    steps: [
      { title: "Place the 555", description: "With power disconnected, place the NE555 across the breadboard's center gap. Use the notch or pin-1 mark to orient the IC; confirm the pin numbering in its datasheet." },
      { title: "Wire the supply", description: "Connect pin 1 to ground and pin 8 to +5 V. Tie pin 4 (RESET) to +5 V so the timer can run. Place the 100 nF bypass capacitor between pins 8 and 1." },
      { title: "Build the timing network", description: "Connect R1 from +5 V to pin 7. Connect R2 from pin 7 to pins 2 and 6, which are tied together. Connect C1 from that joined timing node to ground, observing its polarity." },
      { title: "Connect the control and output", description: "Connect C2 from pin 5 to ground. From pin 3 (OUTPUT), connect R3 and the LED in series to ground. The LED's anode faces the output through R3; its cathode faces ground." },
      { title: "Power up and observe", description: "Check for misplaced wires and reversed electrolytic polarity before applying 5 V. The LED should blink steadily. Measure the period if you have a multimeter with frequency or duty-cycle mode." }
    ],
    gallery: [
      { image: "assets/images/cover-555-timer.svg", alt: "555 timer breadboard build illustration", caption: "Breadboard layout concept" },
      { image: "assets/images/schematic-555-timer.svg", alt: "555 astable circuit schematic", caption: "Circuit connections" }
    ],
    files: [
      { label: "NE555 timer datasheet — Texas Instruments", href: "https://www.ti.com/lit/ds/symlink/ne555.pdf", description: "Pinout, operating limits, and manufacturer application information." },
      { label: "Astable timer theory — Electronics Tutorials", href: "https://www.electronics-tutorials.ws/sequential/seq_3.html", description: "Timing intervals and the standard astable circuit equations." }
    ],
    notes: "The 1.05 Hz estimate assumes R1 = 1 kΩ, R2 = 68 kΩ, and C1 = 10 µF. Real capacitors have tolerance and leakage, so the measured rate will vary. Disconnect the supply before changing wiring."
  },
  {
    slug: "led-current-limiter",
    title: "LED and Current-Limiting Resistor",
    grade: "Foundations",
    category: "Circuit fundamentals",
    status: "Reference build",
    featured: true,
    summary: "A one-LED circuit that shows why a resistor belongs in series with an LED.",
    description: "A 5 V supply, one LED, and one resistor make a useful first circuit. Measure the voltage across the resistor, estimate current with Ohm's law, and compare the result with the LED's forward-voltage rating.",
    featuredImage: "assets/images/cover-led-current.svg",
    featuredImageAlt: "LED and resistor arranged on a small breadboard",
    schematicImage: "assets/images/schematic-led-current.svg",
    schematicAlt: "5 volt source feeding a 330 ohm resistor and LED in series",
    facts: [
      { label: "Supply", value: "5 V DC" },
      { label: "Level", value: "Beginner" },
      { label: "Current", value: "About 9 mA" },
      { label: "Build", value: "Breadboard" }
    ],
    principle: {
      title: "Why the resistor matters",
      text: "An LED does not regulate its own current. The series resistor drops the remaining supply voltage and limits current to a predictable range.",
      formula: "I ≈ (Vsupply − Vf) / R"
    },
    objectives: [
      "Identify LED anode and cathode.",
      "Measure the voltage drop across a series resistor.",
      "Use Ohm's law to estimate the current flowing through the LED."
    ],
    materials: [
      { name: "Red LED", quantity: "1", notes: "Check the part's forward-voltage and current ratings." },
      { name: "Series resistor", quantity: "330 Ω, ¼ W", notes: "A sensible starting value for a typical red LED on 5 V." },
      { name: "Breadboard and jumper wires", quantity: "As needed", notes: "A simple series path is all this circuit needs." },
      { name: "Regulated DC supply", quantity: "5 V", notes: "Low-voltage DC only." }
    ],
    tools: ["Digital multimeter", "Resistor color-code chart"],
    steps: [
      { title: "Identify the LED leads", description: "The longer lead is usually the anode (+); the shorter lead and flat edge of the package usually indicate the cathode (−). Check the LED datasheet if the leads have been trimmed." },
      { title: "Build one series path", description: "Connect +5 V to the 330 Ω resistor, then to the LED anode. Connect the LED cathode to ground. The resistor and LED must be in the same current path." },
      { title: "Test the circuit", description: "Apply 5 V. The LED should light. If it does not, disconnect power and check LED polarity and breadboard connections." },
      { title: "Measure and calculate", description: "Measure the voltage across the resistor. Estimate current using I = Vresistor / 330 Ω, then compare the result with the approximate value calculated from the LED's forward voltage." }
    ],
    gallery: [
      { image: "assets/images/cover-led-current.svg", alt: "LED and resistor on a breadboard", caption: "Simple series circuit" },
      { image: "assets/images/schematic-led-current.svg", alt: "LED resistor circuit diagram", caption: "Schematic" }
    ],
    files: [
      { label: "Ohm's law reference", href: "https://www.electronics-tutorials.ws/dccircuits/dcp_2.html", description: "Voltage, current, and resistance in a simple DC circuit." }
    ],
    notes: "The 9 mA estimate assumes a 2 V LED forward drop: (5 V − 2 V) / 330 Ω ≈ 9.1 mA. Actual current varies with the LED and the supply voltage."
  },
  {
    slug: "npn-transistor-switch",
    title: "NPN Transistor as a Switch",
    grade: "Foundations",
    category: "Transistors",
    status: "Reference build",
    featured: false,
    summary: "Use a small NPN transistor to switch an LED with a separate control signal.",
    description: "A transistor can control a load using a much smaller current at its base. This low-side switching circuit uses a pushbutton as the control input and an NPN transistor to turn the LED on and off.",
    featuredImage: "assets/images/cover-transistor-switch.svg",
    featuredImageAlt: "Small NPN transistor, LED, resistor, and pushbutton components",
    schematicImage: "assets/images/schematic-transistor-switch.svg",
    schematicAlt: "NPN transistor used as a low-side switch with base resistor and LED load",
    facts: [
      { label: "Supply", value: "5 V DC" },
      { label: "Level", value: "Beginner+" },
      { label: "Control", value: "Pushbutton" },
      { label: "Build", value: "Breadboard" }
    ],
    principle: {
      title: "A small signal controls the load",
      text: "Pressing the button sends base current through R1. The transistor conducts between collector and emitter, completing the LED's path to ground. R2 limits LED current and R3 keeps the base from floating.",
      formula: "Base current ≈ (5 V − 0.7 V) / 4.7 kΩ"
    },
    objectives: [
      "Identify base, collector, and emitter on the selected transistor.",
      "Recognize the difference between a control path and a load path.",
      "Explain the purpose of the base resistor and pull-down resistor."
    ],
    materials: [
      { name: "Small-signal NPN transistor", quantity: "1", notes: "For example, a PN2222A. Verify the exact package pinout in the part datasheet." },
      { name: "Base resistor R1", quantity: "4.7 kΩ, ¼ W", notes: "In series with the pushbutton and base." },
      { name: "Base pull-down R3", quantity: "100 kΩ, ¼ W", notes: "From base to ground, keeping the transistor off when the button is released." },
      { name: "LED resistor R2", quantity: "330 Ω, ¼ W", notes: "In series with the LED." },
      { name: "Red LED", quantity: "1", notes: "The switched load for this demonstration." },
      { name: "Momentary pushbutton", quantity: "1", notes: "Normally open." },
      { name: "Breadboard, jumpers, and regulated 5 V supply", quantity: "As needed", notes: "Low-voltage DC only." }
    ],
    tools: ["Digital multimeter", "Datasheet for the exact transistor"],
    steps: [
      { title: "Check the transistor pinout", description: "Transistor package pin order varies by part and manufacturer. Confirm the base, collector, and emitter from the exact datasheet before placing the device." },
      { title: "Wire the load", description: "Connect +5 V through the 330 Ω resistor and LED to the collector. Connect the emitter to ground. The LED's cathode faces the collector." },
      { title: "Wire the control", description: "Connect the pushbutton from +5 V through the 4.7 kΩ resistor to the base. Connect the 100 kΩ resistor from base to ground so the input stays low when the button is released." },
      { title: "Test the switch", description: "With the supply disconnected, check the wiring and then apply 5 V. The LED should turn on while the button is pressed and turn off when released." }
    ],
    gallery: [
      { image: "assets/images/cover-transistor-switch.svg", alt: "Transistor, pushbutton, and LED components", caption: "Parts used in the demonstration" },
      { image: "assets/images/schematic-transistor-switch.svg", alt: "NPN transistor low-side switch schematic", caption: "Switching circuit" }
    ],
    files: [
      { label: "PN2222A datasheet — onsemi", href: "https://www.onsemi.com/pdf/datasheet/p2n2222a-d.pdf", description: "Package information and electrical characteristics for the PN2222A family." }
    ],
    notes: "This circuit is for a small LED load on a low-voltage DC supply. Do not use it as a template for motors, mains voltage, or other loads without designing the correct driver and protection."
  }
];
