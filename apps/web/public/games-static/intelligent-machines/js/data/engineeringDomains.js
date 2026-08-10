/* ================================================================
   ENGINEERING DOMAINS DATA
   Maps machines/components to the engineering disciplines behind them.
   ================================================================ */

const ENGINEERING_DISCIPLINES = {
  optics:{name:"Optics Engineering", icon:"🔬", color:"#00e5ff", desc:"Designs lenses and light paths to focus and capture images."},
  electronics:{name:"Electronics Engineering", icon:"🔌", color:"#7c3aed", desc:"Designs circuits that carry and control electrical signals."},
  semiconductors:{name:"Semiconductor Engineering", icon:"💠", color:"#ff2d95", desc:"Builds the microscopic chips that sense, compute, and store data."},
  computer_vision:{name:"Computer Vision", icon:"🖼️", color:"#00ffa3", desc:"Teaches software to interpret images and video like eyes do."},
  ai:{name:"Artificial Intelligence", icon:"🤖", color:"#ffb800", desc:"Builds algorithms that learn patterns and make intelligent decisions."},
  embedded:{name:"Embedded Systems", icon:"🧩", color:"#00e5ff", desc:"Programs tiny computers built directly into devices."},
  materials:{name:"Materials Engineering", icon:"⚙️", color:"#7c3aed", desc:"Develops materials with the right strength, weight, and durability."},
  mechanical:{name:"Mechanical Engineering", icon:"🔧", color:"#ff2d95", desc:"Designs moving parts, structures, and machines."},
  electrical:{name:"Electrical Engineering", icon:"⚡", color:"#00ffa3", desc:"Manages power generation, distribution, and electrical systems."},
  computer_science:{name:"Computer Science", icon:"💻", color:"#ffb800", desc:"Designs algorithms, software, and data structures."},
  robotics:{name:"Robotics Engineering", icon:"🦾", color:"#00e5ff", desc:"Combines mechanics, electronics, and software to build robots."},
  control_systems:{name:"Control Systems", icon:"🎛️", color:"#7c3aed", desc:"Designs feedback loops that keep systems stable and accurate."},
  chemical:{name:"Chemical Engineering", icon:"🧪", color:"#ff2d95", desc:"Designs the chemistry behind batteries, fuels, and materials."},
  biomedical:{name:"Biomedical Engineering", icon:"🩺", color:"#00ffa3", desc:"Applies engineering to healthcare and human biology."},
  communication:{name:"Communication Engineering", icon:"📡", color:"#ffb800", desc:"Designs systems that transmit information across distance."},
  aerospace:{name:"Aerospace Engineering", icon:"🚀", color:"#00e5ff", desc:"Designs aircraft, spacecraft, and flight systems."},
  civil:{name:"Civil / Structural Engineering", icon:"🏗️", color:"#7c3aed", desc:"Designs structures that safely bear load and stress."},
  physics:{name:"Applied Physics", icon:"⚛️", color:"#ff2d95", desc:"Provides the fundamental laws that all engineering relies on."},
  vlsi:{name:"VLSI Design", icon:"🔲", color:"#00ffa3", desc:"Designs millions of transistors packed onto a single chip."},
  automotive:{name:"Automotive Engineering", icon:"🚗", color:"#ffb800", desc:"Designs vehicles combining mechanical, electrical, and software systems."}
};

const ENGINEERING_MAPS = [
  { id:"camera", name:"Camera", icon:"📷", domains:["optics","electronics","semiconductors","computer_vision","ai","embedded","materials"],
    collaboration:"Optics engineers shape the lens, semiconductor engineers build the sensor chip, electronics engineers wire it together, and AI/computer vision engineers turn raw pixels into recognized objects." },
  { id:"cpu", name:"CPU", icon:"🧮", domains:["semiconductors","vlsi","electronics","computer_science","physics"],
    collaboration:"Physics defines how transistors switch, semiconductor & VLSI engineers pack billions of them onto a chip, and computer scientists design the instructions the chip executes." },
  { id:"memory", name:"Memory (RAM/Storage)", icon:"💾", domains:["semiconductors","electronics","computer_science","materials"],
    collaboration:"Materials and semiconductor engineers create dense storage cells, while computer scientists design how data is organized and retrieved quickly." },
  { id:"battery", name:"Battery", icon:"🔋", domains:["chemical","materials","electrical","electronics"],
    collaboration:"Chemical engineers design the reactive materials inside, materials engineers ensure safety and durability, and electrical engineers manage charge/discharge circuits." },
  { id:"display", name:"Display", icon:"🖥️", domains:["materials","semiconductors","electronics","optics"],
    collaboration:"Materials scientists develop light-emitting compounds, semiconductor engineers drive each pixel, and optics engineers ensure clarity and color accuracy." },
  { id:"communication_system", name:"Communication System", icon:"📡", domains:["communication","electronics","computer_science","physics"],
    collaboration:"Physics explains radio wave behavior, communication engineers design antennas/protocols, and computer scientists build the networking software on top." },
  { id:"robot_arm", name:"Robot Arm", icon:"🦾", domains:["mechanical","electrical","robotics","control_systems","computer_science"],
    collaboration:"Mechanical engineers design joints and links, electrical engineers power the motors, and control engineers write the algorithms that keep movements precise." },
  { id:"drone", name:"Plane", icon:"🚁", domains:["aerospace","mechanical","electrical","control_systems","embedded","communication"],
    collaboration:"Aerospace and mechanical engineers shape the airframe and propellers, control engineers keep it stable, and communication engineers link it to the remote controller." },
  { id:"car", name:"Car", icon:"🚗", domains:["automotive","mechanical","electrical","materials","computer_science","control_systems"],
    collaboration:"Mechanical engineers design the engine/chassis, electrical engineers wire the electronics, and computer scientists build the onboard software that ties it all together." },
  { id:"aircraft", name:"Aircraft", icon:"✈️", domains:["aerospace","mechanical","materials","electrical","control_systems"],
    collaboration:"Aerospace engineers design aerodynamics, materials engineers select lightweight strong alloys, and control engineers build autopilot systems." },
  { id:"medical_equipment", name:"Medical Equipment", icon:"🩻", domains:["biomedical","electronics","materials","computer_science","ai"],
    collaboration:"Biomedical engineers ensure devices are safe for the body, electronics engineers build the sensing circuits, and AI engineers help interpret medical data." },
  { id:"smartphone", name:"Smartphone", icon:"📱", domains:["semiconductors","electronics","computer_science","materials","optics","communication"],
    collaboration:"Dozens of engineering domains combine — chips, battery, camera, display, and network radios — into one small, powerful device." },
  { id:"computer", name:"Computer", icon:"💻", domains:["semiconductors","computer_science","electronics","materials"],
    collaboration:"Semiconductor engineers build the processor and memory chips, while computer scientists design the operating system and software that run on them." },
  { id:"industrial_robot", name:"Industrial Robot", icon:"🏭", domains:["mechanical","robotics","control_systems","electrical","computer_science"],
    collaboration:"Mechanical and robotics engineers build the physical arm, control engineers ensure precision, and software engineers program its tasks." },
  { id:"satellite", name:"Satellite", icon:"🛰️", domains:["aerospace","electrical","communication","materials","control_systems"],
    collaboration:"Aerospace engineers design orbit and structure, communication engineers build the signal links to Earth, and control engineers keep it stable in orbit." },
  { id:"wearable", name:"Wearable Device", icon:"⌚", domains:["embedded","biomedical","electronics","materials","ai"],
    collaboration:"Biomedical and embedded engineers combine to build small, comfortable sensors that track health data, processed with AI for insights." },
  { id:"iot", name:"IoT Device", icon:"🌐", domains:["embedded","communication","electronics","computer_science"],
    collaboration:"Embedded systems engineers build the tiny onboard computer, and communication engineers connect it wirelessly to the internet." },
  { id:"home_automation", name:"Home Automation", icon:"🏠", domains:["embedded","communication","electronics","computer_science","ai"],
    collaboration:"Embedded and communication engineers connect devices around the home, while software/AI engineers make them respond intelligently." },
  { id:"electric_vehicle", name:"Electric Vehicle", icon:"🔌", domains:["automotive","electrical","chemical","materials","control_systems","computer_science"],
    collaboration:"Chemical engineers design the battery cells, electrical engineers build the motor drive systems, and software engineers manage energy efficiently." },
  { id:"spacecraft", name:"Spacecraft", icon:"🛰️", domains:["aerospace","materials","electrical","control_systems","communication","physics"],
    collaboration:"Aerospace and materials engineers survive extreme conditions, while control and communication engineers keep it on course and in contact with Earth." }
];

const INTERDISCIPLINARY_EXAMPLES = [
  {pair:["mechanical","electronics"], example:"Robotics — motors (mechanical) controlled by circuits (electronics)."},
  {pair:["electronics","ai"], example:"Smart cameras — sensors (electronics) interpreted by AI models."},
  {pair:["mechanical","computer_science"], example:"CNC machines — mechanical parts driven by precise computer code."},
  {pair:["chemical","materials"], example:"Batteries — chemical reactions engineered into safe, durable materials."},
  {pair:["biomedical","ai"], example:"Medical diagnosis tools — biological data interpreted by AI pattern recognition."},
  {pair:["electrical","robotics"], example:"Electric robot arms — powered by electrical systems and directed by robotics control."},
  {pair:["embedded","communication"], example:"IoT sensors — tiny embedded computers linked by wireless communication."},
  {pair:["semiconductors","physics"], example:"Microchips — physics principles engineered into semiconductor transistors."}
];

if (typeof module !== "undefined") { module.exports = { ENGINEERING_DISCIPLINES, ENGINEERING_MAPS, INTERDISCIPLINARY_EXAMPLES }; }
