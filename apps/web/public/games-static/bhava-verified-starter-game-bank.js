/*
  Medhā Verified Master Game Bank — 80 Items (10 Questions per Game)
  Load BEFORE bhava-20-item-checkpoint.js.
  Covering website titles across Cognitive, Engineering, Language, Science, and Society domains.
  All items map strictly to bhaavajaalam.com gameplay concepts and BCS Lite cognitive areas.
*/
window.BHAVA_GAME_BANK = [

  /* =========================================================
     1. THE SECRET OF SILICON / CHIP DETECTIVE (10 ITEMS)
     Age: 9–17 | Area: Logic / Real-World
  ========================================================= */
  {
    id:'silicon-01', gameId:'secret-of-silicon', gameName:'The Secret of Silicon',
    area:'logic', skill:'technology-concepts', ageMin:9, ageMax:17, difficulty:1,
    prompt:'The Secret of Silicon describes chips as the heart of modern technology. What material gives the game its name?',
    options:['Silicon','Iron','Wood','Rubber'], answer:'Silicon',
    explanation:'The game focuses on silicon, the key semiconductor material used to make electronic chips.'
  },
  {
    id:'silicon-02', gameId:'secret-of-silicon', gameName:'The Secret of Silicon',
    area:'logic', skill:'electronic-systems', ageMin:9, ageMax:17, difficulty:1,
    prompt:'Which device relies on electronic chips to process information and execute commands?',
    options:['A smartphone','A paper notebook','A wooden chair','A glass cup'], answer:'A smartphone',
    explanation:'Smartphones contain electronic chips that process information and control all hardware functions.'
  },
  {
    id:'silicon-03', gameId:'secret-of-silicon', gameName:'The Secret of Silicon',
    area:'logic', skill:'systems-thinking', ageMin:10, ageMax:17, difficulty:2,
    prompt:'A transistor inside a chip mainly acts like a tiny electronic switch. What does it control?',
    options:['The flow of electrical current','The colour of paper','The weight of a book','The shape of a wheel'], answer:'The flow of electrical current',
    explanation:'Transistors turn electrical current on or off; billions of them work together inside chips.'
  },
  {
    id:'silicon-04', gameId:'secret-of-silicon', gameName:'The Secret of Silicon',
    area:'logic', skill:'cause-effect', ageMin:10, ageMax:17, difficulty:2,
    prompt:'Why are millions of tiny transistors combined onto a single integrated chip?',
    options:['So the chip can perform complex electronic computations','So the chip becomes a bicycle','So it can store petrol','So it can replace a tyre'], answer:'So the chip can perform complex electronic computations',
    explanation:'Combining many transistors allows a chip to process, store, and control complex electronic signals.'
  },
  {
    id:'silicon-05', gameId:'secret-of-silicon', gameName:'The Secret of Silicon',
    area:'real-world', skill:'technology-transfer', ageMin:9, ageMax:17, difficulty:1,
    prompt:'Which everyday item is most likely to depend on an electronic chip for its operation?',
    options:['A digital watch','A pencil eraser','A cotton towel','A clay pot'], answer:'A digital watch',
    explanation:'A digital watch uses an electronic microchip to keep accurate time and control its display.'
  },
  {
    id:'silicon-06', gameId:'secret-of-silicon', gameName:'The Secret of Silicon',
    area:'logic', skill:'systems-integration', ageMin:11, ageMax:17, difficulty:3,
    prompt:'If a chip doubles its transistor count without increasing its physical size, what engineering challenge must be managed?',
    options:['Heat dissipation and cooling','The weight of the screen','The color of the outer case','The length of the charging cord'], answer:'Heat dissipation and cooling',
    explanation:'Packing more active transistors into the same space increases electrical resistance and thermal heat.'
  },
  {
    id:'silicon-07', gameId:'secret-of-silicon', gameName:'The Secret of Silicon',
    area:'logic', skill:'binary-logic', ageMin:11, ageMax:17, difficulty:2,
    prompt:'In digital chips, what do the two states of a transistor switch (ON and OFF) represent in binary code?',
    options:['1 and 0','A and B','Plus and Minus','Red and Blue'], answer:'1 and 0',
    explanation:'Digital computers use binary code where ON represents 1 and OFF represents 0.'
  },
  {
    id:'silicon-08', gameId:'secret-of-silicon', gameName:'The Secret of Silicon',
    area:'real-world', skill:'material-properties', ageMin:11, ageMax:17, difficulty:2,
    prompt:'Why is silicon called a "semiconductor"?',
    options:['It can conduct electricity under some conditions but act as an insulator in others','It only conducts electricity underwater','It is half metal and half wood','It never conducts electricity'], answer:'It can conduct electricity under some conditions but act as an insulator in others',
    explanation:'Semiconductors allow engineers to precisely control when electrical current flows.'
  },
  {
    id:'silicon-09', gameId:'secret-of-silicon', gameName:'The Secret of Silicon',
    area:'attention', skill:'manufacturing-precision', ageMin:11, ageMax:17, difficulty:3,
    prompt:'Why are silicon chips manufactured in ultra-clean rooms with air filtration systems?',
    options:['A single speck of dust can ruin microscopic transistor circuits','To keep the workers warm','So the chips dry faster after painting','To prevent the chips from rusting in sunlight'], answer:'A single speck of dust can ruin microscopic transistor circuits',
    explanation:'Chip pathways are smaller than a speck of dust; contamination causes electrical short circuits.'
  },
  {
    id:'silicon-10', gameId:'secret-of-silicon', gameName:'The Secret of Silicon',
    area:'logic', skill:'logic-gates', ageMin:13, ageMax:17, difficulty:3,
    prompt:'When two transistors are connected in series so that BOTH must be ON for current to flow, which logic gate is formed?',
    options:['AND gate','OR gate','NOT gate','RANDOM gate'], answer:'AND gate',
    explanation:'An AND gate requires all inputs to be true (ON) for the output to be true.'
  },

  /* =========================================================
     2. BUILD YOUR CAR / CAR DESIGNER (10 ITEMS)
     Age: 11–17 | Area: Numeracy / Real-World
  ========================================================= */
  {
    id:'car-01', gameId:'build-your-car', gameName:'Build Your Car',
    area:'numeracy', skill:'component-function', ageMin:11, ageMax:17, difficulty:1,
    prompt:'In Build Your Car, which component supplies the initial electrical energy needed to start the vehicle?',
    options:['Battery','Radiator','Fuel tank','Wheel'], answer:'Battery',
    explanation:'The battery provides electrical energy used by the starter motor to fire the engine.'
  },
  {
    id:'dev-01', gameId:'device-engineer', gameName:'Device Engineer',
    area:'logic', skill:'hardware-anatomy', ageMin:11, ageMax:13, difficulty:1,
    prompt:'In Device Engineer, which component acts as the main circuit board connecting all smartphone parts together?',
    options:['The motherboard (logic board)','The screen glass','The speaker grill','The SIM tray'], answer:'The motherboard (logic board)',
    explanation:'The motherboard is the central communication backbone linking the CPU, memory, and sensors.'
  },
  {
    id:'dev-02', gameId:'device-engineer', gameName:'Device Engineer',
    area:'numeracy', skill:'battery-capacity', ageMin:11, ageMax:13, difficulty:1,
    prompt:'What does the "mAh" rating on a phone battery indicate to a device engineer?',
    options:['The total electrical energy storage capacity','The weight of the battery in grams','The charging cable length','The camera zoom distance'], answer:'The total electrical energy storage capacity',
    explanation:'Milliampere-hours (mAh) measure how much electrical charge a battery holds over time.'
  },
  {
    id:'dev-03', gameId:'device-engineer', gameName:'Device Engineer',
    area:'logic', skill:'touchscreen-physics', ageMin:11, ageMax:13, difficulty:2,
    prompt:'How does a modern capacitive touchscreen detect where your finger lands?',
    options:['It senses tiny changes in electrical charge caused by your finger','It measures the warmth of your skin','It uses a mechanical click button under the glass','It listens for a tapping sound'], answer:'It senses tiny changes in electrical charge caused by your finger',
    explanation:'Capacitive screens use a grid of conductors that interact with the natural electrical charge of human skin.'
  },
  {
    id:'dev-04', gameId:'device-engineer', gameName:'Device Engineer',
    area:'real-world', skill:'network-hardware', ageMin:11, ageMax:13, difficulty:1,
    prompt:'What is the primary role of a SIM card in a mobile device?',
    options:['To securely identify and authenticate the subscriber on a mobile network','To make the phone battery charge faster','To take higher resolution photos','To increase the volume of the speaker'], answer:'To securely identify and authenticate the subscriber on a mobile network',
    explanation:'SIM stands for Subscriber Identity Module, which stores unique credentials to connect to cell towers.'
  },
  {
    id:'dev-05', gameId:'device-engineer', gameName:'Device Engineer',
    area:'logic', skill:'sensor-function', ageMin:11, ageMax:13, difficulty:2,
    prompt:'Which internal sensor allows a phone to know if it is being held upright or horizontally?',
    options:['The accelerometer / gyroscope','The microphone','The ambient light sensor','The charging port'], answer:'The accelerometer / gyroscope',
    explanation:'Accelerometers detect orientation and motion by measuring gravitational forces.'
  },
  {
    id:'dev-06', gameId:'device-engineer', gameName:'Device Engineer',
    area:'real-world', skill:'acoustic-engineering', ageMin:11, ageMax:13, difficulty:1,
    prompt:'How does a smartphone speaker convert electrical signals into sound waves you can hear?',
    options:['An electromagnet vibrates a small diaphragm to push air molecules','It heats up the air until it makes noise','It shines a laser onto the screen glass','It spins a miniature metal fan'], answer:'An electromagnet vibrates a small diaphragm to push air molecules',
    explanation:'Vibrating diaphragms create pressure waves in the air that our ears perceive as sound.'
  },
  {
    id:'dev-07', gameId:'device-engineer', gameName:'Device Engineer',
    area:'logic', skill:'radio-transmission', ageMin:12, ageMax:13, difficulty:2,
    prompt:'Why do device engineers place antenna bands along the outer edges of a metal phone frame?',
    options:['Solid metal blocks radio signals, so external bands allow signals to escape and enter','To make the phone look colorful','To prevent the phone from sliding off a table','So the screen does not crack when dropped'], answer:'Solid metal blocks radio signals, so external bands allow signals to escape and enter',
    explanation:'Radio frequency waves cannot penetrate a solid metal enclosure (Faraday cage effect).'
  },
  {
    id:'dev-08', gameId:'device-engineer', gameName:'Device Engineer',
    area:'logic', skill:'system-architecture', ageMin:12, ageMax:13, difficulty:2,
    prompt:'What is the functional difference between RAM and internal Flash storage in a device?',
    options:['RAM stores active task data temporarily; Flash storage holds files permanently even when off','RAM is for photos and Flash is for music','RAM is hardware and Flash is software','There is no difference between them'], answer:'RAM stores active task data temporarily; Flash storage holds files permanently even when off',
    explanation:'RAM provides high-speed working memory, while non-volatile flash storage saves long-term data.'
  },
  {
    id:'dev-09', gameId:'device-engineer', gameName:'Device Engineer',
    area:'real-world', skill:'durability-engineering', ageMin:12, ageMax:13, difficulty:3,
    prompt:'What design feature allows a modern smartphone to achieve an IP68 water resistance rating?',
    options:['Rubber O-ring gaskets, adhesive seals, and hydrophobic mesh over ports','Painting the outside of the phone with glue','Removing the battery completely','Making the phone twice as thick'], answer:'Rubber O-ring gaskets, adhesive seals, and hydrophobic mesh over ports',
    explanation:'Precision mechanical seals prevent liquid intrusion while allowing air pressure to balance.'
  },
  {
    id:'dev-10', gameId:'device-engineer', gameName:'Device Engineer',
    area:'logic', skill:'thermal-design', ageMin:12, ageMax:13, difficulty:3,
    prompt:'Why do ultra-thin phones use copper vapor chambers or graphite sheets behind the screen?',
    options:['To spread and dissipate processor heat evenly across a larger surface area','To make the phone screen heavier','To conduct electricity to the camera','To reflect sunlight away from the battery'], answer:'To spread and dissipate processor heat evenly across a larger surface area',
    explanation:'Thermal spreaders prevent localized hot spots by drawing heat away from the CPU.'
  },

  /* =========================================================
     2. CHIP DETECTIVE (10 ITEMS) — Age: 11–15
  ========================================================= */
  {
    id:'chip-01', gameId:'chip-detective', gameName:'Chip Detective',
    area:'logic', skill:'semiconductor-physics', ageMin:11, ageMax:15, difficulty:1,
    prompt:'In Chip Detective, what is the main purpose of "doping" pure silicon with tiny amounts of other elements?',
    options:['To change its electrical conductivity and create P-type or N-type regions','To change the color of the chip to green','To make the silicon melt at lower temperatures','To wash away dirt from the wafer'], answer:'To change its electrical conductivity and create P-type or N-type regions',
    explanation:'Doping introduces extra electrons or missing electrons (holes) to control electrical flow.'
  },
  {
    id:'chip-02', gameId:'chip-detective', gameName:'Chip Detective',
    area:'logic', skill:'nanomanufacturing', ageMin:11, ageMax:15, difficulty:2,
    prompt:'What manufacturing process uses extreme ultraviolet (EUV) light to print microscopic circuits onto silicon?',
    options:['Photolithography','3D plastic printing','Hand soldering','Laser cutting'], answer:'Photolithography',
    explanation:'Photolithography projects intricate geometric patterns onto light-sensitive photoresist coatings.'
  },
  {
    id:'chip-03', gameId:'chip-detective', gameName:'Chip Detective',
    area:'real-world', skill:'wafer-fabrication', ageMin:11, ageMax:15, difficulty:1,
    prompt:'Before chips are cut into individual squares, what flat circular material are they built upon?',
    options:['A silicon wafer','A glass mirror','A copper plate','A plastic disc'], answer:'A silicon wafer',
    explanation:'Dozens to hundreds of integrated circuits are fabricated simultaneously on a thin, round silicon wafer.'
  },
  {
    id:'chip-04', gameId:'chip-detective', gameName:'Chip Detective',
    area:'numeracy', skill:'clock-frequency', ageMin:12, ageMax:15, difficulty:2,
    prompt:'If a chip operates at a clock speed of 3 GHz (Gigahertz), how many cycles does it complete per second?',
    options:['3 billion cycles per second','3 thousand cycles per second','3 hundred cycles per second','3 million cycles per second'], answer:'3 billion cycles per second',
    explanation:'Giga indicates one billion, so 3 GHz equals three billion synchronizing clock cycles every second.'
  },
  {
    id:'chip-05', gameId:'chip-detective', gameName:'Chip Detective',
    area:'numeracy', skill:'scale-measurement', ageMin:12, ageMax:15, difficulty:2,
    prompt:'When chip engineers refer to a "3-nanometer" process node, what scale of measurement are they working in?',
    options:['Billionths of a meter','Thousandths of a meter','Millionths of a meter','Tenths of a meter'], answer:'Billionths of a meter',
    explanation:'A nanometer (nm) is one-billionth of a meter, smaller than a single strand of human DNA.'
  },
  {
    id:'chip-06', gameId:'chip-detective', gameName:'Chip Detective',
    area:'logic', skill:'logic-gates', ageMin:13, ageMax:15, difficulty:3,
    prompt:'Which digital logic gate produces a true (1) output if AT LEAST ONE of its inputs is true (1)?',
    options:['OR gate','AND gate','NOT gate','NAND gate'], answer:'OR gate',
    explanation:'An OR gate outputs 1 whenever any connected input line carries a high electrical signal.'
  },
  {
    id:'chip-07', gameId:'chip-detective', gameName:'Chip Detective',
    area:'attention', skill:'wire-bonding', ageMin:11, ageMax:15, difficulty:2,
    prompt:'How are microscopic silicon dies electrically connected to the metal pins on the outside of a chip package?',
    options:['Using ultra-thin gold or copper wire bonds or solder bumps','Using liquid glue','Using miniature steel screws','Using wooden pegs'], answer:'Using ultra-thin gold or copper wire bonds or solder bumps',
    explanation:'Wire bonding attaches hair-thin wires between the die pads and the package lead frame.'
  },
  {
    id:'chip-08', gameId:'chip-detective', gameName:'Chip Detective',
    area:'logic', skill:'transistor-switching', ageMin:13, ageMax:15, difficulty:3,
    prompt:'In a MOSFET transistor, which terminal controls whether electrical current can flow between Source and Drain?',
    options:['The Gate terminal','The Ground terminal','The Antenna terminal','The Battery terminal'], answer:'The Gate terminal',
    explanation:'Applying voltage to the Gate creates an electrostatic channel that allows current to flow.'
  },
  {
    id:'chip-09', gameId:'chip-detective', gameName:'Chip Detective',
    area:'real-world', skill:'integrated-circuits', ageMin:12, ageMax:15, difficulty:2,
    prompt:'Why is an Integrated Circuit (IC) much more reliable than an old circuit built from separate, wired components?',
    options:['All components and interconnections are etched into one solid crystal without fragile external wires','It uses larger batteries','It has no transistors inside','It never requires electricity to work'], answer:'All components and interconnections are etched into one solid crystal without fragile external wires',
    explanation:'Monolithic integration eliminates mechanical solder joints, drastically reducing failure rates.'
  },
  {
    id:'chip-10', gameId:'chip-detective', gameName:'Chip Detective',
    area:'real-world', skill:'quality-inspection', ageMin:12, ageMax:15, difficulty:3,
    prompt:'Why do inspectors use scanning electron microscopes (SEM) instead of optical microscopes to examine chips?',
    options:['Transistor features are smaller than the wavelength of visible light','Electron microscopes are much cheaper','Optical microscopes melt the silicon','SEMs can see through solid metal tables'], answer:'Transistor features are smaller than the wavelength of visible light',
    explanation:'Visible light waves are too wide to resolve structures measured in nanometers.'
  },

  /* =========================================================
     3. BUILD CYCLES (10 ITEMS) — Age: 8–10
  ========================================================= */
  {
    id:'cycle-01', gameId:'build-cycles', gameName:'Build Cycles',
    area:'logic', skill:'frame-geometry', ageMin:8, ageMax:10, difficulty:1,
    prompt:'In Build Cycles, why are bicycle frames shaped like connected triangles instead of squares?',
    options:['Triangles are rigid structures that do not bend or deform under rider weight','Squares are too shiny','Triangles make the tires spin faster','Squares require zero metal to build'], answer:'Triangles are rigid structures that do not bend or deform under rider weight',
    explanation:'A triangle is inherently stable because its angles cannot change without changing a side length.'
  },
  {
    id:'cycle-02', gameId:'build-cycles', gameName:'Build Cycles',
    area:'logic', skill:'lever-mechanics', ageMin:8, ageMax:10, difficulty:1,
    prompt:'What simple machine is demonstrated by a bicycle pedal crank turning the front chainring?',
    options:['A wheel and axle lever system','A pulley block','A wedge blade','An inclined plane ramp'], answer:'A wheel and axle lever system',
    explanation:'The pedal crank acts as a lever arm turning the axle of the central chainring.'
  },
  {
    id:'cycle-03', gameId:'build-cycles', gameName:'Build Cycles',
    area:'attention', skill:'wheel-truing', ageMin:8, ageMax:10, difficulty:2,
    prompt:'Why does a bicycle wheel have dozens of thin metal spokes connecting the hub to the outer rim?',
    options:['To distribute the rider\'s weight evenly through balanced tension around the wheel','To make a whistling sound in the wind','To carry water bottles','To prevent the chain from falling off'], answer:'To distribute the rider\'s weight evenly through balanced tension around the wheel',
    explanation:'Spokes hold the rim in tension, creating a lightweight yet immensely strong circular structure.'
  },
  {
    id:'cycle-04', gameId:'build-cycles', gameName:'Build Cycles',
    area:'real-world', skill:'bearing-function', ageMin:8, ageMax:10, difficulty:2,
    prompt:'What tiny steel balls inside the wheel hubs allow bicycle wheels to spin freely without scraping?',
    options:['Ball bearings','Steel marbles','Magnetic beads','Rubber pebbles'], answer:'Ball bearings',
    explanation:'Ball bearings convert sliding friction into smooth rolling friction between moving metal parts.'
  },
  {
    id:'cycle-05', gameId:'build-cycles', gameName:'Build Cycles',
    area:'logic', skill:'braking-systems', ageMin:8, ageMax:10, difficulty:1,
    prompt:'How does a "coaster brake" on a kid\'s bicycle work?',
    options:['Pedaling backward pushes internal brake pads against the rear wheel hub','Squeezing a hand lever drops an anchor','Shouting loudly stops the bike','Pressing a button pops the front tire'], answer:'Pedaling backward pushes internal brake pads against the rear wheel hub',
    explanation:'Coaster brakes are hub-integrated mechanisms actuated by reversing pedal rotation.'
  },
  {
    id:'cycle-06', gameId:'build-cycles', gameName:'Build Cycles',
    area:'real-world', skill:'ergonomic-fit', ageMin:8, ageMax:10, difficulty:1,
    prompt:'Why should the bicycle saddle height be adjusted so the rider\'s leg is almost straight at the bottom of the pedal stroke?',
    options:['To pedal with maximum leg power and protect knee joints from injury','So the rider can touch the clouds','To make the bicycle look taller','To stop the chain from making noise'], answer:'To pedal with maximum leg power and protect knee joints from injury',
    explanation:'Proper seat height ensures the leg muscles operate at peak mechanical efficiency.'
  },
  {
    id:'cycle-07', gameId:'build-cycles', gameName:'Build Cycles',
    area:'attention', skill:'steering-assembly', ageMin:9, ageMax:10, difficulty:2,
    prompt:'Which bicycle part holds the front fork and handlebars together inside the frame so you can steer?',
    options:['The headset bearings','The seat post clamp','The rear derailleur','The spoke nipple'], answer:'The headset bearings',
    explanation:'The headset is the bearing assembly inside the frame head tube allowing fork rotation.'
  },
  {
    id:'cycle-08', gameId:'build-cycles', gameName:'Build Cycles',
    area:'real-world', skill:'tire-tread', ageMin:8, ageMax:10, difficulty:1,
    prompt:'Why do bicycle tires have grooves and rubber tread patterns instead of being smooth plastic?',
    options:['To grip the road surface and push water away so the bike does not slip','To make decorative marks in the mud','Because smooth rubber cannot be manufactured','To make the bicycle pedal itself'], answer:'To grip the road surface and push water away so the bike does not slip',
    explanation:'Treads create mechanical traction and prevent hydroplaning on wet surfaces.'
  },
  {
    id:'cycle-09', gameId:'build-cycles', gameName:'Build Cycles',
    area:'logic', skill:'drivetrain-ratios', ageMin:9, ageMax:10, difficulty:2,
    prompt:'If the front chainring has 40 teeth and the rear sprocket has 20 teeth, how many times does the rear wheel turn for every pedal revolution?',
    options:['2 times','1 time','4 times','20 times'], answer:'2 times',
    explanation:'Dividing front teeth (40) by rear teeth (20) gives a 2:1 gear ratio.'
  },
  {
    id:'cycle-10', gameId:'build-cycles', gameName:'Build Cycles',
    area:'logic', skill:'mechanical-bells', ageMin:8, ageMax:10, difficulty:1,
    prompt:'What happens mechanically when you pull and release the thumb lever on a classic bicycle bell?',
    options:['A spring-loaded clapper rapidly strikes the inside of the metal dome','An electric motor plays a recorded sound','A balloon pops inside the handlebars','The brakes automatically lock'], answer:'A spring-loaded clapper rapidly strikes the inside of the metal dome',
    explanation:'Classic bells use a spring-and-gear mechanism to ring a resonating metal shell.'
  },

  /* =========================================================
     4. ROCKET ENGINEER (10 ITEMS) — Age: 14–17
  ========================================================= */
  {
    id:'rocket-01', gameId:'rocket-engineer', gameName:'Rocket Engineer',
    area:'logic', skill:'propulsion-physics', ageMin:14, ageMax:17, difficulty:1,
    prompt:'Which fundamental law of physics explains how a rocket accelerates upward by shooting exhaust gases downward?',
    options:['Newton\'s Third Law (Action and Reaction)','Newton\'s First Law of Inertia','Boyle\'s Law of Gas Volume','Ohm\'s Law of Resistance'], answer:'Newton\'s Third Law (Action and Reaction)',
    explanation:'For every downward force exerted on high-speed exhaust, an equal and opposite force lifts the rocket.'
  },
  {
    id:'rocket-02', gameId:'rocket-engineer', gameName:'Rocket Engineer',
    area:'numeracy', skill:'orbital-velocity', ageMin:14, ageMax:17, difficulty:2,
    prompt:'What is "escape velocity" in rocket engineering?',
    options:['The minimum speed required to break free from a planet\'s gravitational pull without further propulsion','The maximum speed a parachute can deploy','The speed at which fuel burns inside the nozzle','The speed of sound in Earth\'s atmosphere'], answer:'The minimum speed required to break free from a planet\'s gravitational pull without further propulsion',
    explanation:'Earth\'s escape velocity is roughly 11.2 km/s (40,000 km/h).'
  },
  {
    id:'rocket-03', gameId:'rocket-engineer', gameName:'Rocket Engineer',
    area:'logic', skill:'staging-efficiency', ageMin:14, ageMax:17, difficulty:2,
    prompt:'Why do rockets use multi-stage designs where empty fuel tanks are dropped mid-flight?',
    options:['To shed dead weight so the remaining engines can accelerate the payload much faster','So the falling tanks can land on the Moon','Because rockets cannot be built over 10 meters tall','To make the sky look colorful'], answer:'To shed dead weight so the remaining engines can accelerate the payload much faster',
    explanation:'Dropping empty mass dramatically improves the thrust-to-weight ratio for upper stages.'
  },
  {
    id:'rocket-04', gameId:'rocket-engineer', gameName:'Rocket Engineer',
    area:'real-world', skill:'propellant-types', ageMin:14, ageMax:17, difficulty:2,
    prompt:'What is the main advantage of liquid-fueled rocket engines over solid-fueled boosters?',
    options:['Liquid engines can be throttled up or down, shut off, and restarted during flight','Liquid engines weigh zero kilograms','Solid engines cannot produce any thrust','Liquid engines burn underwater without oxygen'], answer:'Liquid engines can be throttled up or down, shut off, and restarted during flight',
    explanation:'Solid boosters burn continuously once lit, whereas liquid valves allow precise flight control.'
  },
  {
    id:'rocket-05', gameId:'rocket-engineer', gameName:'Rocket Engineer',
    area:'logic', skill:'thrust-vectoring', ageMin:15, ageMax:17, difficulty:3,
    prompt:'How does a gimbaled rocket engine steer the vehicle through the atmosphere?',
    options:['By tilting the engine nozzle slightly to direct the thrust vector off-center','By turning large steering wheels on the nose cone','By dropping anchors out the side windows','By blowing air out of the cabin vents'], answer:'By tilting the engine nozzle slightly to direct the thrust vector off-center',
    explanation:'Thrust vectoring pivots the main engine nozzle to rotate the vehicle\'s center of gravity.'
  },
  {
    id:'rocket-06', gameId:'rocket-engineer', gameName:'Rocket Engineer',
    area:'logic', skill:'aerodynamic-stability', ageMin:15, ageMax:17, difficulty:3,
    prompt:'For stable rocket flight, where must the Center of Gravity (CG) be located relative to the Center of Pressure (CP)?',
    options:['The CG must be located forward (closer to the nose) of the CP','The CG must be behind the CP near the engine nozzle','The CG and CP must be in the exact same spot','The CG must be outside the rocket body'], answer:'The CG must be located forward (closer to the nose) of the CP',
    explanation:'Placing CG ahead of CP ensures air resistance naturally corrects any sideways wobbling.'
  },
  {
    id:'rocket-07', gameId:'rocket-engineer', gameName:'Rocket Engineer',
    area:'numeracy', skill:'payload-ratio', ageMin:15, ageMax:17, difficulty:3,
    prompt:'In typical orbital rocket launches, roughly what percentage of the total launch weight is actual payload (satellite/crew)?',
    options:['Only about 1% to 4% of the total weight','Over 75% of the total weight','Exactly 50% of the total weight','0% because weight disappears in space'], answer:'Only about 1% to 4% of the total weight',
    explanation:'Over 85-90% of launch weight is propellant, with structure and engines taking the rest.'
  },
  {
    id:'rocket-08', gameId:'rocket-engineer', gameName:'Rocket Engineer',
    area:'real-world', skill:'aerodynamics', ageMin:14, ageMax:17, difficulty:1,
    prompt:'Why is the payload fairing at the front of a rocket shaped like a smooth, tapered cone?',
    options:['To minimize aerodynamic drag and supersonic shockwaves during atmospheric ascent','To make the rocket look like a spear','So raindrops bounce off into space','Because square metal plates cannot be built'], answer:'To minimize aerodynamic drag and supersonic shockwaves during atmospheric ascent',
    explanation:'Streamlined fairings protect payloads and reduce structural heating at high Mach numbers.'
  },
  {
    id:'rocket-09', gameId:'rocket-engineer', gameName:'Rocket Engineer',
    area:'logic', skill:'vacuum-combustion', ageMin:14, ageMax:17, difficulty:2,
    prompt:'Why must space rockets carry tanks of oxidizer (like liquid oxygen) in addition to fuel?',
    options:['Space is a vacuum with no air; combustion requires oxygen to burn fuel','Oxidizer is used to cool the astronauts\' drinking water','The oxidizer makes the rocket white','Oxidizer makes the rocket lighter than air'], answer:'Space is a vacuum with no air; combustion requires oxygen to burn fuel',
    explanation:'Jet airplanes breathe atmospheric oxygen, but rockets must supply both reactants.'
  },
  {
    id:'rocket-10', gameId:'rocket-engineer', gameName:'Rocket Engineer',
    area:'real-world', skill:'thermal-protection', ageMin:15, ageMax:17, difficulty:3,
    prompt:'Why do spacecraft heat shields use ablative materials or ceramic tiles during Earth re-entry?',
    options:['To absorb and dissipate extreme heat caused by air compression at orbital speeds','To keep the spaceship cold during winter launches','To reflect moonlight back to Earth','To stop birds from hitting the metal'], answer:'To absorb and dissipate extreme heat caused by air compression at orbital speeds',
    explanation:'Re-entry compression generates thousands of degrees of heat that would melt normal metals.'
  },

  /* =========================================================
     5. BHĀVA SPACE ACADEMY (10 ITEMS) — Age: 14–17
  ========================================================= */
  {
    id:'space-01', gameId:'space-academy', gameName:'Medhā Space Academy',
    area:'real-world', skill:'orbital-mechanics', ageMin:14, ageMax:17, difficulty:1,
    prompt:'In Medhā Space Academy, what keeps the International Space Station (ISS) in Low Earth Orbit without falling?',
    options:['It travels sideways so fast (28,000 km/h) that as it falls toward Earth, the Earth curves away below it','It hangs from a giant cable attached to the Moon','It uses rocket engines to hover continuously every second','There is zero gravity anywhere near Earth'], answer:'It travels sideways so fast (28,000 km/h) that as it falls toward Earth, the Earth curves away below it',
    explanation:'Orbiting is continuous free-fall matched precisely to the curvature of the planet.'
  },
  {
    id:'space-02', gameId:'space-academy', gameName:'Medhā Space Academy',
    area:'logic', skill:'microgravity-physics', ageMin:14, ageMax:17, difficulty:2,
    prompt:'Why do astronauts float inside the ISS even though Earth\'s gravity at orbital altitude is still around 90% as strong as on the surface?',
    options:['The astronauts and the station are falling around Earth together at the exact same rate','The ISS walls shield out all gravitational forces','The astronauts wear anti-gravity magnetic boots','The Moon pulls them upward with equal force'], answer:'The astronauts and the station are falling around Earth together at the exact same rate',
    explanation:'Floating in orbit is an apparent weightlessness caused by uniform free-fall acceleration.'
  },
  {
    id:'space-03', gameId:'space-academy', gameName:'Medhā Space Academy',
    area:'real-world', skill:'space-power', ageMin:14, ageMax:17, difficulty:1,
    prompt:'How does the International Space Station generate the primary electrical power needed for its laboratories?',
    options:['Using large solar array panels that convert sunlight into electricity','Burning coal inside the orbital engine room','Using nuclear power plants on the roof','Plugging a cable directly into Earth'], answer:'Using large solar array panels that convert sunlight into electricity',
    explanation:'The ISS features over 2,500 square meters of solar arrays tracking the Sun.'
  },
  {
    id:'space-04', gameId:'space-academy', gameName:'Medhā Space Academy',
    area:'logic', skill:'life-support', ageMin:15, ageMax:17, difficulty:3,
    prompt:'How does the ISS Life Support System (ECLSS) provide fresh oxygen for astronauts to breathe?',
    options:['By splitting recycled water molecules into hydrogen and oxygen via electrolysis','By opening windows to catch passing clouds','By burning wood inside the station airlock','By compressing vacuum space dust into air'], answer:'By splitting recycled water molecules into hydrogen and oxygen via electrolysis',
    explanation:'Electrolysis uses solar electricity to separate H2O into breathable oxygen and hydrogen gas.'
  },
  {
    id:'space-05', gameId:'space-academy', gameName:'Medhā Space Academy',
    area:'real-world', skill:'eva-suits', ageMin:14, ageMax:17, difficulty:2,
    prompt:'Why must an astronaut wear a pressurized EMU spacesuit during a spacewalk outside the ISS?',
    options:['Space has no air pressure; without a suit, bodily fluids would boil and breathing is impossible','To stay dry in case it rains in space','To hide from space telescopes','Because the sun is too bright to look at'], answer:'Space has no air pressure; without a suit, bodily fluids would boil and breathing is impossible',
    explanation:'Spacesuits act as miniature personal spacecraft providing pressure, thermal insulation, and air.'
  },
  {
    id:'space-06', gameId:'space-academy', gameName:'Medhā Space Academy',
    area:'logic', skill:'astronaut-health', ageMin:14, ageMax:17, difficulty:2,
    prompt:'Why are astronauts required to exercise on treadmills and resistance machines for two hours every day?',
    options:['To prevent severe muscle atrophy and bone density loss in microgravity','To generate electricity for the station lights','So they can run faster after returning to Earth','To keep the space station balanced in orbit'], answer:'To prevent severe muscle atrophy and bone density loss in microgravity',
    explanation:'Without weight-bearing loads, bones shed calcium and skeletal muscles rapidly weaken.'
  },
  {
    id:'space-07', gameId:'space-academy', gameName:'Medhā Space Academy',
    area:'logic', skill:'airlock-mechanics', ageMin:15, ageMax:17, difficulty:3,
    prompt:'Why do airlocks have two doors that are never opened at the exact same time?',
    options:['To allow astronauts to exit into the vacuum without venting the station\'s interior air into space','To stop space aliens from sneaking inside','Because two doors make the station look symmetrical','So the doors do not hit each other'], answer:'To allow astronauts to exit into the vacuum without venting the station\'s interior air into space',
    explanation:'Airlocks depressurize a small intermediate chamber while preserving main cabin pressure.'
  },
  {
    id:'space-08', gameId:'space-academy', gameName:'Medhā Space Academy',
    area:'logic', skill:'attitude-control', ageMin:15, ageMax:17, difficulty:3,
    prompt:'What is the primary role of Reaction Control System (RCS) thrusters on a spacecraft?',
    options:['To make micro-adjustments to the spacecraft orientation and rotation in zero gravity','To launch the spacecraft off the Earth launchpad','To warm up the astronaut sleeping quarters','To spray paint onto the exterior fuselage'], answer:'To make micro-adjustments to the spacecraft orientation and rotation in zero gravity',
    explanation:'Small pulsed thrusters manage pitch, roll, and yaw during delicate orbital maneuvers.'
  },
  {
    id:'space-09', gameId:'space-academy', gameName:'Medhā Space Academy',
    area:'attention', skill:'docking-precision', ageMin:14, ageMax:17, difficulty:2,
    prompt:'What alignment system is critical when a visiting cargo spacecraft docks with the ISS?',
    options:['Laser guidance sensors and automated docking capture latches','Throwing a rope from the window and pulling it by hand','Bumping into the station at full speed until it sticks','Using magnetic compasses to point North'], answer:'Laser guidance sensors and automated docking capture latches',
    explanation:'Orbital docking requires millimeter precision at relative velocities near zero.'
  },
  {
    id:'space-10', gameId:'space-academy', gameName:'Medhā Space Academy',
    area:'numeracy', skill:'orbital-period', ageMin:14, ageMax:17, difficulty:2,
    prompt:'Because the ISS circles Earth once every 90 minutes, how many sunrises do astronauts witness per day?',
    options:['16 sunrises per day','1 sunrise per day','24 sunrises per day','365 sunrises per day'], answer:'16 sunrises per day',
    explanation:'Dividing 24 hours (1,440 minutes) by the 90-minute orbital period equals 16 full orbits daily.'
  },

  /* =========================================================
     6. DRONE ENGINEER (10 ITEMS) — Age: 14–17
  ========================================================= */
  {
    id:'drone-01', gameId:'drone-engineer', gameName:'Drone Engineer',
    area:'logic', skill:'torque-cancellation', ageMin:14, ageMax:17, difficulty:1,
    prompt:'Why does a quadcopter drone have two propellers spinning clockwise and two spinning counter-clockwise?',
    options:['To cancel out rotational torque so the drone frame does not spin in circles','To make the drone look balanced','Because motors only spin in one direction by law','So the propellers do not hit each other'], answer:'To cancel out rotational torque so the drone frame does not spin in circles',
    explanation:'Opposing motor rotations balance yaw torque, keeping the fuselage steady in hover.'
  },
  {
    id:'drone-02', gameId:'drone-engineer', gameName:'Drone Engineer',
    area:'logic', skill:'flight-control', ageMin:14, ageMax:17, difficulty:2,
    prompt:'How does a drone fly forward toward a target?',
    options:['It speeds up the rear propellers to tilt the nose down, directing thrust backward','It turns on a jet engine on the tail','It folds its front arms inward','It drops its battery to slide forward'], answer:'It speeds up the rear propellers to tilt the nose down, directing thrust backward',
    explanation:'Pitching forward converts vertical lift into a horizontal propulsion vector.'
  },
  {
    id:'drone-03', gameId:'drone-engineer', gameName:'Drone Engineer',
    area:'logic', skill:'imu-stabilization', ageMin:15, ageMax:17, difficulty:3,
    prompt:'Which internal sensor unit continuously measures tilt and acceleration 1,000 times per second to keep a drone stable?',
    options:['The Inertial Measurement Unit (IMU)','The GPS antenna','The camera lens','The SD card slot'], answer:'The Inertial Measurement Unit (IMU)',
    explanation:'The IMU fuses gyroscope and accelerometer data to feed real-time stabilization algorithms.'
  },
  {
    id:'drone-04', gameId:'drone-engineer', gameName:'Drone Engineer',
    area:'real-world', skill:'motor-technology', ageMin:14, ageMax:17, difficulty:2,
    prompt:'Why do high-performance drones use Brushless DC motors instead of brushed motors?',
    options:['Brushless motors have higher efficiency, longer life, and no brush friction wear','Brushless motors are made of solid wood','Brushed motors are illegal in aviation','Brushless motors do not need wires'], answer:'Brushless motors have higher efficiency, longer life, and no brush friction wear',
    explanation:'Electronic commutation eliminates mechanical brush wear and reduces electrical noise.'
  },
  {
    id:'drone-05', gameId:'drone-engineer', gameName:'Drone Engineer',
    area:'logic', skill:'esc-function', ageMin:15, ageMax:17, difficulty:3,
    prompt:'What is the role of the Electronic Speed Controller (ESC) on a drone arm?',
    options:['To convert battery DC power into precise pulsed signals that regulate motor RPM','To record video onto the memory card','To measure wind speed outside','To keep the propellers from rusting'], answer:'To convert battery DC power into precise pulsed signals that regulate motor RPM',
    explanation:'ESCs interpret flight controller commands to spin each motor at exact speeds.'
  },
  {
    id:'drone-06', gameId:'drone-engineer', gameName:'Drone Engineer',
    area:'numeracy', skill:'battery-c-rating', ageMin:15, ageMax:17, difficulty:3,
    prompt:'Why do drone engineers select LiPo (Lithium Polymer) batteries with high "C-ratings"?',
    options:['High C-ratings allow the battery to safely discharge massive electrical currents instantly for flight','C-rating means the battery is shaped like the letter C','C-rating indicates the battery is waterproof in oceans','C-rating means the battery never runs out of charge'], answer:'High C-ratings allow the battery to safely discharge massive electrical currents instantly for flight',
    explanation:'The C-rating measures maximum safe continuous discharge rate relative to capacity.'
  },
  {
    id:'drone-07', gameId:'drone-engineer', gameName:'Drone Engineer',
    area:'real-world', skill:'gps-navigation', ageMin:14, ageMax:17, difficulty:1,
    prompt:'What happens when a drone loses signal from its remote controller if GPS is enabled?',
    options:['It activates "Return to Home" (RTH) and autonomously flies back to the launch coordinates','It turns off its motors immediately and falls to the ground','It flies up into outer space forever','It starts playing music from the speakers'], answer:'It activates "Return to Home" (RTH) and autonomously flies back to the launch coordinates',
    explanation:'Autonomous failsafe systems use satellite coordinates to recover lost aircraft.'
  },
  {
    id:'drone-08', gameId:'drone-engineer', gameName:'Drone Engineer',
    area:'logic', skill:'yaw-control', ageMin:15, ageMax:17, difficulty:3,
    prompt:'How does a quadcopter rotate (yaw) horizontally in place without moving in any direction?',
    options:['It speeds up the two clockwise motors while slowing the two counter-clockwise motors','It tilts its entire frame upside down','It stops three motors and runs only one','It extends a rudder sail from the bottom'], answer:'It speeds up the two clockwise motors while slowing the two counter-clockwise motors',
    explanation:'Unbalancing the torque between clockwise and counter-clockwise pairs induces yaw rotation.'
  },
  {
    id:'drone-09', gameId:'drone-engineer', gameName:'Drone Engineer',
    area:'real-world', skill:'fpv-systems', ageMin:14, ageMax:17, difficulty:2,
    prompt:'What does "FPV" stand for in drone engineering and racing?',
    options:['First Person View (live camera feed transmitted to goggles or screen)','Fast Propeller Velocity','Flying Power Voltage','Forward Positioning Vector'], answer:'First Person View (live camera feed transmitted to goggles or screen)',
    explanation:'FPV streaming allows pilots to navigate from the aircraft\'s visual perspective.'
  },
  {
    id:'drone-10', gameId:'drone-engineer', gameName:'Drone Engineer',
    area:'attention', skill:'center-of-gravity', ageMin:14, ageMax:17, difficulty:2,
    prompt:'Why must a drone\'s battery be strapped exactly at the center of gravity between all four arms?',
    options:['So each motor lifts an equal share of weight, maximizing stability and flight time','So the battery does not get wet in the rain','Because the battery wire is only 1 inch long','To make the drone look heavier'], answer:'So each motor lifts an equal share of weight, maximizing stability and flight time',
    explanation:'An off-center battery forces some motors to overwork, overheating ESCs and wasting power.'
  },

  /* =========================================================
     7. CAR DESIGNER (10 ITEMS) — Age: 11–17
  ========================================================= */
  {
    id:'cardes-01', gameId:'car-designer', gameName:'Car Designer',
    area:'logic', skill:'crash-safety', ageMin:11, ageMax:17, difficulty:1,
    prompt:'In Car Designer, why are the front and rear of a car designed as "crumple zones" that crush during a collision?',
    options:['To absorb impact energy and slow down deceleration, protecting passengers in the cabin','To make the car cheaper to manufacture','So the car bounces off walls like a rubber ball','Because steel is too soft to stay straight'], answer:'To absorb impact energy and slow down deceleration, protecting passengers in the cabin',
    explanation:'Crumple zones extend the collision time duration, drastically reducing G-forces on occupants.'
  },
  {
    id:'cardes-02', gameId:'car-designer', gameName:'Car Designer',
    area:'numeracy', skill:'drag-coefficient', ageMin:12, ageMax:17, difficulty:2,
    prompt:'What does a lower "Drag Coefficient" (Cd) number mean when testing a new sports car shape in a wind tunnel?',
    options:['The car cuts through air with less resistance, improving top speed and fuel economy','The car is heavier than a truck','The brakes stop the car in zero seconds','The tires are twice as wide as normal'], answer:'The car cuts through air with less resistance, improving top speed and fuel economy',
    explanation:'Aerodynamic drag increases quadratically with speed; low Cd values conserve energy.'
  },
  {
    id:'cardes-03', gameId:'car-designer', gameName:'Car Designer',
    area:'logic', skill:'weight-distribution', ageMin:12, ageMax:17, difficulty:2,
    prompt:'Why do racing engineers aim for a 50/50 front-to-rear weight distribution on a performance car?',
    options:['To ensure all four tires share cornering grip equally without skidding out of turns','So the car can jump over obstacles','To make the steering wheel lighter to carry','So two engines can be installed'], answer:'To ensure all four tires share cornering grip equally without skidding out of turns',
    explanation:'Balanced axle loads prevent premature understeer or oversteer during high-G maneuvers.'
  },
  {
    id:'cardes-04', gameId:'car-designer', gameName:'Car Designer',
    area:'logic', skill:'center-of-gravity', ageMin:11, ageMax:17, difficulty:2,
    prompt:'How does lowering a car\'s Center of Gravity affect its handling on sharp road curves?',
    options:['It reduces body roll and prevents the vehicle from flipping over','It makes the car skid on dry pavement','It stops the headlights from working','It increases the risk of tire punctures'], answer:'It reduces body roll and prevents the vehicle from flipping over',
    explanation:'A low center of gravity keeps the rollover moment short, planting tires firmly.'
  },
  {
    id:'cardes-05', gameId:'car-designer', gameName:'Car Designer',
    area:'real-world', skill:'braking-thermals', ageMin:13, ageMax:17, difficulty:3,
    prompt:'Why are disc brakes with ventilated rotor plates preferred on front wheels over closed drum brakes?',
    options:['Ventilated discs dissipate extreme heat into the air faster, preventing brake fade','Drum brakes are made of glass','Disc brakes never need replacement pads','Disc brakes weigh 500 kilograms less'], answer:'Ventilated discs dissipate extreme heat into the air faster, preventing brake fade',
    explanation:'Brakes convert kinetic energy to thermal energy; ventilation channels prevent friction loss.'
  },
  {
    id:'cardes-06', gameId:'car-designer', gameName:'Car Designer',
    area:'logic', skill:'steering-gears', ageMin:12, ageMax:17, difficulty:2,
    prompt:'What mechanism converts the circular turning motion of a steering wheel into left-and-right wheel turning?',
    options:['The rack and pinion gear assembly','The exhaust manifold','The spark plug ignition cable','The coolant radiator fan'], answer:'The rack and pinion gear assembly',
    explanation:'A pinion gear on the steering column meshes with a linear rack bar to steer tie rods.'
  },
  {
    id:'cardes-07', gameId:'car-designer', gameName:'Car Designer',
    area:'logic', skill:'suspension-design', ageMin:13, ageMax:17, difficulty:3,
    prompt:'What is the mechanical advantage of an "Independent Suspension" system over a solid axle?',
    options:['A bump hitting one wheel does not tilt or disturb the wheel on the opposite side','It eliminates the need for tires completely','It allows the car to drive underwater','It makes the engine twice as loud'], answer:'A bump hitting one wheel does not tilt or disturb the wheel on the opposite side',
    explanation:'Independent control arms allow each wheel to articulate vertically without camber coupling.'
  },
  {
    id:'cardes-08', gameId:'car-designer', gameName:'Car Designer',
    area:'real-world', skill:'engine-cycles', ageMin:14, ageMax:17, difficulty:3,
    prompt:'What are the four strokes of a standard Internal Combustion Engine in correct sequence?',
    options:['Intake, Compression, Power, Exhaust','Start, Stop, Turn, Park','Gas, Air, Spark, Smoke','Push, Pull, Twist, Shake'], answer:'Intake, Compression, Power, Exhaust',
    explanation:'Four-stroke engines draw air/fuel, compress it, ignite it for power, and expel exhaust.'
  },
  {
    id:'cardes-09', gameId:'car-designer', gameName:'Car Designer',
    area:'logic', skill:'ev-regenerative-braking', ageMin:13, ageMax:17, difficulty:3,
    prompt:'How does "Regenerative Braking" work in an Electric Vehicle (EV)?',
    options:['The electric motor runs in reverse as a generator, slowing the car and recharging the battery','The brake pads generate electricity by rubbing tires','A wind turbine pops out of the roof when stopping','The headlights shine backward to push the car'], answer:'The electric motor runs in reverse as a generator, slowing the car and recharging the battery',
    explanation:'Electromagnetic resistance slows the driveshaft while converting momentum back into kWh.'
  },
  {
    id:'cardes-10', gameId:'car-designer', gameName:'Car Designer',
    area:'real-world', skill:'chassis-types', ageMin:12, ageMax:17, difficulty:2,
    prompt:'What is a "Monocoque" (unibody) chassis structure in modern automotive design?',
    options:['A design where the external body shell and internal floor frame are welded into a single cage','A wooden frame with cloth panels attached','An engine bolted directly to rear wheels without doors','A car frame made entirely of rubber tubes'], answer:'A design where the external body shell and internal floor frame are welded into a single cage',
    explanation:'Unibody construction combines structural rigidity with lower overall curb weight.'
  },

  /* =========================================================
     8. PLANE BUILDER (10 ITEMS) — Age: 11–15
  ========================================================= */
  {
    id:'plane-01', gameId:'plane-builder', gameName:'Plane Builder',
    area:'logic', skill:'four-forces', ageMin:11, ageMax:15, difficulty:1,
    prompt:'In Plane Builder, what four aerodynamic forces must be balanced for an airplane to maintain steady flight?',
    options:['Lift, Weight (Gravity), Thrust, and Drag','Speed, Height, Wind, and Rain','Up, Down, Left, and Right','Engine, Wing, Tail, and Wheel'], answer:'Lift, Weight (Gravity), Thrust, and Drag',
    explanation:'Lift opposes Weight vertically, while engine Thrust overcomes aerodynamic Drag horizontally.'
  },
  {
    id:'plane-02', gameId:'plane-builder', gameName:'Plane Builder',
    area:'logic', skill:'airfoil-lift', ageMin:12, ageMax:15, difficulty:2,
    prompt:'Why is the top surface of an airplane wing curved while the bottom surface is relatively flat?',
    options:['Air moves faster over the curve, creating lower air pressure above the wing than below (Bernoulli\'s principle)','To let rain slide off the top faster','Because flat metal cannot fly','To make the wing look like a bird'], answer:'Air moves faster over the curve, creating lower air pressure above the wing than below (Bernoulli\'s principle)',
    explanation:'The pressure differential between upper and lower wing surfaces generates upward lift.'
  },
  {
    id:'plane-03', gameId:'plane-builder', gameName:'Plane Builder',
    area:'logic', skill:'roll-control', ageMin:11, ageMax:15, difficulty:2,
    prompt:'Which hinged control surfaces on the outer trailing edges of the wings bank an aircraft left or right (Roll)?',
    options:['The Ailerons','The Rudder','The Elevators','The Landing Gear'], answer:'The Ailerons',
    explanation:'Ailerons move in opposite directions to increase lift on one wing and decrease it on the other.'
  },
  {
    id:'plane-04', gameId:'plane-builder', gameName:'Plane Builder',
    area:'logic', skill:'pitch-control', ageMin:11, ageMax:15, difficulty:2,
    prompt:'Which control surfaces on the horizontal tail fin tilt the airplane nose up or down (Pitch)?',
    options:['The Elevators','The Ailerons','The Winglets','The Flaps'], answer:'The Elevators',
    explanation:'Deflecting elevators upward pushes the tail down, levering the aircraft nose upward.'
  },
  {
    id:'plane-05', gameId:'plane-builder', gameName:'Plane Builder',
    area:'logic', skill:'yaw-control', ageMin:11, ageMax:15, difficulty:2,
    prompt:'What is the function of the vertical Rudder on the tail of an airplane?',
    options:['To swing the aircraft nose left or right horizontally (Yaw)','To make the plane do a loop in the air','To stop the plane during landing','To store extra aviation fuel'], answer:'To swing the aircraft nose left or right horizontally (Yaw)',
    explanation:'The rudder deflects air sideways around the vertical stabilizer to yaw the fuselage.'
  },
  {
    id:'plane-06', gameId:'plane-builder', gameName:'Plane Builder',
    area:'real-world', skill:'jet-engine-cycle', ageMin:13, ageMax:15, difficulty:3,
    prompt:'How does a modern turbofan jet engine generate massive forward thrust?',
    options:['It sucks in air, compresses it, ignites fuel in a combustion chamber, and blasts exhaust out the rear','It flaps its wings up and down 100 times a second','It spins a giant wooden propeller with a rubber band','It drops heavy weights out of the back'], answer:'It sucks in air, compresses it, ignites fuel in a combustion chamber, and blasts exhaust out the rear',
    explanation:'Turbofans operate on the Brayton thermodynamic cycle: Suck, Squeeze, Bang, Blow.'
  },
  {
    id:'plane-07', gameId:'plane-builder', gameName:'Plane Builder',
    area:'logic', skill:'high-lift-devices', ageMin:12, ageMax:15, difficulty:2,
    prompt:'Why do pilots extend wing "Flaps" outward and downward during takeoff and landing?',
    options:['To increase wing surface area and camber, generating extra lift at slow speeds','To make the wings shorter for narrow runways','To clean dust off the tires','Because flaps make the engines turn off'], answer:'To increase wing surface area and camber, generating extra lift at slow speeds',
    explanation:'Flaps allow aircraft to fly safely at lower airspeeds without stalling during approaches.'
  },
  {
    id:'plane-08', gameId:'plane-builder', gameName:'Plane Builder',
    area:'real-world', skill:'fuselage-streamlining', ageMin:11, ageMax:15, difficulty:1,
    prompt:'Why is the main body (fuselage) of a passenger aircraft shaped like a smooth, rounded cylinder?',
    options:['A cylindrical pressure vessel withstands high-altitude cabin pressure while minimizing drag','Because cylinders use zero metal sheets','So passengers can roll around inside','To make the plane float on water forever'], answer:'A cylindrical pressure vessel withstands high-altitude cabin pressure while minimizing drag',
    explanation:'Round hulls distribute internal atmospheric pressure stress uniformly without sharp corners.'
  },
  {
    id:'plane-09', gameId:'plane-builder', gameName:'Plane Builder',
    area:'numeracy', skill:'altimeter-physics', ageMin:12, ageMax:15, difficulty:2,
    prompt:'How does a standard aircraft Altimeter calculate how high the plane is flying above sea level?',
    options:['By measuring outside atmospheric air pressure, which decreases predictably as altitude increases','By dropping a tape measure down to the ground','By counting how many birds fly past the window','By weighing the airplane every second'], answer:'By measuring outside atmospheric air pressure, which decreases predictably as altitude increases',
    explanation:'Aneroid altimeters translate static air pressure variations into calibrated altitude readings.'
  },
  {
    id:'plane-10', gameId:'plane-builder', gameName:'Plane Builder',
    area:'logic', skill:'dihedral-stability', ageMin:13, ageMax:15, difficulty:3,
    prompt:'Why are airplane wings often angled slightly upward from the fuselage toward the tips (Dihedral angle)?',
    options:['To provide natural lateral stability so the plane self-levels if disturbed by turbulence','To prevent the wings from hitting tall buildings','So rain flows into the cabin windows','To make the wings fold up automatically'], answer:'To provide natural lateral stability so the plane self-levels if disturbed by turbulence',
    explanation:'Dihedral angles create a restoring lift differential when an aircraft rolls off-center.'
  },

  /* =========================================================
     9. BIKE BUILDER (10 ITEMS) — Age: 11–17
  ========================================================= */
  {
    id:'bikeb-01', gameId:'bike-builder', gameName:'Bike Builder',
    area:'logic', skill:'hydraulic-brakes', ageMin:13, ageMax:17, difficulty:3,
    prompt:'In Bike Builder, how do hydraulic disc brakes transfer force from the hand lever to the wheel caliper?',
    options:['Non-compressible mineral oil or brake fluid pushes pistons against the brake rotor (Pascal\'s Law)','A steel wire stretches until the wheel stops','Magnets pull the wheel rim backward','Air bubbles blow against the tire surface'], answer:'Non-compressible mineral oil or brake fluid pushes pistons against the brake rotor (Pascal\'s Law)',
    explanation:'Incompressible fluid lines multiply braking force with superior modulation and zero cable stretch.'
  },
  {
    id:'bikeb-02', gameId:'bike-builder', gameName:'Bike Builder',
    area:'logic', skill:'suspension-forks', ageMin:12, ageMax:17, difficulty:2,
    prompt:'What internal components inside a mountain bike suspension fork absorb jump impacts and control bounce?',
    options:['An air or metal coil spring paired with a hydraulic oil damper','Solid wooden sticks inside steel tubes','Empty plastic bottles filled with sand','Magnetic springs that never move'], answer:'An air or metal coil spring paired with a hydraulic oil damper',
    explanation:'Springs absorb impact energy, while viscous oil dampers prevent uncontrolled rebound oscillations.'
  },
  {
    id:'bikeb-03', gameId:'bike-builder', gameName:'Bike Builder',
    area:'attention', skill:'derailleur-indexing', ageMin:11, ageMax:17, difficulty:2,
    prompt:'What happens if the shift cable on a rear derailleur has too much slack tension?',
    options:['The chain hesitates or fails to climb onto larger rear sprockets when shifting','The pedals spin backward automatically','The bicycle tires deflate instantly','The handlebar bell rings nonstop'], answer:'The chain hesitates or fails to climb onto larger rear sprockets when shifting',
    explanation:'Indexed shifters require precise cable tension to move the derailleur cage exact millimeter steps.'
  },
  {
    id:'bikeb-04', gameId:'bike-builder', gameName:'Bike Builder',
    area:'logic', skill:'wheel-truing-mechanics', ageMin:12, ageMax:17, difficulty:3,
    prompt:'If a bicycle rim wobbles to the left during rotation, how does a builder "true" (straighten) the wheel?',
    options:['Tighten spokes pulling to the right hub flange and loosen opposing left spokes','Hit the rim with a heavy iron hammer','Spray water onto the tire tread','Remove three spokes from the wheel'], answer:'Tighten spokes pulling to the right hub flange and loosen opposing left spokes',
    explanation:'Truing balances opposing lateral spoke vectors to align the rim plane concentrically.'
  },
  {
    id:'bikeb-05', gameId:'bike-builder', gameName:'Bike Builder',
    area:'numeracy', skill:'cassette-ratios', ageMin:13, ageMax:17, difficulty:3,
    prompt:'Why do modern adventure bikes use rear cassettes with giant 52-tooth low gears?',
    options:['To provide an ultra-low gear ratio that allows climbing steep gradients while seated','So the bike can ride at 100 km/h on highways','Because 52 teeth make the wheel lighter','To replace the bicycle chain with a belt'], answer:'To provide an ultra-low gear ratio that allows climbing steep gradients while seated',
    explanation:'A cog larger than the front chainring creates a torque-multiplying gear reduction.'
  },
  {
    id:'bikeb-06', gameId:'bike-builder', gameName:'Bike Builder',
    area:'real-world', skill:'carbon-fiber-properties', ageMin:13, ageMax:17, difficulty:2,
    prompt:'Why can a carbon fiber bike frame be engineered to be stiff when pedaling but flexible over road vibrations?',
    options:['Carbon cloth sheets can be layered with specific fiber grain orientations (anisotropic properties)','Carbon fiber turns into rubber when exposed to sunlight','Carbon frames are hollow inside without any walls','Because carbon is heavier than solid iron'], answer:'Carbon cloth sheets can be layered with specific fiber grain orientations (anisotropic properties)',
    explanation:'Composites allow directional stiffness tuning that isotropic metals like aluminum cannot match.'
  },
  {
    id:'bikeb-07', gameId:'bike-builder', gameName:'Bike Builder',
    area:'real-world', skill:'tubeless-tires', ageMin:12, ageMax:17, difficulty:2,
    prompt:'What is the mechanical benefit of "Tubeless" bicycle tire systems filled with liquid sealant?',
    options:['Small thorn punctures seal instantly without flatting, and tires can run lower pressure for grip','Tires never need to be pumped with air again','The bicycle can ride across ocean water','The wheels become impossible to remove'], answer:'Small thorn punctures seal instantly without flatting, and tires can run lower pressure for grip',
    explanation:'Eliminating inner tubes removes pinch-flat risks and allows sealant to clot punctures dynamically.'
  },
  {
    id:'bikeb-08', gameId:'bike-builder', gameName:'Bike Builder',
    area:'logic', skill:'bottom-bracket-physics', ageMin:13, ageMax:17, difficulty:3,
    prompt:'What is the function of the "Bottom Bracket" assembly on a bicycle frame?',
    options:['It houses the axle bearings that allow the pedal crank spindle to rotate inside the frame shell','It holds the rear brake caliper in place','It connects the saddle seatpost to the frame','It measures how fast the bicycle is traveling'], answer:'It houses the axle bearings that allow the pedal crank spindle to rotate inside the frame shell',
    explanation:'The bottom bracket supports high rider pedaling torque while isolating rotational bearings.'
  },
  {
    id:'bikeb-09', gameId:'bike-builder', gameName:'Bike Builder',
    area:'attention', skill:'chain-wear', ageMin:12, ageMax:17, difficulty:2,
    prompt:'What actually happens when a bicycle mechanic says a chain has "stretched" from heavy use?',
    options:['The internal steel pins and roller bushings have worn down, increasing pitch distance between links','The metal link plates have grown 5 inches longer','The chain has melted from sun heat','The chain has turned into stainless aluminum'], answer:'The internal steel pins and roller bushings have worn down, increasing pitch distance between links',
    explanation:'Chains do not stretch physically; abrasive wear on joint pins elongates effective link spacing.'
  },
  {
    id:'bikeb-10', gameId:'bike-builder', gameName:'Bike Builder',
    area:'real-world', skill:'aerodynamic-tuck', ageMin:11, ageMax:17, difficulty:1,
    prompt:'Why do road cyclists crouch low over drop handlebars during high-speed downhill descents?',
    options:['To reduce frontal surface area and minimize aerodynamic wind drag','To look closer at the front tire tread','Because handlebars cannot be reached while sitting upright','To stop the bicycle brakes from cooling down'], answer:'To reduce frontal surface area and minimize aerodynamic wind drag',
    explanation:'The human body accounts for 70-80% of total bicycle wind drag; crouching cuts drag profile.'
  },

  /* =========================================================
     10. KNOW GOOGLE LAB (10 ITEMS) — Age: 11–15
  ========================================================= */
  {
    id:'google-01', gameId:'know-google-lab', gameName:'Know Google Lab',
    area:'logic', skill:'web-crawlers', ageMin:11, ageMax:15, difficulty:1,
    prompt:'In Know Google Lab, how does a search engine discover billions of new web pages across the internet?',
    options:['Using automated software programs called "Crawlers" or "Spiders" that follow hyperlinks','By asking every person on Earth to mail them paper letters','By randomly guessing website names in a dictionary','By turning off server computers every evening'], answer:'Using automated software programs called "Crawlers" or "Spiders" that follow hyperlinks',
    explanation:'Web crawlers systematically traverse hyperlinks from page to page, reading site structures.'
  },
  {
    id:'google-02', gameId:'know-google-lab', gameName:'Know Google Lab',
    area:'logic', skill:'search-indexing', ageMin:11, ageMax:15, difficulty:2,
    prompt:'Why can Google return search results in 0.2 seconds when searching billions of websites?',
    options:['It searches a pre-built organized Index database, not the live internet in real time','It only checks 5 websites in total','It has a human typing answers inside your screen','It guesses answers without reading anything'], answer:'It searches a pre-built organized Index database, not the live internet in real time',
    explanation:'An inverted index maps keywords to document addresses beforehand, like a giant book glossary.'
  },
  {
    id:'google-03', gameId:'know-google-lab', gameName:'Know Google Lab',
    area:'logic', skill:'pagerank-algorithm', ageMin:13, ageMax:15, difficulty:3,
    prompt:'What was the foundational concept behind Google\'s original "PageRank" ranking algorithm?',
    options:['Pages linked to by many other high-quality websites are considered more important and authoritative','Pages with the brightest yellow background colors rank first','Pages that repeat the word "Google" 10,000 times rank first','Pages written in alphabetical order rank higher'], answer:'Pages linked to by many other high-quality websites are considered more important and authoritative',
    explanation:'PageRank treats hyperlinks as votes of confidence, weighting votes by the linking site\'s authority.'
  },
  {
    id:'google-04', gameId:'know-google-lab', gameName:'Know Google Lab',
    area:'logic', skill:'natural-language-processing', ageMin:12, ageMax:15, difficulty:2,
    prompt:'How do modern search algorithms understand synonyms (like "car" and "automobile") in user queries?',
    options:['Using Natural Language Processing (NLP) models to map words by semantic meaning and intent','By rejecting any word not found in a 1950 dictionary','By searching only the exact letters typed without exception','By translating every query into Latin first'], answer:'Using Natural Language Processing (NLP) models to map words by semantic meaning and intent',
    explanation:'AI vector embeddings group words with similar contextual meanings into shared concept spaces.'
  },
  {
    id:'google-05', gameId:'know-google-lab', gameName:'Know Google Lab',
    area:'real-world', skill:'data-center-infrastructure', ageMin:11, ageMax:15, difficulty:1,
    prompt:'Where does the physical computing hardware live that processes your Google search queries?',
    options:['In massive warehouse data centers filled with thousands of networked server computers','Inside the plastic case of your computer keyboard','On a satellite orbiting around Mars','In a single laptop computer sitting in an office'], answer:'In massive warehouse data centers filled with thousands of networked server computers',
    explanation:'Global data centers consume industrial amounts of power to host cloud processing servers.'
  },
  {
    id:'google-06', gameId:'know-google-lab', gameName:'Know Google Lab',
    area:'logic', skill:'caching-systems', ageMin:12, ageMax:15, difficulty:2,
    prompt:'What is "Caching" in search engine server architecture?',
    options:['Storing copies of frequently requested data in high-speed memory for instant retrieval','Hiding computer wires under the carpet','Deleting old search history every hour','Blocking users who type too fast'], answer:'Storing copies of frequently requested data in high-speed memory for instant retrieval',
    explanation:'Caching serves popular queries from RAM rather than recalculating results from disk drives.'
  },
  {
    id:'google-07', gameId:'know-google-lab', gameName:'Know Google Lab',
    area:'logic', skill:'autocomplete-algorithms', ageMin:11, ageMax:15, difficulty:2,
    prompt:'How does Google Autocomplete predict what you are typing before you finish the word?',
    options:['By analyzing trending search frequency and historical patterns of common user queries','By turning on your computer camera to read your mind','By listing words alphabetically from the letter A','By slowing down your internet connection'], answer:'By analyzing trending search frequency and historical patterns of common user queries',
    explanation:'Statistical language models evaluate prefix probability against billions of daily queries.'
  },
  {
    id:'google-08', gameId:'know-google-lab', gameName:'Know Google Lab',
    area:'real-world', skill:'seo-fundamentals', ageMin:13, ageMax:15, difficulty:2,
    prompt:'What does "SEO" (Search Engine Optimization) mean for a website creator?',
    options:['Structuring site content, speed, and headings so search engines can easily index and rank it','Paying money to delete competing websites from the internet','Making website font sizes 100 pixels tall','Putting hidden white text on a white background'], answer:'Structuring site content, speed, and headings so search engines can easily index and rank it',
    explanation:'SEO aligns technical site architecture and readability with search ranking signals.'
  },
  {
    id:'google-09', gameId:'know-google-lab', gameName:'Know Google Lab',
    area:'logic', skill:'content-filtering', ageMin:12, ageMax:15, difficulty:2,
    prompt:'How do automated SafeSearch algorithms block harmful or malicious websites from results?',
    options:['By checking site URLs against threat databases and analyzing page content for policy violations','By shutting down the entire internet every Sunday','By allowing only websites starting with the letter G','By requiring users to solve math puzzles first'], answer:'By checking site URLs against threat databases and analyzing page content for policy violations',
    explanation:'Automated classifiers identify malware signatures, phishing traps, and adult content patterns.'
  },
  {
    id:'google-10', gameId:'know-google-lab', gameName:'Know Google Lab',
    area:'numeracy', skill:'network-latency', ageMin:13, ageMax:15, difficulty:3,
    prompt:'Why do search engines build fiber-optic undersea cables connecting continents?',
    options:['To transmit data as light pulses across oceans with minimal latency (delay) at the speed of light','To catch deep-sea fish while computers are working','To anchor floating data centers in the middle of the sea','To keep internet wires cool underwater'], answer:'To transmit data as light pulses across oceans with minimal latency (delay) at the speed of light',
    explanation:'Subsea fiber bandwidth carries over 95% of international data traffic across oceans.'
  },
  {
    id:'car-02', gameId:'build-your-car', gameName:'Build Your Car',
    area:'numeracy', skill:'component-function', ageMin:11, ageMax:17, difficulty:1,
    prompt:'A family car must stay cool. Which component helps prevent the engine from overheating?',
    options:['Radiator','Headlight','Steering wheel','Brake pedal'], answer:'Radiator',
    explanation:'The radiator transfers heat from the circulating coolant fluid into the outside air.'
  },
  {
    id:'car-03', gameId:'build-your-car', gameName:'Build Your Car',
    area:'numeracy', skill:'safety-systems', ageMin:11, ageMax:17, difficulty:1,
    prompt:'Which vehicle part is essential when a driver needs to slow down or stop safely?',
    options:['Brakes','Fuel tank','Radiator','Headlights'], answer:'Brakes',
    explanation:'Brakes apply friction to moving rotors or drums, slowing down the wheels safely.'
  },
  {
    id:'car-04', gameId:'build-your-car', gameName:'Build Your Car',
    area:'real-world', skill:'component-function', ageMin:11, ageMax:17, difficulty:1,
    prompt:'What is the primary function of a vehicle fuel tank?',
    options:['Store fuel for the engine','Cool the engine','Turn the wheels','Light the road'], answer:'Store fuel for the engine',
    explanation:'The fuel tank stores liquid or gas fuel that is pumped to the engine as needed.'
  },
  {
    id:'car-05', gameId:'build-your-car', gameName:'Build Your Car',
    area:'real-world', skill:'systems-thinking', ageMin:11, ageMax:17, difficulty:2,
    prompt:'A car has an engine, battery, radiator, wheels, brakes, steering, and suspension. Which statement is best?',
    options:['The systems must work together for a safe, reliable car','Only the engine matters','Wheels can replace brakes','Headlights make the radiator unnecessary'], answer:'The systems must work together for a safe, reliable car',
    explanation:'Automotive engineering relies on interdependent systems where no part works in isolation.'
  },
  {
    id:'car-06', gameId:'build-your-car', gameName:'Build Your Car',
    area:'real-world', skill:'diagnostic-reasoning', ageMin:11, ageMax:17, difficulty:3,
    prompt:'The car battery works, but the engine temperature gauge rapidly rises into the red zone. Which system should be inspected first?',
    options:['The radiator and cooling system','The brake pads','The fuel tank capacity','The headlight wiring'], answer:'The radiator and cooling system',
    explanation:'An overheating engine directly indicates a failure in coolant circulation or radiator heat exchange.'
  },
  {
    id:'car-07', gameId:'build-your-car', gameName:'Build Your Car',
    area:'logic', skill:'aerodynamics', ageMin:12, ageMax:17, difficulty:2,
    prompt:'Why do car designers curve the front body panels of a vehicle instead of leaving them completely flat?',
    options:['To reduce aerodynamic drag and improve fuel efficiency','To make the car heavier','So the battery stays cool','To prevent the steering wheel from turning'], answer:'To reduce aerodynamic drag and improve fuel efficiency',
    explanation:'Smooth, curved shapes allow air to flow around the vehicle with less air resistance.'
  },
  {
    id:'car-08', gameId:'build-your-car', gameName:'Build Your Car',
    area:'logic', skill:'mechanical-systems', ageMin:12, ageMax:17, difficulty:2,
    prompt:'What is the main role of the suspension system (springs and shock absorbers) in a car?',
    options:['To absorb road bumps and keep tires in contact with the ground','To generate electricity for the headlights','To store extra fuel','To stop the car in an emergency'], answer:'To absorb road bumps and keep tires in contact with the ground',
    explanation:'Suspension systems stabilize the chassis and ensure safe tire traction over uneven ground.'
  },
  {
    id:'car-09', gameId:'build-your-car', gameName:'Build Your Car',
    area:'real-world', skill:'electrical-systems', ageMin:13, ageMax:17, difficulty:3,
    prompt:'Which component continuously recharges the car battery while the engine is running?',
    options:['The alternator','The radiator','The exhaust pipe','The brake rotor'], answer:'The alternator',
    explanation:'The alternator converts mechanical energy from the engine into electrical energy to recharge the battery.'
  },
  {
    id:'car-10', gameId:'build-your-car', gameName:'Build Your Car',
    area:'logic', skill:'drivetrain-mechanics', ageMin:14, ageMax:17, difficulty:3,
    prompt:'Why does a car require a "differential" gear system between the drive wheels?',
    options:['To allow the outside wheel to rotate faster than the inside wheel during turns','To make both wheels lock together when parking','To prevent fuel from spilling on curves','To disconnect the brakes on highways'], answer:'To allow the outside wheel to rotate faster than the inside wheel during turns',
    explanation:'During a turn, the outside wheel covers a wider arc and must travel faster than the inside wheel.'
  },

  /* =========================================================
     3. BUILD YOUR BIKE / BUILD CYCLES (10 ITEMS)
     Age: 8–17 | Area: Attention / Logic
  ========================================================= */
  {
    id:'bike-01', gameId:'build-your-bike', gameName:'Build Your Bike',
    area:'attention', skill:'bike-anatomy', ageMin:8, ageMax:17, difficulty:1,
    prompt:'When a rider pushes the pedals, which part normally transfers that motion toward the rear wheel?',
    options:['Chain','Handlebar','Seat','Bell'], answer:'Chain',
    explanation:'The bicycle chain connects the front chainring to the rear cog to transfer pedalling force.'
  },
  {
    id:'bike-02', gameId:'build-your-bike', gameName:'Build Your Bike',
    area:'attention', skill:'component-function', ageMin:8, ageMax:17, difficulty:1,
    prompt:'What is the main purpose of bicycle brakes?',
    options:['To slow down or stop','To store electricity','To make the frame taller','To carry water'], answer:'To slow down or stop',
    explanation:'Brake pads grip the wheel rim or disc rotor to create friction and decelerate the bike.'
  },
  {
    id:'bike-03', gameId:'build-your-bike', gameName:'Build Your Bike',
    area:'attention', skill:'mechanical-reasoning', ageMin:10, ageMax:17, difficulty:2,
    prompt:'Why might a rider change to an easier gear when climbing a steep hill?',
    options:['It reduces the force needed for each pedal turn','It removes the need for wheels','It makes the brakes disappear','It turns the bike into a car'], answer:'It reduces the force needed for each pedal turn',
    explanation:'A low gear ratio requires less leg force per stroke, though pedals turn more times per meter.'
  },
  {
    id:'bike-04', gameId:'build-your-bike', gameName:'Build Your Bike',
    area:'logic', skill:'bike-type-choice', ageMin:9, ageMax:17, difficulty:2,
    prompt:'Which bike type is generally designed with wider, knobby tires for rough trails and uneven ground?',
    options:['Mountain bike','Road bike','BMX only for carrying loads','Electric bike only for water travel'], answer:'Mountain bike',
    explanation:'Mountain bikes use rugged frames and wide tires to maintain grip on dirt and rocks.'
  },
  {
    id:'bike-05', gameId:'build-your-bike', gameName:'Build Your Bike',
    area:'real-world', skill:'repair-safety', ageMin:8, ageMax:17, difficulty:1,
    prompt:'Before riding a repaired bicycle, what is the safest check to perform?',
    options:['Test that brakes and wheels work properly','Remove both pedals','Paint the chain','Hide the helmet'], answer:'Test that brakes and wheels work properly',
    explanation:'Verifying brake responsiveness and wheel alignment prevents accidents before riding.'
  },
  {
    id:'bike-06', gameId:'build-your-bike', gameName:'Build Your Bike',
    area:'logic', skill:'mechanical-efficiency', ageMin:11, ageMax:17, difficulty:3,
    prompt:'Why does pedalling in a high gear on flat ground travel a greater distance per pedal stroke than a low gear?',
    options:['The gear ratio turns the rear wheel more times per crank rotation','The chain becomes physically longer','The tire air pressure automatically increases','The brakes disengage completely'], answer:'The gear ratio turns the rear wheel more times per crank rotation',
    explanation:'A larger front gear combined with a smaller rear cog creates a higher rotational ratio.'
  },
  {
    id:'bike-07', gameId:'build-your-bike', gameName:'Build Your Bike',
    area:'real-world', skill:'friction-management', ageMin:10, ageMax:17, difficulty:2,
    prompt:'Why is oil or grease applied to a bicycle chain?',
    options:['To reduce metal-on-metal friction and prevent rusting','To make the pedals heavier','To make the bicycle stop faster','To change the color of the gears'], answer:'To reduce metal-on-metal friction and prevent rusting',
    explanation:'Lubrication allows chain links to glide smoothly over sprocket teeth without wearing down.'
  },
  {
    id:'bike-08', gameId:'build-your-bike', gameName:'Build Your Bike',
    area:'logic', skill:'tire-physics', ageMin:11, ageMax:17, difficulty:2,
    prompt:'What happens if a bicycle tire is ridden while severely under-inflated?',
    options:['Rolling resistance increases and pedalling feels much harder','The bicycle automatically moves faster','The gears stop shifting','The handlebars lock in place'], answer:'Rolling resistance increases and pedalling feels much harder',
    explanation:'Soft tires flatten against the road, increasing surface area and friction resistance.'
  },
  {
    id:'bike-09', gameId:'build-your-bike', gameName:'Build Your Bike',
    area:'attention', skill:'structural-materials', ageMin:12, ageMax:17, difficulty:3,
    prompt:'Why are modern high-performance bicycle frames often made from aluminium or carbon fiber instead of solid steel?',
    options:['To reduce weight while maintaining structural strength','So the bike can melt in the rain','Because steel cannot be painted','So the tires spin backwards'], answer:'To reduce weight while maintaining structural strength',
    explanation:'Lightweight materials require less human energy to accelerate and climb gradients.'
  },
  {
    id:'bike-10', gameId:'build-your-bike', gameName:'Build Your Bike',
    area:'logic', skill:'mechanical-linkages', ageMin:12, ageMax:17, difficulty:3,
    prompt:'What mechanism guides the chain from one sprocket to another when you change gears on a multi-speed bike?',
    options:['The derailleur','The brake caliper','The handlebar stem','The spoke nipple'], answer:'The derailleur',
    explanation:'The derailleur pushes or pulls the chain laterally so it catches onto a different sized cog.'
  },

  /* =========================================================
     4. DEVANAGARI LEARNING GAME (10 ITEMS)
     Age: 5–17 | Area: Language / Memory
  ========================================================= */
  {
    id:'grammar-01', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'parts-of-speech', ageMin:8, ageMax:12, difficulty:1,
    prompt:'Read the sentence: "The happy dog barked loudly." Which word is the noun?',
    options:['happy','dog','barked','loudly'], answer:'dog',
    explanation:'A noun is a naming word for a person, place, thing, or animal. "Dog" names the animal.'
  },
  {
    id:'grammar-02', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'proper-nouns', ageMin:8, ageMax:12, difficulty:1,
    prompt:'Which of the following words is a Proper Noun and should always be capitalized?',
    options:['mountain','river','himalayas','forest'], answer:'himalayas',
    explanation:'Proper nouns name specific, unique people, places, or things, and must begin with a capital letter.'
  },
  {
    id:'grammar-03', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'plural-nouns', ageMin:8, ageMax:12, difficulty:1,
    prompt:'What is the correct plural form of the word "child"?',
    options:['childs','childrens','children','childes'], answer:'children',
    explanation:'"Child" is an irregular noun that changes its spelling completely to "children" in the plural form.'
  },
  {
    id:'grammar-04', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'possessive-nouns', ageMin:9, ageMax:13, difficulty:2,
    prompt:'How do you correctly write "the toy that belongs to the boy"?',
    options:['the boys toy','the boy\'s toy','the boys\' toy','the boy toy'], answer:'the boy\'s toy',
    explanation:'To show singular possession, add an apostrophe and an "s" (\'s) to the end of the noun.'
  },
  {
    id:'grammar-05', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'abstract-nouns', ageMin:10, ageMax:14, difficulty:3,
    prompt:'Which of the following is an Abstract Noun (something you cannot see, touch, or hold)?',
    options:['book','bravery','bridge','bicycle'], answer:'bravery',
    explanation:'Abstract nouns represent ideas, qualities, or feelings, rather than physical objects.'
  },

  /* --- Pronouns --- */
  {
    id:'grammar-06', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'subject-pronouns', ageMin:8, ageMax:12, difficulty:1,
    prompt:'Which pronoun can correctly replace "Sarah" in the sentence: "Sarah walked to school"?',
    options:['He','They','She','We'], answer:'She',
    explanation:'"She" is the correct singular feminine subject pronoun to replace "Sarah".'
  },
  {
    id:'grammar-07', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'object-pronouns', ageMin:9, ageMax:13, difficulty:2,
    prompt:'Fill in the blank: "Please give the book to ___."',
    options:['I','he','they','him'], answer:'him',
    explanation:'"Him" is an object pronoun used after a verb or preposition, unlike subject pronouns like "he".'
  },
  {
    id:'grammar-08', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'possessive-pronouns', ageMin:9, ageMax:13, difficulty:2,
    prompt:'"This pencil belongs to me. It is ___."',
    options:['my','mine','me','myself'], answer:'mine',
    explanation:'"Mine" is a possessive pronoun that stands alone to show ownership.'
  },
  {
    id:'grammar-09', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'reflexive-pronouns', ageMin:10, ageMax:14, difficulty:3,
    prompt:'Fill in the blank: "I baked this cake all by ___."',
    options:['me','my','myself','mine'], answer:'myself',
    explanation:'Reflexive pronouns (like "myself") are used when the subject and the object of the sentence are the same person.'
  },
  {
    id:'grammar-10', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'indefinite-pronouns', ageMin:10, ageMax:14, difficulty:3,
    prompt:'Which word is an indefinite pronoun in this sentence? "Everyone enjoyed the magic show." ',
    options:['Everyone','enjoyed','magic','show'], answer:'Everyone',
    explanation:'Indefinite pronouns like "everyone", "someone", or "nobody" do not refer to a specific person or thing.'
  },

  /* --- Verbs --- */
  {
    id:'grammar-11', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'action-verbs', ageMin:8, ageMax:12, difficulty:1,
    prompt:'Which word in this sentence is the action verb? "The green frog jumped into the pond."',
    options:['green','frog','jumped','pond'], answer:'jumped',
    explanation:'An action verb expresses a physical or mental action. "Jumped" is what the frog did.'
  },
  {
    id:'grammar-12', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'linking-verbs', ageMin:10, ageMax:14, difficulty:2,
    prompt:'Identify the linking verb in the sentence: "The soup smells delicious." ',
    options:['The','soup','smells','delicious'], answer:'smells',
    explanation:'Linking verbs (like smells, is, feels) connect the subject to a word that describes it, rather than showing an action.'
  },
  {
    id:'grammar-13', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'helping-verbs', ageMin:9, ageMax:13, difficulty:2,
    prompt:'Which word is the helping (auxiliary) verb in the sentence? "They are playing football." ',
    options:['They','are','playing','football'], answer:'are',
    explanation:'Helping verbs (are, is, have, etc.) work with a main verb (playing) to show tense.'
  },
  {
    id:'grammar-14', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'irregular-verbs', ageMin:9, ageMax:13, difficulty:2,
    prompt:'What is the correct past tense of the verb "catch"?',
    options:['catched','caught','catching','cot'], answer:'caught',
    explanation:'"Catch" is an irregular verb, meaning it does not end in "-ed" in the past tense. It becomes "caught".'
  },
  {
    id:'grammar-15', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'subject-verb-agreement', ageMin:9, ageMax:14, difficulty:2,
    prompt:'Choose the correct verb: "The group of students ___ going to the museum."',
    options:['is','are','am','were'], answer:'is',
    explanation:'The subject is "group" (singular collective noun), not "students", so the singular verb "is" is correct.'
  },

  /* --- Verb Tenses --- */
  {
    id:'grammar-16', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'past-tense', ageMin:8, ageMax:12, difficulty:1,
    prompt:'Which sentence is written in the simple past tense?',
    options:['I walk to the park.','I am walking to the park.','I walked to the park.','I will walk to the park.'], answer:'I walked to the park.',
    explanation:'The simple past tense usually ends in "-ed" and describes an action that has already finished.'
  },
  {
    id:'grammar-17', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'present-continuous', ageMin:8, ageMax:13, difficulty:1,
    prompt:'Fill in the blank for Present Continuous tense: "She ___ a book right now."',
    options:['reads','is reading','read','will read'], answer:'is reading',
    explanation:'Present continuous uses "is/am/are + verb-ing" to show an action happening right now.'
  },
  {
    id:'grammar-18', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'future-tense', ageMin:8, ageMax:12, difficulty:1,
    prompt:'How do you change "I play tennis" into the simple future tense?',
    options:['I played tennis.','I playing tennis.','I will play tennis.','I have played tennis.'], answer:'I will play tennis.',
    explanation:'The simple future tense uses the helping verb "will" plus the base verb to describe an action that has not happened yet.'
  },
  {
    id:'grammar-19', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'past-continuous', ageMin:10, ageMax:14, difficulty:3,
    prompt:'Fill in the blank for Past Continuous tense: "They ___ television when the power went out."',
    options:['watch','watched','are watching','were watching'], answer:'were watching',
    explanation:'Past continuous uses "was/were + verb-ing" to describe an ongoing past action interrupted by another event.'
  },
  {
    id:'grammar-20', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'present-perfect', ageMin:11, ageMax:15, difficulty:3,
    prompt:'Which sentence correctly uses the Present Perfect tense?',
    options:['I finish my homework.','I finished my homework yesterday.','I have finished my homework.','I will finish my homework.'], answer:'I have finished my homework.',
    explanation:'Present perfect uses "has/have + past participle" for actions completed at an unspecified time in the past that affect the present.'
  },

  /* --- Adjectives --- */
  {
    id:'grammar-21', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'adjective-identification', ageMin:8, ageMax:12, difficulty:1,
    prompt:'Identify the adjective in the sentence: "He wore a shiny jacket."',
    options:['He','wore','shiny','jacket'], answer:'shiny',
    explanation:'Adjectives are words that describe or modify nouns. "Shiny" describes the jacket.'
  },
  {
    id:'grammar-22', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'comparative-adjectives', ageMin:9, ageMax:13, difficulty:2,
    prompt:'Fill in the blank: "An elephant is ___ than a lion."',
    options:['large','larger','largest','most large'], answer:'larger',
    explanation:'When comparing two things, use the comparative form of the adjective, usually adding "-er".'
  },
  {
    id:'grammar-23', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'superlative-adjectives', ageMin:9, ageMax:13, difficulty:2,
    prompt:'Fill in the blank: "Mount Everest is the ___ mountain in the world."',
    options:['high','higher','highest','most high'], answer:'highest',
    explanation:'When comparing three or more things, use the superlative form, usually adding "-est".'
  },
  {
    id:'grammar-24', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'articles-indefinite', ageMin:8, ageMax:12, difficulty:1,
    prompt:'Choose the correct article: "I eat ___ apple every morning."',
    options:['a','an','the','no article needed'], answer:'an',
    explanation:'Use the article "an" before a singular noun that begins with a vowel sound (a, e, i, o, u).'
  },
  {
    id:'grammar-25', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'articles-definite', ageMin:9, ageMax:13, difficulty:2,
    prompt:'Choose the correct article: "___ sun sets in the west."',
    options:['A','An','The','Some'], answer:'The',
    explanation:'Use the definite article "the" when referring to specific, unique objects like the sun or the moon.'
  },

  /* --- Adverbs --- */
  {
    id:'grammar-26', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'adverb-identification', ageMin:8, ageMax:12, difficulty:1,
    prompt:'Identify the adverb in the sentence: "The turtle walked slowly."',
    options:['The','turtle','walked','slowly'], answer:'slowly',
    explanation:'Adverbs describe verbs, telling how, when, or where an action happens. "Slowly" tells how the turtle walked.'
  },
  {
    id:'grammar-27', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'adverb-of-time', ageMin:9, ageMax:13, difficulty:2,
    prompt:'Which word is an Adverb of Time in the sentence: "We will leave for the trip tomorrow."?',
    options:['We','leave','trip','tomorrow'], answer:'tomorrow',
    explanation:'Adverbs of time tell *when* an action occurs (e.g., today, yesterday, tomorrow, later).'
  },
  {
    id:'grammar-28', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'adverb-of-frequency', ageMin:10, ageMax:14, difficulty:2,
    prompt:'Which word is an Adverb of Frequency in this sentence: "She always brushes her teeth."?',
    options:['She','always','brushes','teeth'], answer:'always',
    explanation:'Adverbs of frequency describe *how often* something happens (e.g., never, sometimes, always).'
  },
  {
    id:'grammar-29', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'adjective-vs-adverb', ageMin:10, ageMax:14, difficulty:3,
    prompt:'Choose the correct word: "The choir sang the song ___."',
    options:['beautiful','beautifully','beauty','more beautiful'], answer:'beautifully',
    explanation:'You need an adverb to describe the verb "sang", so you add "-ly" to the adjective "beautiful".'
  },
  {
    id:'grammar-30', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'irregular-adverbs', ageMin:10, ageMax:15, difficulty:3,
    prompt:'Fill in the blank with the correct adverb: "He did very ___ on his exam."',
    options:['good','goodly','well','best'], answer:'well',
    explanation:'"Good" is an adjective. The irregular adverb form used to describe how he performed the action is "well".'
  },

  /* --- Prepositions --- */
  {
    id:'grammar-31', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'preposition-place', ageMin:8, ageMax:12, difficulty:1,
    prompt:'Identify the preposition of place: "The keys are on the kitchen counter."',
    options:['keys','are','on','counter'], answer:'on',
    explanation:'Prepositions of place (on, in, under) show where something is located.'
  },
  {
    id:'grammar-32', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'preposition-time', ageMin:9, ageMax:13, difficulty:2,
    prompt:'Choose the correct preposition: "My birthday is ___ October."',
    options:['on','in','at','by'], answer:'in',
    explanation:'We use the preposition "in" for months, years, and seasons.'
  },
  {
    id:'grammar-33', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'preposition-time-specific', ageMin:9, ageMax:13, difficulty:2,
    prompt:'Choose the correct preposition: "The meeting starts exactly ___ 9:00 AM."',
    options:['in','on','at','for'], answer:'at',
    explanation:'We use the preposition "at" for specific clock times.'
  },
  {
    id:'grammar-34', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'preposition-movement', ageMin:10, ageMax:14, difficulty:2,
    prompt:'Choose the correct preposition of movement: "The dog ran ___ the bridge to reach the other side."',
    options:['across','in','under','between'], answer:'across',
    explanation:'"Across" shows movement from one side of a surface to the other.'
  },
  {
    id:'grammar-35', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'prepositional-phrase', ageMin:11, ageMax:15, difficulty:3,
    prompt:'Identify the prepositional phrase in the sentence: "The bird flew over the tall trees."',
    options:['The bird','flew over','over the tall trees','the tall trees'], answer:'over the tall trees',
    explanation:'A prepositional phrase starts with a preposition (over) and ends with the object noun (trees).'
  },

  /* --- Conjunctions & Interjections --- */
  {
    id:'grammar-36', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'coordinating-conjunctions', ageMin:8, ageMax:12, difficulty:1,
    prompt:'Choose the correct conjunction: "I wanted to play outside, ___ it started raining."',
    options:['and','so','but','or'], answer:'but',
    explanation:'"But" connects two contrasting ideas (wanting to play vs. it raining).'
  },
  {
    id:'grammar-37', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'coordinating-conjunctions', ageMin:8, ageMax:12, difficulty:1,
    prompt:'Choose the correct conjunction: "Would you like tea ___ coffee?"',
    options:['and','but','so','or'], answer:'or',
    explanation:'"Or" is used to present a choice or alternative between two things.'
  },
  {
    id:'grammar-38', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'subordinating-conjunctions', ageMin:10, ageMax:14, difficulty:3,
    prompt:'Choose the correct conjunction: "___ it was late, he stayed up to finish his project."',
    options:['Because','Although','So','And'], answer:'Although',
    explanation:'"Although" is a subordinating conjunction used to introduce a surprising or contrasting dependent clause.'
  },
  {
    id:'grammar-39', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'correlative-conjunctions', ageMin:11, ageMax:15, difficulty:3,
    prompt:'Fill in the blank to complete the pair: "Neither the teacher ___ the students knew the answer."',
    options:['or','and','nor','but'], answer:'nor',
    explanation:'"Neither" always pairs with the correlative conjunction "nor".'
  },
  {
    id:'grammar-40', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'interjections', ageMin:8, ageMax:13, difficulty:1,
    prompt:'Which word in this sentence is an interjection? "Wow! That was an amazing magic trick."',
    options:['Wow!','That','amazing','trick'], answer:'Wow!',
    explanation:'An interjection is a word or phrase that expresses sudden or strong emotion (Wow, Ouch, Oh).'
  },

  /* --- Punctuation --- */
  {
    id:'grammar-41', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'end-punctuation', ageMin:8, ageMax:12, difficulty:1,
    prompt:'Which punctuation mark belongs at the end of an exclamatory sentence like "Watch out for that car" ?',
    options:['A period (.)','A question mark (?)','An exclamation mark (!)','A comma (,)'], answer:'An exclamation mark (!)',
    explanation:'Exclamatory sentences show strong emotion or urgency and end with an exclamation mark.'
  },
  {
    id:'grammar-42', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'question-marks', ageMin:8, ageMax:12, difficulty:1,
    prompt:'Which punctuation mark is missing? "Where did you put my backpack"',
    options:['Period (.)','Question mark (?)','Exclamation mark (!)','Apostrophe (\')'], answer:'Question mark (?)',
    explanation:'An interrogative sentence asks a direct question and must end with a question mark.'
  },
  {
    id:'grammar-43', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'commas-in-series', ageMin:9, ageMax:13, difficulty:2,
    prompt:'Identify the missing punctuation: "We bought apples bananas, and oranges."',
    options:['A period after apples','A comma after apples','A question mark after bananas','An exclamation mark after oranges'], answer:'A comma after apples',
    explanation:'Commas are used to separate three or more items in a list or series.'
  },
  {
    id:'grammar-44', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'apostrophe-contractions', ageMin:9, ageMax:13, difficulty:2,
    prompt:'Which word correctly uses an apostrophe to form a contraction for "do not"?',
    options:['dont\'','do\'nt','don\'t','dont'], answer:'don\'t',
    explanation:'An apostrophe takes the place of the missing letter "o" when combining "do" and "not".'
  },
  {
    id:'grammar-45', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'quotation-marks', ageMin:10, ageMax:14, difficulty:3,
    prompt:'Which sentence uses quotation marks correctly for dialogue?',
    options:['"I am hungry, she said."','I am hungry, "she said."','"I am hungry," she said.','I am hungry", she said."'], answer:'"I am hungry," she said.',
    explanation:'Quotation marks must surround the exact spoken words, with a comma inside the quotes before the speaker tag.'
  },

  /* --- Sentence Structure & Homophones --- */
  {
    id:'grammar-46', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'sentence-subject', ageMin:9, ageMax:13, difficulty:2,
    prompt:'What is the complete subject in the sentence: "The small brown bird sang a beautiful song."?',
    options:['The small','bird sang','The small brown bird','sang a beautiful song'], answer:'The small brown bird',
    explanation:'The complete subject tells exactly who or what the sentence is about, including its modifiers.'
  },
  {
    id:'grammar-47', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'sentence-predicate', ageMin:9, ageMax:13, difficulty:2,
    prompt:'What is the complete predicate in the sentence: "My older brother painted the fence."?',
    options:['My older brother','painted','the fence','painted the fence'], answer:'painted the fence',
    explanation:'The complete predicate includes the verb and all the words that tell what the subject did.'
  },
  {
    id:'grammar-48', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'sentence-fragments', ageMin:10, ageMax:14, difficulty:3,
    prompt:'Which of the following is a complete sentence and NOT a fragment?',
    options:['Running through the park.','The cat slept on the mat.','Because it was raining outside.','The very tall building.'], answer:'The cat slept on the mat.',
    explanation:'A complete sentence must express a complete thought, containing both a subject (cat) and a predicate (slept).'
  },
  {
    id:'grammar-49', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'sentence-types', ageMin:10, ageMax:14, difficulty:3,
    prompt:'What type of sentence gives a command or request, like "Please close the door."?',
    options:['Declarative','Interrogative','Exclamatory','Imperative'], answer:'Imperative',
    explanation:'Imperative sentences give orders, instructions, or requests, and the subject is usually an implied "You".'
  },
  {
    id:'grammar-50', gameId:'grammar-galaxy', gameName:'Grammar Galaxy',
    area:'language', skill:'homophones', ageMin:9, ageMax:14, difficulty:2,
    prompt:'Choose the correct homophone: "___ going to the cinema tonight."',
    options:['Their','There','They\'re','Them'], answer:'They\'re',
    explanation:'"They\'re" is the contraction for "They are", which is needed to complete the sentence action.'
  }
  /* =========================================================
     5. FOCUS MASTER (10 ITEMS)
     Age: 5–17 | Area: Attention / Focus
  ========================================================= */
  {
    id:'focus-01', gameId:'focus-master', gameName:'Focus Master',
    area:'attention', skill:'target-tracking', ageMin:5, ageMax:17, difficulty:1,
    prompt:'In Focus Master, what is the primary goal when a target appears on the screen?',
    options:['Keep your aim steady on the target until the task completes','Look away from the screen immediately','Click buttons as fast and randomly as possible','Close your eyes and count to ten'], answer:'Keep your aim steady on the target until the task completes',
    explanation:'The game trains visual attention span and steady motor control under pressure.'
  },
  {
    id:'focus-02', gameId:'focus-master', gameName:'Focus Master',
    area:'attention', skill:'impulse-control', ageMin:6, ageMax:17, difficulty:1,
    prompt:'When distracting moving shapes appear around your target in Focus Master, what should you do?',
    options:['Ignore the distractors and maintain focus on the true target','Chase every moving shape around the screen','Stop playing and restart the game','Tap the screen repeatedly with all fingers'], answer:'Ignore the distractors and maintain focus on the true target',
    explanation:'Self-control requires filtering out irrelevant background noise to stay on task.'
  },
  {
    id:'focus-03', gameId:'focus-master', gameName:'Focus Master',
    area:'focus', skill:'pressure-resilience', ageMin:8, ageMax:17, difficulty:2,
    prompt:'Why does Focus Master speed up target movement as your score gets higher?',
    options:['To challenge your ability to stay calm and accurate under pressure','To make the screen look colorful','Because the computer battery is low','To stop you from completing the level'], answer:'To challenge your ability to stay calm and accurate under pressure',
    explanation:'Progressive difficulty builds real-world mental endurance and cognitive resilience.'
  },
  {
    id:'focus-04', gameId:'focus-master', gameName:'Focus Master',
    area:'focus', skill:'reaction-timing', ageMin:8, ageMax:17, difficulty:2,
    prompt:'What happens to your accuracy if you react impulsively without waiting for the signal in Focus Master?',
    options:['You lose precision and register a false attempt','Your score automatically doubles','The game slows down for you','You skip to the final level'], answer:'You lose precision and register a false attempt',
    explanation:'Focus Master rewards deliberate, timed responses rather than premature guesses.'
  },
  {
    id:'focus-05', gameId:'focus-master', gameName:'Focus Master',
    area:'attention', skill:'sustained-attention', ageMin:9, ageMax:17, difficulty:2,
    prompt:'What skill is being developed when you hold your aim steady over an extended 60-second trial?',
    options:['Sustained attention span','Mathematical vocabulary','Handwriting neatness','Musical pitch recognition'], answer:'Sustained attention span',
    explanation:'Sustained attention is the capacity to maintain focus on a single task over time.'
  },
  {
    id:'focus-06', gameId:'focus-master', gameName:'Focus Master',
    area:'focus', skill:'error-recovery', ageMin:10, ageMax:17, difficulty:2,
    prompt:'If you lose your aim momentarily during a high-speed round, what is the best strategy?',
    options:['Breathe, re-center your cursor, and lock back onto the target calmly','Quit the game immediately','Tap the screen everywhere in panic','Turn off the monitor'], answer:'Breathe, re-center your cursor, and lock back onto the target calmly',
    explanation:'Emotional regulation during mistakes prevents compound errors and restores performance.'
  },
  {
    id:'focus-07', gameId:'focus-master', gameName:'Focus Master',
    area:'logic', skill:'mind-body-control', ageMin:11, ageMax:17, difficulty:3,
    prompt:'How does controlled, steady breathing affect physical aiming tasks in Focus Master?',
    options:['It lowers heart rate and reduces involuntary hand tremors','It makes the computer screen brighter','It stops the game timer completely','It makes the target stop moving forever'], answer:'It lowers heart rate and reduces involuntary hand tremors',
    explanation:'Mind-body discipline directly stabilizes motor control during fine-precision tasks.'
  },
  {
    id:'focus-08', gameId:'focus-master', gameName:'Focus Master',
    area:'attention', skill:'selective-attention', ageMin:11, ageMax:17, difficulty:3,
    prompt:'When two targets appear but only the glowing one should be tracked, which cognitive mechanism is active?',
    options:['Selective attention','Auditory memory','Grammatical syntax','Spatial rotation'], answer:'Selective attention',
    explanation:'Selective attention isolates high-priority stimuli while suppressing secondary competitors.'
  },
  {
    id:'focus-09', gameId:'focus-master', gameName:'Focus Master',
    area:'focus', skill:'fatigue-management', ageMin:12, ageMax:17, difficulty:3,
    prompt:'Why is it harder to track targets accurately during the final rounds of a long session?',
    options:['Cognitive fatigue temporarily depletes mental alertness','The computer mouse becomes heavier','The game pixels change shape','Numbers become letters'], answer:'Cognitive fatigue temporarily depletes mental alertness',
    explanation:'The brain consumes glucose and energy during intense focus, requiring endurance training.'
  },
  {
    id:'focus-10', gameId:'focus-master', gameName:'Focus Master',
    area:'real-world', skill:'academic-transfer', ageMin:10, ageMax:17, difficulty:2,
    prompt:'How does mastering impulse control in Focus Master help a student in a real classroom?',
    options:['It helps the student resist distractions and concentrate during exams','It allows the student to read without opening books','It makes pencils write faster automatically','It eliminates the need for homework'], answer:'It helps the student resist distractions and concentrate during exams',
    explanation:'Self-control and attention control directly improve classroom listening and exam focus.'
  },

  /* =========================================================
     6. FIN SMART (10 ITEMS)
     Age: 14–17 | Area: Real-World / Numeracy
  ========================================================= */
  {
    id:'fin-01', gameId:'fin-smart', gameName:'Fin Smart',
    area:'real-world', skill:'financial-basics', ageMin:14, ageMax:17, difficulty:1,
    prompt:'In Fin Smart, what is the fundamental difference between a "Need" and a "Want"?',
    options:['Needs are essential for survival and work; wants are optional desires','Needs are always expensive; wants are always free','Needs are bought with cash; wants are bought with cards','There is no difference between them'], answer:'Needs are essential for survival and work; wants are optional desires',
    explanation:'Prioritizing essential needs over optional wants is the first rule of sound budgeting.'
  },
  {
    id:'fin-02', gameId:'fin-smart', gameName:'Fin Smart',
    area:'numeracy', skill:'budget-allocation', ageMin:14, ageMax:17, difficulty:1,
    prompt:'What is the primary goal of creating a personal monthly budget in Fin Smart?',
    options:['To track income and ensure expenses do not exceed earnings','To spend every single rupee on the first day of the month','To avoid opening a bank account','To borrow as much money as possible'], answer:'To track income and ensure expenses do not exceed earnings',
    explanation:'A budget provides financial clarity and prevents debt accumulation.'
  },
  {
    id:'fin-03', gameId:'fin-smart', gameName:'Fin Smart',
    area:'real-world', skill:'emergency-planning', ageMin:14, ageMax:17, difficulty:2,
    prompt:'Why does Fin Smart recommend keeping an "Emergency Fund" saved separately?',
    options:['To cover unexpected expenses like medical bills without borrowing money','To buy luxury video games on sale','So the bank can charge extra fees','To hide money from your friends'], answer:'To cover unexpected expenses like medical bills without borrowing money',
    explanation:'An emergency fund creates a financial safety net for unforeseen life events.'
  },
  {
    id:'fin-04', gameId:'fin-smart', gameName:'Fin Smart',
    area:'numeracy', skill:'compound-growth', ageMin:14, ageMax:17, difficulty:2,
    prompt:'How does "Compound Interest" help your savings grow faster over long periods?',
    options:['You earn interest both on your original savings and on the interest already added','The bank doubles your money every week automatically','You never have to pay taxes on anything you buy','It makes the prices of goods drop to zero'], answer:'You earn interest both on your original savings and on the interest already added',
    explanation:'Compound interest accelerates wealth building by accumulating returns on previous returns.'
  },
  {
    id:'fin-05', gameId:'fin-smart', gameName:'Fin Smart',
    area:'logic', skill:'opportunity-cost', ageMin:14, ageMax:17, difficulty:2,
    prompt:'If you choose to spend Rs. 1,000 on concert tickets today instead of saving it, what is the "Opportunity Cost"?',
    options:['The future growth and security that Rs. 1,000 could have provided if saved','The ticket paper color','The time spent traveling to the concert','The music played at the show'], answer:'The future growth and security that Rs. 1,000 could have provided if saved',
    explanation:'Opportunity cost is the loss of potential gain from other alternatives when one choice is made.'
  },
  {
    id:'fin-06', gameId:'fin-smart', gameName:'Fin Smart',
    area:'numeracy', skill:'inflation-awareness', ageMin:15, ageMax:17, difficulty:3,
    prompt:'What is "Inflation" and how does it affect money stored as idle cash in a drawer over 10 years?',
    options:['Inflation is rising prices; it reduces the purchasing power of idle cash over time','Inflation makes cash increase in physical size','Inflation means goods become cheaper every year','Inflation only affects gold coins'], answer:'Inflation is rising prices; it reduces the purchasing power of idle cash over time',
    explanation:'As general prices rise, the exact same amount of cash buys fewer goods and services.'
  },
  {
    id:'fin-07', gameId:'fin-smart', gameName:'Fin Smart',
    area:'real-world', skill:'credit-management', ageMin:15, ageMax:17, difficulty:3,
    prompt:'What happens if you pay only the "Minimum Due" on a credit card bill every month?',
    options:['High interest charges accumulate on the remaining balance, increasing total debt','The bank cancels your debt as a reward','Your purchases become free after six months','Your credit score instantly reaches maximum'], answer:'High interest charges accumulate on the remaining balance, increasing total debt',
    explanation:'Paying only minimum balances triggers compounding interest on unpaid principal.'
  },
  {
    id:'fin-08', gameId:'fin-smart', gameName:'Fin Smart',
    area:'logic', skill:'risk-diversification', ageMin:15, ageMax:17, difficulty:3,
    prompt:'Why is "Diversification" (spreading money across different investments) considered a smart strategy?',
    options:['It reduces risk because a loss in one area can be balanced by gains in another','It guarantees you will become a billionaire in one day','It eliminates the need to track your budget','It allows you to spend money without limits'], answer:'It reduces risk because a loss in one area can be balanced by gains in another',
    explanation:'Not putting all eggs in one basket protects total wealth against isolated market drops.'
  },
  {
    id:'fin-09', gameId:'fin-smart', gameName:'Fin Smart',
    area:'real-world', skill:'scam-vigilance', ageMin:14, ageMax:17, difficulty:2,
    prompt:'In Fin Smart, what should you do if an online message promises "Guaranteed double return in 24 hours"?',
    options:['Recognize it as a financial scam and never share bank details or money','Send all your savings immediately','Share the message with all your classmates','Click the link and enter your passwords'], answer:'Recognize it as a financial scam and never share bank details or money',
    explanation:'Real financial growth takes time; promises of risk-free overnight doubling are fraudulent.'
  },
  {
    id:'fin-10', gameId:'fin-smart', gameName:'Fin Smart',
    area:'numeracy', skill:'goal-setting', ageMin:14, ageMax:17, difficulty:2,
    prompt:'If a student wants to buy a Rs. 6,000 educational course in 6 months, what is the required monthly savings goal?',
    options:['Rs. 1,000 per month','Rs. 500 per month','Rs. 6,000 per month','Rs. 100 per month'], answer:'Rs. 1,000 per month',
    explanation:'Dividing the total cost (6,000) by the target time period (6 months) equals Rs. 1,000 monthly.'
  },

  /* =========================================================
     7. ELECTRICITY & MATERIALS (10 ITEMS)
     Age: 11–13 | Area: Logic / Real-World
  ========================================================= */
  {
    id:'elec-01', gameId:'electricity-materials', gameName:'Electricity & Materials',
    area:'logic', skill:'material-conductivity', ageMin:11, ageMax:13, difficulty:1,
    prompt:'Why does electricity flow easily through a copper wire but not through a rubber glove?',
    options:['Copper is an electrical conductor; rubber is an electrical insulator','Copper is lighter than rubber','Rubber is too cold to carry electricity','Copper absorbs water from the air'], answer:'Copper is an electrical conductor; rubber is an electrical insulator',
    explanation:'Conductors have free electrons that allow electrical current to pass smoothly.'
  },
  {
    id:'elec-02', gameId:'electricity-materials', gameName:'Electricity & Materials',
    area:'real-world', skill:'electrical-safety', ageMin:11, ageMax:13, difficulty:1,
    prompt:'Why are household electrical wires coated in a layer of coloured plastic or rubber?',
    options:['To protect people from electric shocks and prevent short circuits','To make the wires look pretty inside walls','So the electricity travels faster','To keep the wires from making noise'], answer:'To protect people from electric shocks and prevent short circuits',
    explanation:'Insulating outer sheaths contain the current safely inside the conductive metal core.'
  },
  {
    id:'elec-03', gameId:'electricity-materials', gameName:'Electricity & Materials',
    area:'logic', skill:'circuit-continuity', ageMin:11, ageMax:13, difficulty:1,
    prompt:'What is required for a bulb to light up when connected to a battery?',
    options:['A complete, unbroken closed circuit path from battery to bulb and back','An open circuit with a broken wire','Only a single wire connected to one side of the battery','A glass cup placed next to the bulb'], answer:'A complete, unbroken closed circuit path from battery to bulb and back',
    explanation:'Electric current only flows continuously around a complete closed loop.'
  },
  {
    id:'elec-04', gameId:'electricity-materials', gameName:'Electricity & Materials',
    area:'logic', skill:'switch-mechanisms', ageMin:11, ageMax:13, difficulty:2,
    prompt:'What happens inside a circuit when you turn a wall switch to the "OFF" position?',
    options:['The switch creates a physical gap, opening the circuit so current stops flowing','The switch absorbs all the remaining electricity','The battery reverses its direction','The bulb melts'], answer:'The switch creates a physical gap, opening the circuit so current stops flowing',
    explanation:'An OFF switch breaks the conductive loop, halting electrical movement instantly.'
  },
  {
    id:'elec-05', gameId:'electricity-materials', gameName:'Electricity & Materials',
    area:'numeracy', skill:'electrical-resistance', ageMin:11, ageMax:13, difficulty:2,
    prompt:'What property of a material describes how strongly it opposes the flow of electric current?',
    options:['Electrical resistance','Electrical gravity','Electrical brightness','Electrical weight'], answer:'Electrical resistance',
    explanation:'Resistance is measured in Ohms and determines how easily current passes through an object.'
  },
  {
    id:'elec-06', gameId:'electricity-materials', gameName:'Electricity & Materials',
    area:'logic', skill:'short-circuits', ageMin:12, ageMax:13, difficulty:2,
    prompt:'What danger occurs during a "short circuit" when bare wires touch without passing through a bulb or appliance?',
    options:['Current flows with very low resistance, causing intense heat and fire risk','The electricity turns into solid ice','The battery recharges instantly','The wires become invisible'], answer:'Current flows with very low resistance, causing intense heat and fire risk',
    explanation:'Without a load to convert energy, short circuits draw massive current and overheat dangerously.'
  },
  {
    id:'elec-07', gameId:'electricity-materials', gameName:'Electricity & Materials',
    area:'real-world', skill:'energy-efficiency', ageMin:12, ageMax:13, difficulty:2,
    prompt:'Why are LED bulbs considered more energy-efficient than old incandescent filament bulbs?',
    options:['LEDs convert more electrical energy into light and waste much less heat','LEDs use wood instead of electricity','LEDs do not require any wires to operate','LEDs only turn on during the daytime'], answer:'LEDs convert more electrical energy into light and waste much less heat',
    explanation:'Incandescent filament bulbs waste nearly 90% of their electrical energy as unwanted heat.'
  },
  {
    id:'elec-08', gameId:'electricity-materials', gameName:'Electricity & Materials',
    area:'logic', skill:'voltage-vs-current', ageMin:12, ageMax:13, difficulty:3,
    prompt:'In a water pipe analogy of electricity, if electrical current is the amount of flowing water, what represents "Voltage"?',
    options:['The water pressure pushing the water through the pipe','The color of the water','The taste of the water','The length of the pipe'], answer:'The water pressure pushing the water through the pipe',
    explanation:'Voltage is the electrical pressure or potential difference driving electrons through a circuit.'
  },
  {
    id:'elec-09', gameId:'electricity-materials', gameName:'Electricity & Materials',
    area:'logic', skill:'static-electricity', ageMin:11, ageMax:13, difficulty:2,
    prompt:'What causes a balloon to stick to a wall after being rubbed against wool hair?',
    options:['Static electricity caused by the transfer of electric charges','Magnetic iron inside the balloon','Glue released by the wool','Air pressure from the room fan'], answer:'Static electricity caused by the transfer of electric charges',
    explanation:'Friction transfers electrons, creating an electrostatic attraction between opposite charges.'
  },
  {
    id:'elec-10', gameId:'electricity-materials', gameName:'Electricity & Materials',
    area:'real-world', skill:'safety-devices', ageMin:12, ageMax:13, difficulty:3,
    prompt:'What is the function of a household electrical Fuse or Circuit Breaker?',
    options:['To automatically break the circuit if the current flow becomes dangerously high','To make household electricity free of cost','To store extra electricity for rainy days','To turn on the television remotely'], answer:'To automatically break the circuit if the current flow becomes dangerously high',
    explanation:'Fuses and breakers protect wiring installations by cutting power during overload events.'
  },

  /* =========================================================
     8. PLANET GUARDIANS (10 ITEMS)
     Age: 11–13 | Area: Real-World / Systems
  ========================================================= */
  {
    id:'planet-01', gameId:'planet-guardians', gameName:'Planet Guardians',
    area:'real-world', skill:'ecosystem-interdependence', ageMin:11, ageMax:13, difficulty:1,
    prompt:'In Planet Guardians, why does removing a single insect species sometimes harm entire forest birds?',
    options:['Ecosystems are interconnected food webs; birds rely on insects for nutrition','Insects carry umbrellas for birds','Birds only live inside insect nests','Removing insects makes trees grow too short'], answer:'Ecosystems are interconnected food webs; birds rely on insects for nutrition',
    explanation:'Systems thinking reveals how every organism plays a role in food chain stability.'
  },
  {
    id:'planet-02', gameId:'planet-guardians', gameName:'Planet Guardians',
    area:'real-world', skill:'resource-conservation', ageMin:11, ageMax:13, difficulty:1,
    prompt:'Why is solar power classified as a "Renewable" energy source in Planet Guardians?',
    options:['The Sun provides energy continuously without being permanently depleted by use','Solar panels are made of tree leaves','Solar energy only works on Earth and nowhere else','Solar panels can be recycled into food'], answer:'The Sun provides energy continuously without being permanently depleted by use',
    explanation:'Renewable resources naturally replenish faster than human consumption rates.'
  },
  {
    id:'planet-03', gameId:'planet-guardians', gameName:'Planet Guardians',
    area:'logic', skill:'feedback-loops', ageMin:11, ageMax:13, difficulty:2,
    prompt:'What happens in a climate system when melting Arctic ice exposes dark ocean water?',
    options:['Dark water absorbs more solar heat, causing even faster ice melting (feedback loop)','The ocean immediately turns into fresh drinking water','The Earth stops spinning on its axis','Fish stop swimming entirely'], answer:'Dark water absorbs more solar heat, causing even faster ice melting (feedback loop)',
    explanation:'This is a positive feedback loop where an initial change triggers processes that amplify it.'
  },
  {
    id:'planet-04', gameId:'planet-guardians', gameName:'Planet Guardians',
    area:'real-world', skill:'carbon-cycle', ageMin:11, ageMax:13, difficulty:2,
    prompt:'How do living trees act as natural "Carbon Sinks" on Earth?',
    options:['They absorb carbon dioxide from the air during photosynthesis and store it as plant tissue','They blow carbon dioxide into outer space','They convert carbon dioxide into solid gold','They eat carbon rocks from the soil'], answer:'They absorb carbon dioxide from the air during photosynthesis and store it as plant tissue',
    explanation:'Forests help regulate greenhouse gas levels by locking away carbon in biomass.'
  },
  {
    id:'planet-05', gameId:'planet-guardians', gameName:'Planet Guardians',
    area:'logic', skill:'watershed-management', ageMin:11, ageMax:13, difficulty:2,
    prompt:'Why does deforestation on mountain slopes often lead to severe flooding in lowland villages below?',
    options:['Tree roots anchor soil and absorb rainwater; without trees, water rushes downhill rapidly','Trees push rivers backward up the mountain','Villagers use too much tap water','Mountain rocks melt into water'], answer:'Tree roots anchor soil and absorb rainwater; without trees, water rushes downhill rapidly',
    explanation:'Forest watersheds act as natural sponges that regulate runoff speed and prevent erosion.'
  },
  {
    id:'planet-06', gameId:'planet-guardians', gameName:'Planet Guardians',
    area:'real-world', skill:'waste-reduction', ageMin:12, ageMax:13, difficulty:2,
    prompt:'Why is "Reduce" considered more effective than "Recycle" in the waste management hierarchy?',
    options:['Preventing waste from being created uses less energy than reprocessing used materials','Recycling bins take up too much room on streets','Reduced items become invisible','Recycling is illegal in most countries'], answer:'Preventing waste from being created uses less energy than reprocessing used materials',
    explanation:'Source reduction avoids the industrial energy and transport emissions of recycling.'
  },
  {
    id:'planet-07', gameId:'planet-guardians', gameName:'Planet Guardians',
    area:'logic', skill:'biodiversity-resilience', ageMin:12, ageMax:13, difficulty:3,
    prompt:'Why is a forest with 100 different plant species more resilient to plant disease than a farm with only 1 species?',
    options:['High biodiversity ensures some species will naturally resist the disease and survive','Plant diseases only attack farms and never enter forests','Insects protect forests with medicine','100 species grow taller than 1 species'], answer:'High biodiversity ensures some species will naturally resist the disease and survive',
    explanation:'Genetic and species diversity acts as an ecological insurance policy against environmental shocks.'
  },
  {
    id:'planet-08', gameId:'planet-guardians', gameName:'Planet Guardians',
    area:'real-world', skill:'plastic-pollution', ageMin:11, ageMax:13, difficulty:2,
    prompt:'What is a major ecological problem caused by "Microplastics" in ocean water?',
    options:['Marine animals mistake them for food, passing toxins up the marine food chain','They turn the ocean water pink','They make boats sail backwards','They cause ocean water to evaporate instantly'], answer:'Marine animals mistake them for food, passing toxins up the marine food chain',
    explanation:'Microplastics persist indefinitely and bioaccumulate inside marine life and birds.'
  },
  {
    id:'planet-09', gameId:'planet-guardians', gameName:'Planet Guardians',
    area:'logic', skill:'systems-thinking', ageMin:12, ageMax:13, difficulty:3,
    prompt:'In systems thinking, what is an "Unintended Consequence"?',
    options:['An unforeseen result that occurs when an action is taken without considering total system links','A reward given for winning a game','A planned budget expenditure','A broken computer keyboard'], answer:'An unforeseen result that occurs when an action is taken without considering total system links',
    explanation:'Complex systems often respond in surprising ways when isolated variables are altered.'
  },
  {
    id:'planet-10', gameId:'planet-guardians', gameName:'Planet Guardians',
    area:'real-world', skill:'global-citizenship', ageMin:11, ageMax:13, difficulty:2,
    prompt:'How does energy conservation by an individual at home help protect global ecosystems?',
    options:['It reduces demand on power plants, lowering greenhouse emissions and habitat destruction','It makes the Sun burn brighter in the solar system','It stops the wind from blowing outside','It increases the number of cars on highways'], answer:'It reduces demand on power plants, lowering greenhouse emissions and habitat destruction',
    explanation:'Individual conservation choices scale collectively to reduce industrial environmental impact.'
  }

];
