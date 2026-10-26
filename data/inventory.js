/*
  SHOP INVENTORY — EDITABLE DATA
  IMPORTANT: Every row below is DEMO data used to demonstrate the catalog.
  It is not a verified inventory count, manufacturer list, or storage map.
  Replace or delete these records before relying on stock quantities or locations.

  To add an item, copy one object and give it a unique id and partNumber.
  Keep quantity numeric, and use null if a count has not been verified.
  Location is split into area / cabinet / shelf / bin so filters stay useful.
*/
window.SHOP_INVENTORY = [
  {
    id: "EX-0001", partNumber: "RES-1K-025W", name: "1 kΩ resistor, ¼ W", manufacturer: "Generic",
    category: "Resistors", description: "Through-hole carbon-film resistor for current limiting, bias networks, and basic lab circuits.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet A", shelf: "Drawer A01", bin: "Bin 01" },
    quantity: 124, unit: "pcs", minimumQuantity: 30, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record. Verify actual quantity, tolerance, and power rating."
  },
  {
    id: "EX-0002", partNumber: "RES-330-025W", name: "330 Ω resistor, ¼ W", manufacturer: "Generic",
    category: "Resistors", description: "Common series resistor for indicator LEDs on low-voltage supplies; confirm current before use.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet A", shelf: "Drawer A01", bin: "Bin 02" },
    quantity: 86, unit: "pcs", minimumQuantity: 30, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record. Use the value appropriate to the circuit."
  },
  {
    id: "EX-0003", partNumber: "RES-10K-025W", name: "10 kΩ resistor, ¼ W", manufacturer: "Generic",
    category: "Resistors", description: "General-purpose resistor often used for pull-ups, pull-downs, and signal biasing.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet A", shelf: "Drawer A02", bin: "Bin 01" },
    quantity: 42, unit: "pcs", minimumQuantity: 25, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record."
  },
  {
    id: "EX-0004", partNumber: "RES-100K-025W", name: "100 kΩ resistor, ¼ W", manufacturer: "Generic",
    category: "Resistors", description: "Higher-value resistor for biasing and keeping high-impedance inputs from floating.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet A", shelf: "Drawer A02", bin: "Bin 02" },
    quantity: 18, unit: "pcs", minimumQuantity: 25, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example low-stock row. Example quantity only."
  },
  {
    id: "EX-0005", partNumber: "CAP-CER-100N", name: "100 nF ceramic capacitor", manufacturer: "Generic",
    category: "Capacitors", description: "Non-polarized capacitor commonly used for local supply bypassing and noise reduction.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet B", shelf: "Drawer B01", bin: "Bin 01" },
    quantity: 58, unit: "pcs", minimumQuantity: 25, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record. Verify capacitance and voltage rating."
  },
  {
    id: "EX-0006", partNumber: "CAP-ELEC-10U", name: "10 µF electrolytic capacitor", manufacturer: "Generic",
    category: "Capacitors", description: "Polarized capacitor for timing and filtering experiments. Observe the marked polarity.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet B", shelf: "Drawer B01", bin: "Bin 02" },
    quantity: 7, unit: "pcs", minimumQuantity: 15, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example low-stock row. Check voltage rating and polarity."
  },
  {
    id: "EX-0007", partNumber: "CAP-CER-10N", name: "10 nF ceramic capacitor", manufacturer: "Generic",
    category: "Capacitors", description: "Small non-polarized capacitor for control-pin bypassing and timing experiments.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet B", shelf: "Drawer B02", bin: "Bin 01" },
    quantity: 33, unit: "pcs", minimumQuantity: 15, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record."
  },
  {
    id: "EX-0008", partNumber: "LED-RED-5MM", name: "Red LED, 5 mm", manufacturer: "Generic",
    category: "LEDs & Displays", description: "Through-hole indicator LED for breadboard demonstrations and simple output circuits.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet C", shelf: "Drawer C01", bin: "Bin 01" },
    quantity: 39, unit: "pcs", minimumQuantity: 20, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record. Always use a suitable current-limiting component."
  },
  {
    id: "EX-0009", partNumber: "LED-GRN-5MM", name: "Green LED, 5 mm", manufacturer: "Generic",
    category: "LEDs & Displays", description: "Through-hole green indicator LED for status lights and output tests.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet C", shelf: "Drawer C01", bin: "Bin 02" },
    quantity: 22, unit: "pcs", minimumQuantity: 20, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record."
  },
  {
    id: "EX-0010", partNumber: "LED-RGB-5MM", name: "RGB LED, 5 mm", manufacturer: "Generic",
    category: "LEDs & Displays", description: "Multi-color indicator package; determine common-anode or common-cathode type before wiring.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet C", shelf: "Drawer C02", bin: "Bin 01" },
    quantity: 0, unit: "pcs", minimumQuantity: 5, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example out-of-stock row. This is not a statement about real shop stock."
  },
  {
    id: "EX-0011", partNumber: "IC-NE555-DIP8", name: "NE555 timer IC, DIP-8", manufacturer: "Generic",
    category: "Integrated Circuits", description: "Timer IC for monostable and astable experiments, including LED flasher circuits.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet D", shelf: "Drawer D01", bin: "Bin 01" },
    quantity: 14, unit: "pcs", minimumQuantity: 8, condition: "New", supplier: "Example supplier",
    datasheet: "https://www.ti.com/lit/ds/symlink/ne555.pdf", updatedAt: "2026-10-01", notes: "Example stock record. Check the exact manufacturer's datasheet."
  },
  {
    id: "EX-0012", partNumber: "TR-NPN-PN2222A", name: "PN2222A / small-signal NPN transistor", manufacturer: "Multiple / verify part",
    category: "Transistors", description: "Small BJT used as a switching or amplification example. Pinout is package-dependent.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet D", shelf: "Drawer D02", bin: "Bin 01" },
    quantity: 9, unit: "pcs", minimumQuantity: 10, condition: "New", supplier: "Example supplier",
    datasheet: "https://www.onsemi.com/pdf/datasheet/p2n2222a-d.pdf", updatedAt: "2026-10-01", notes: "Example low-stock row. Confirm part marking and lead order before wiring."
  },
  {
    id: "EX-0013", partNumber: "DIO-1N4148", name: "1N4148 signal diode", manufacturer: "Generic",
    category: "Diodes", description: "Small signal diode for switching and introductory diode circuits.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet D", shelf: "Drawer D03", bin: "Bin 01" },
    quantity: 24, unit: "pcs", minimumQuantity: 10, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record. Check cathode marking and ratings."
  },
  {
    id: "EX-0014", partNumber: "SW-PB-NO-6MM", name: "Normally-open momentary pushbutton", manufacturer: "Generic",
    category: "Switches", description: "Tactile switch for user input and simple transistor-control demonstrations.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet E", shelf: "Drawer E01", bin: "Bin 01" },
    quantity: 16, unit: "pcs", minimumQuantity: 10, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record. Verify which legs are internally connected."
  },
  {
    id: "EX-0015", partNumber: "BRD-BREAD-830", name: "830-point solderless breadboard", manufacturer: "Generic",
    category: "Prototyping", description: "Reusable solderless board for assembling low-voltage prototype circuits without permanent soldering.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet F", shelf: "Shelf F01", bin: "Slot 01" },
    quantity: 12, unit: "pcs", minimumQuantity: 6, condition: "Reusable", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record. Check rails and contact rows before use."
  },
  {
    id: "EX-0016", partNumber: "WIRE-JUMPER-MIX", name: "Breadboard jumper wire set", manufacturer: "Generic",
    category: "Wires & Cables", description: "Mixed pre-cut jumper wires for breadboard power rails and signal connections.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet F", shelf: "Drawer F02", bin: "Bin 01" },
    quantity: 6, unit: "sets", minimumQuantity: 4, condition: "Reusable", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record. Count usable wire sets, not individual wires."
  },
  {
    id: "EX-0017", partNumber: "WIRE-HOOKUP-22AWG", name: "22 AWG solid-core hookup wire", manufacturer: "Generic",
    category: "Wires & Cables", description: "Insulated solid-core wire for breadboard jumpers and low-voltage prototype wiring.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet F", shelf: "Reel rack F03", bin: "Reel 01" },
    quantity: 3, unit: "reels", minimumQuantity: 2, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record. Record length or remaining reel weight if useful."
  },
  {
    id: "EX-0018", partNumber: "TOOL-DMM-DIGITAL", name: "Digital multimeter", manufacturer: "Example model",
    category: "Test Equipment", description: "Meter for checking DC voltage, resistance, continuity, and current within the meter's rated limits.",
    location: { area: "DEMO — Tool Crib", cabinet: "Test equipment cabinet", shelf: "Shelf T01", bin: "Case 01" },
    quantity: 4, unit: "units", minimumQuantity: 3, condition: "Reusable", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example equipment record. Track asset number, lead condition, and calibration status in the notes."
  },
  {
    id: "EX-0019", partNumber: "TOOL-STRIPPER-WIRE", name: "Wire stripper", manufacturer: "Example model",
    category: "Hand Tools", description: "Hand tool for removing insulation without damaging the conductor when used with the correct gauge setting.",
    location: { area: "DEMO — Tool Crib", cabinet: "Hand-tool wall", shelf: "Hook H03", bin: "Slot 02" },
    quantity: 5, unit: "units", minimumQuantity: 3, condition: "Reusable", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example equipment record. Check adjustment and cutting edges."
  },
  {
    id: "EX-0020", partNumber: "TOOL-IRON-ADJ", name: "Temperature-controlled soldering station", manufacturer: "Example model",
    category: "Soldering Equipment", description: "Bench station for soldering tasks performed under class procedures, ventilation, and instructor supervision.",
    location: { area: "DEMO — Soldering Bench", cabinet: "Bench cabinet", shelf: "Slot S01", bin: "Station 01" },
    quantity: 2, unit: "units", minimumQuantity: 2, condition: "Reusable", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example equipment record. Inspect the cord, tip, holder, and ventilation before use."
  },
  {
    id: "EX-0021", partNumber: "CONN-HEADER-254", name: "2.54 mm pin-header strip", manufacturer: "Generic",
    category: "Connectors", description: "Breakaway header pins used for modules, perfboard, and test connections.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet G", shelf: "Drawer G01", bin: "Bin 01" },
    quantity: 18, unit: "strips", minimumQuantity: 6, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record. Note pin count per strip when issuing."
  },
  {
    id: "EX-0022", partNumber: "PROTO-PERF-TH", name: "Through-hole perfboard", manufacturer: "Generic",
    category: "Prototyping", description: "Perforated board for semi-permanent through-hole prototypes and small circuit assemblies.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet G", shelf: "Shelf G02", bin: "Slot 02" },
    quantity: 11, unit: "pcs", minimumQuantity: 5, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record. Record dimensions if multiple board sizes are stocked."
  },
  {
    id: "EX-0023", partNumber: "FUSE-GLASS-025A", name: "Glass cartridge fuse, 250 mA", manufacturer: "Generic",
    category: "Protection", description: "Replaceable fuse for compatible equipment only; match the specified size, type, voltage, and current rating.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet H", shelf: "Drawer H01", bin: "Bin 01" },
    quantity: 0, unit: "pcs", minimumQuantity: 5, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example out-of-stock row. Never substitute a fuse without checking equipment specifications."
  },
  {
    id: "EX-0024", partNumber: "BAT-HOLDER-AA2", name: "2-cell AA battery holder", manufacturer: "Generic",
    category: "Power & Batteries", description: "Battery holder for appropriate low-voltage portable prototypes; check polarity and cell chemistry.",
    location: { area: "DEMO — Electronics Lab", cabinet: "Cabinet H", shelf: "Drawer H02", bin: "Bin 01" },
    quantity: 8, unit: "pcs", minimumQuantity: 4, condition: "New", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example stock record. Do not mix cell types or bypass polarity protection."
  },
  {
    id: "EX-0025", partNumber: "ESD-WRIST-STRAP", name: "ESD wrist strap", manufacturer: "Example model",
    category: "Safety & ESD", description: "Electrostatic-discharge control accessory for handling compatible static-sensitive components under lab procedure.",
    location: { area: "DEMO — Tool Crib", cabinet: "ESD station", shelf: "Drawer ESD01", bin: "Bin 01" },
    quantity: 3, unit: "units", minimumQuantity: 3, condition: "Reusable", supplier: "Example supplier",
    datasheet: "", updatedAt: "2026-10-01", notes: "Example equipment record. Inspect strap and lead; use only as instructed."
  }
];
