/* ================================================================
   ABILITIES DATA
   Each ability follows a strict schema so level2.js can render
   any module generically. Extend this array to add new abilities.
   ================================================================ */

const ABILITIES = [
  {
    id:"vision",
    icon:"👁️",
    title:"Vision",
    tagline:"Seeing the world in light and color",
    human:{
      parts:["Cornea — bends light entering the eye","Lens — fine-focuses the image","Retina — screen at the back of the eye","Rods — detect light & motion in dim light","Cones — detect color in bright light","Optic nerve — sends signal to brain","Brain (visual cortex) — builds the final picture"],
      limitations:["Cannot see infrared or ultraviolet light","Limited zoom range","Struggles in very low or very bright light","Cannot record what it sees"]
    },
    machine:{
      parts:["Lens — focuses light onto sensor","CMOS/CCD sensor — converts light to electric signal","Image processor (ISP) — cleans & enhances image","Memory — stores photos and video","Display — shows the image","AI processing chip — recognizes objects & faces"],
      limitations:["Needs power to operate","Can be fooled by adversarial patterns","Struggles with glare, fog, and dirty lenses"]
    },
    compare:[
      {aspect:"Zoom / distance viewing", human:"Limited natural zoom", machine:"Optical & digital zoom, telescopic lenses", winner:"machine"},
      {aspect:"Recording memory of a scene", human:"Fades over time", machine:"Perfect digital storage forever", winner:"machine"},
      {aspect:"Night vision", human:"Weak, needs time to adjust", machine:"Infrared / low-light sensors see clearly", winner:"machine"},
      {aspect:"Color richness & context understanding", human:"Extremely rich, contextual, emotional", machine:"Improving fast but still narrower", winner:"human"},
      {aspect:"Microscopic detail", human:"Cannot see cells directly", machine:"Microscope cameras reveal micro-world", winner:"machine"},
      {aspect:"Adapting to totally new scenes", human:"Instant understanding, common sense", machine:"Needs training data first", winner:"human"},
      {aspect:"Continuous 24/7 monitoring", human:"Needs rest and sleep", machine:"Can watch nonstop without fatigue", winner:"machine"},
      {aspect:"Sharing what is seen instantly", human:"Must describe in words", machine:"Instant image/video sharing worldwide", winner:"machine"}
    ],
    extend:["Thermal cameras extend vision into infrared heat detection.","Microscopes extend vision into the microscopic world.","Telescopes extend vision across galaxies.","High-speed cameras freeze motion faster than the eye can perceive.","Drones give a bird's-eye viewpoint humans can't easily reach."],
    engineerImprovements:["Better optics & lens coatings","Semiconductor image sensors (CMOS/CCD)","Digital image processing & noise reduction","AI-based object & face recognition","Optical & electronic image stabilization","Multi-camera systems (wide, tele, depth)","Adaptive exposure algorithms"],
    realWorld:["Smartphone cameras with night mode","Self-driving car vision systems","Medical endoscopy cameras","Satellite earth-observation imaging"],
    funFact:"A modern smartphone camera sensor can have over 100 million tiny light-sensing pixels — more than the number of rods in a human retina in that area!",
    engineerTip:"Building a camera needs optics engineers (lens design), electronics engineers (circuits), semiconductor engineers (the sensor chip), and AI engineers (making sense of pixels) — all working together.",
    minigame:{type:"matching", label:"Match eye parts to camera parts"}
  },
  {
    id:"hearing",
    icon:"👂",
    title:"Hearing",
    tagline:"Turning vibrations in air into sound",
    human:{
      parts:["Outer ear (pinna) — collects sound waves","Ear canal — channels sound to eardrum","Eardrum — vibrates with sound waves","Middle ear bones — amplify vibration","Cochlea — converts vibration to nerve signals","Auditory nerve — carries signal to brain","Brain — interprets pitch, tone, meaning"],
      limitations:["Cannot hear ultrasonic or infrasonic frequencies well","Hearing degrades with age and loud noise","Cannot record sound for later playback"]
    },
    machine:{
      parts:["Microphone diaphragm — captures vibrations","Amplifier — boosts weak signal","Analog-to-digital converter — turns sound into data","Digital signal processor — filters noise","Speech recognition AI — understands words","Memory — stores audio recordings"],
      limitations:["Struggles in very noisy environments","Cannot easily understand emotional tone","Depends on training data for accents"]
    },
    compare:[
      {aspect:"Frequency range", human:"~20 Hz to 20,000 Hz", machine:"Can capture from near 0 Hz to ultrasonic ranges", winner:"machine"},
      {aspect:"Recording & replay", human:"Only memory, not exact replay", machine:"Perfect digital recording & replay", winner:"machine"},
      {aspect:"Understanding emotion in voice", human:"Very good, intuitive", machine:"Improving but still limited", winner:"human"},
      {aspect:"Filtering one voice from noisy crowd", human:"Good with attention (cocktail party effect)", machine:"Needs advanced noise-cancelling AI", winner:"human"},
      {aspect:"Detecting ultrasonic sound", human:"Cannot hear at all", machine:"Ultrasonic sensors detect it easily", winner:"machine"}
    ],
    extend:["Ultrasonic sensors extend hearing beyond 20kHz for object detection.","Hydrophones let machines 'hear' underwater.","Seismic sensors detect vibrations humans can't feel as sound."],
    engineerImprovements:["Sensitive microphone diaphragms","Digital signal processing (DSP) chips","Noise-cancellation algorithms","Speech-to-text AI models","Beamforming with multiple microphones"],
    realWorld:["Smart speakers like voice assistants","Hearing aids with noise filtering","Sonar systems in submarines","Bat-inspired ultrasonic sensors in cars"],
    funFact:"Some smart speakers use an array of 6-7 microphones to pinpoint exactly which direction your voice is coming from — like having many ears at once!",
    engineerTip:"Microphones need acoustics engineers, electronics engineers for amplification, and AI/software engineers for speech recognition.",
    minigame:{type:"drag-drop", label:"Build a hearing system by ordering the signal path"}
  },
  {
    id:"speech",
    icon:"🗣️",
    title:"Speech",
    tagline:"Turning thoughts into sound waves",
    human:{
      parts:["Lungs — provide airflow","Vocal cords (larynx) — vibrate to create sound","Throat & mouth — shape the sound","Tongue & lips — form words","Brain (Broca's area) — plans speech"],
      limitations:["Limited to one language pattern learned in childhood without effort","Voice changes with illness or age","Cannot produce sound without air"]
    },
    machine:{
      parts:["Text-to-speech engine — converts text to sound","Speaker/diaphragm — produces vibration in air","Amplifier — boosts volume","Voice synthesis AI — makes natural-sounding voice","Language model — chooses words/grammar"],
      limitations:["Can sound robotic without heavy AI tuning","Cannot easily convey true emotion, only mimic it","Needs power and code to speak at all"]
    },
    compare:[
      {aspect:"Number of languages", human:"Learns a few languages over years", machine:"Can switch between 100+ languages instantly", winner:"machine"},
      {aspect:"Natural emotional expression", human:"Deeply authentic emotional tone", machine:"Can mimic emotion, not truly feel it", winner:"human"},
      {aspect:"Volume control", human:"Limited by lungs", machine:"Can be amplified electronically to any level", winner:"machine"},
      {aspect:"Consistency", human:"Voice changes with mood, tiredness", machine:"Always consistent unless programmed otherwise", winner:"machine"}
    ],
    extend:["Text-to-speech lets machines read any digital text aloud.","Voice cloning AI extends speech to mimic specific voices.","Public address systems extend speech volume across stadiums."],
    engineerImprovements:["Neural text-to-speech models","Better speaker hardware for clarity","Multilingual voice models","Emotion-aware speech synthesis"],
    realWorld:["GPS navigation voice directions","Audiobook narration apps","Assistive speech devices for people who cannot speak","Announcement systems in airports"],
    funFact:"Modern AI voices are trained on thousands of hours of human speech, yet a newborn baby learns to babble with almost no formal training at all.",
    engineerTip:"Speech synthesis needs linguists, audio engineers, and AI engineers working together to sound natural.",
    minigame:{type:"build-system", label:"Build a text-to-speech pipeline"}
  },
  {
    id:"memory",
    icon:"🧠",
    title:"Memory",
    tagline:"Storing and recalling information",
    human:{
      parts:["Sensory memory — brief first impression","Short-term (working) memory — holds info briefly","Long-term memory — hippocampus consolidates memories","Neurons & synapses — store connections","Recall process — retrieves memories, sometimes imperfectly"],
      limitations:["Forgets over time","Memories can be distorted or biased","Limited working memory capacity (~7 items)"]
    },
    machine:{
      parts:["RAM — very fast, temporary storage","Storage drives (SSD/HDD) — permanent storage","Cache — super-fast small memory near processor","Database — organizes stored data","Cloud storage — remote backup"],
      limitations:["Can lose data if hardware is damaged (without backup)","Doesn't 'understand' stored data by default","Storage costs money and physical space"]
    },
    compare:[
      {aspect:"Exact recall accuracy", human:"Often approximate, can distort details", machine:"Perfect bit-for-bit recall", winner:"machine"},
      {aspect:"Associative/emotional memory", human:"Rich, connects memories with feelings", machine:"No true emotional link", winner:"human"},
      {aspect:"Storage capacity", human:"Enormous but selective", machine:"Can add more storage almost infinitely", winner:"machine"},
      {aspect:"Speed of learning a new skill", human:"Learns concepts from very few examples", machine:"Often needs massive datasets", winner:"human"}
    ],
    extend:["Cloud storage extends memory to unlimited remote space.","Databases extend memory into instantly searchable records.","Digital photos/videos extend memory into perfect visual recall."],
    engineerImprovements:["Faster RAM & cache hierarchies","High-density storage (SSD, cloud)","Database indexing for instant search","AI memory/retrieval systems"],
    realWorld:["Photo backup apps","Search engines recalling web pages instantly","Medical record systems","AI chatbots with long conversation memory"],
    funFact:"The human brain has roughly 86 billion neurons, but unlike a hard drive, it doesn't store memories in one fixed place — memories are spread across networks.",
    engineerTip:"Storage engineers, database engineers, and computer architects collaborate to build memory systems.",
    minigame:{type:"find-missing", label:"Find the missing part of the memory hierarchy"}
  },
  {
    id:"thinking",
    icon:"💭",
    title:"Thinking",
    tagline:"Reasoning, planning, and solving problems",
    human:{
      parts:["Prefrontal cortex — planning & reasoning","Working memory — holds ideas while thinking","Neural networks — pattern-based reasoning","Intuition — fast, experience-based judgment"],
      limitations:["Can be biased or emotional","Gets mentally tired","Slower for huge calculations"]
    },
    machine:{
      parts:["CPU — processes logical instructions","Algorithms — step-by-step problem solving rules","AI models — pattern-based reasoning","GPU — parallel processing for complex tasks"],
      limitations:["Lacks true understanding/consciousness","Can make confident but wrong guesses","Needs clear rules or huge data to 'think'"]
    },
    compare:[
      {aspect:"Complex math calculation", human:"Slow, error-prone for big numbers", machine:"Instant, extremely accurate", winner:"machine"},
      {aspect:"Common-sense reasoning", human:"Naturally strong even in new situations", machine:"Still developing, can fail unexpectedly", winner:"human"},
      {aspect:"Multitasking huge parallel problems", human:"Limited parallel processing", machine:"Can run millions of calculations simultaneously", winner:"machine"},
      {aspect:"Creative leaps and ethics", human:"Strong moral & creative reasoning", machine:"Can simulate but lacks true judgment", winner:"human"}
    ],
    extend:["Calculators extend thinking into fast arithmetic.","AI models extend thinking into huge pattern recognition tasks.","Simulation software extends thinking into modeling complex systems."],
    engineerImprovements:["Faster processors (CPU/GPU)","Smarter algorithms","Machine learning & neural networks","Parallel & distributed computing"],
    realWorld:["Chess/Go playing AI","Weather prediction supercomputers","Route optimization in maps apps","Fraud detection systems in banks"],
    funFact:"A calculator can multiply two ten-digit numbers instantly — a task that would take a skilled human minutes with paper and pencil.",
    engineerTip:"Thinking machines need computer scientists, mathematicians, and AI researchers working closely together.",
    minigame:{type:"puzzle", label:"Solve the logic circuit puzzle"}
  },
  {
    id:"decision-making",
    icon:"⚖️",
    title:"Decision Making",
    tagline:"Choosing the best action among options",
    human:{
      parts:["Prefrontal cortex — weighs pros and cons","Amygdala — adds emotional/risk signals","Past experience — informs choices","Values & ethics — guide moral decisions"],
      limitations:["Can be influenced by stress or bias","Decision fatigue after many choices","Emotions can override logic"]
    },
    machine:{
      parts:["Decision trees/algorithms — rule-based choices","Machine learning models — probability-based choices","Sensors — provide real-time data for decisions","Control systems — execute the chosen action"],
      limitations:["Only as good as its training data/rules","Cannot truly weigh ethical dilemmas","Struggles with situations outside its training"]
    },
    compare:[
      {aspect:"Speed under pressure", human:"Can be slow when overwhelmed", machine:"Milliseconds to decide", winner:"machine"},
      {aspect:"Ethical/moral judgment", human:"Strong innate moral sense", machine:"Follows programmed rules only", winner:"human"},
      {aspect:"Consistency across repeated decisions", human:"Can vary with mood", machine:"Always same logic unless changed", winner:"machine"},
      {aspect:"Handling totally new dilemmas", human:"Flexible and adaptive", machine:"May fail outside training scenarios", winner:"human"}
    ],
    extend:["Autopilot systems extend decision-making to flight control.","Recommendation engines extend decision-making to product choices.","Autonomous braking systems extend split-second safety decisions."],
    engineerImprovements:["Better decision algorithms","Real-time sensor fusion","Reinforcement learning","Redundant safety-check systems"],
    realWorld:["Self-driving car braking decisions","Stock trading algorithms","Medical diagnosis support systems","Smart thermostats deciding when to heat/cool"],
    funFact:"An autonomous car can process input from dozens of sensors and make a braking decision in a fraction of the time it takes a human to blink.",
    engineerTip:"Decision systems require control engineers, AI engineers, and safety/reliability engineers.",
    minigame:{type:"scenario", label:"Guess what the machine will decide"}
  },
  {
    id:"learning",
    icon:"📚",
    title:"Learning",
    tagline:"Improving ability through experience",
    human:{
      parts:["Neurons forming new connections (neuroplasticity)","Repetition & practice — strengthens skills","Feedback — corrects mistakes","Curiosity — drives exploration"],
      limitations:["Learning can be slow for complex skills","Forgetting without practice","Influenced by motivation and environment"]
    },
    machine:{
      parts:["Training data — examples to learn from","Machine learning algorithm — finds patterns","Neural network weights — store learned patterns","Feedback loop — adjusts weights to reduce errors"],
      limitations:["Needs large amounts of data","Can learn wrong patterns from biased data","Doesn't 'understand' the way humans do"]
    },
    compare:[
      {aspect:"Learning from very few examples", human:"Can learn a new word from just 1-2 examples", machine:"Often needs thousands of examples", winner:"human"},
      {aspect:"Learning speed on repetitive tasks", human:"Improves gradually over practice", machine:"Can optimize rapidly with enough data", winner:"machine"},
      {aspect:"Transferring knowledge to new domains", human:"Very good at generalizing", machine:"Often struggles outside trained domain", winner:"human"}
    ],
    extend:["Machine learning extends pattern learning to massive datasets.","Simulation training extends learning to dangerous scenarios safely (like flight simulators).","Adaptive learning apps extend personalized teaching to millions of students."],
    engineerImprovements:["Better learning algorithms (deep learning)","More efficient data collection","Transfer learning techniques","Simulation-based training environments"],
    realWorld:["Personalized learning apps (like Medhā Tech's games!)","Recommendation systems that learn your taste","Robots learning to grasp objects through trial and error"],
    funFact:"AlphaGo, an AI, learned to play the board game Go by playing millions of games against itself — far more games than any human could play in a lifetime.",
    engineerTip:"Learning systems are built by data scientists, machine learning engineers, and education/UX designers.",
    minigame:{type:"challenge", label:"Train the mini neural network game"}
  },
  {
    id:"movement",
    icon:"🏃",
    title:"Movement",
    tagline:"Moving the body through space",
    human:{
      parts:["Muscles — generate force","Skeleton — provides structure & leverage","Joints — allow bending & rotation","Cerebellum — coordinates balance & smooth motion","Nerves — carry motor commands"],
      limitations:["Gets tired","Limited speed and strength","Injury risk"]
    },
    machine:{
      parts:["Motors — generate rotational force","Actuators — convert energy to movement","Wheels/legs/tracks — enable locomotion","Gears — adjust speed and torque","Control system — coordinates movement"],
      limitations:["Needs continuous power supply","Can be less adaptable to uneven terrain","Mechanical wear over time"]
    },
    compare:[
      {aspect:"Raw speed", human:"~35-45 km/h maximum (elite sprint)", machine:"Vehicles reach hundreds of km/h", winner:"machine"},
      {aspect:"Adapting to rough uneven terrain", human:"Very adaptable naturally", machine:"Needs advanced legged robots to match", winner:"human"},
      {aspect:"Endurance without rest", human:"Tires after hours", machine:"Can run continuously if powered", winner:"machine"},
      {aspect:"Fine balance recovery", human:"Excellent natural balance reflexes", machine:"Improving with gyroscopic control", winner:"human"}
    ],
    extend:["Vehicles extend movement to speeds humans can't achieve on foot.","Drones extend movement into the air freely.","Robotic legs extend movement to walk on Mars (rovers)."],
    engineerImprovements:["Efficient electric motors","Lightweight materials for structure","Advanced gear systems","Balance control algorithms (like in humanoid robots)"],
    realWorld:["Electric cars and bikes","Legged robots (like robot dogs)","Mars rovers","Drones and quadcopters"],
    funFact:"A cheetah is the fastest land animal, but even it can't match a Formula 1 car, which can reach over 300 km/h using an engine engineered by humans.",
    engineerTip:"Movement systems need mechanical engineers, electrical engineers, and control systems engineers.",
    minigame:{type:"build-system", label:"Assemble a robot's movement system"}
  },
  {
    id:"hands",
    icon:"✋",
    title:"Hands & Manipulation",
    tagline:"Grasping and manipulating objects",
    human:{
      parts:["Fingers — flexible grasping tools","Opposable thumb — enables precision grip","Tendons & muscles — control finger movement","Touch sensors in skin — feedback while gripping"],
      limitations:["Limited strength for heavy lifting","Can get fatigued or injured","Precision reduces with tiny/microscopic objects"]
    },
    machine:{
      parts:["Robotic gripper/end-effector — grasping tool","Servo motors — control finger-like movement","Force sensors — measure grip pressure","Actuators — provide grip strength"],
      limitations:["Often less dexterous than human hands","Expensive to make highly flexible grippers","May need reprogramming for new object shapes"]
    },
    compare:[
      {aspect:"Dexterity for delicate tasks", human:"Extremely dexterous naturally", machine:"Still catching up for very fine tasks", winner:"human"},
      {aspect:"Lifting heavy loads", human:"Limited by muscle strength", machine:"Industrial arms lift tons easily", winner:"machine"},
      {aspect:"Repetitive precision", human:"Fatigues and loses precision over time", machine:"Stays perfectly precise for hours", winner:"machine"}
    ],
    extend:["Robotic arms extend hands to lift tons of weight.","Surgical robots extend hand precision into microsurgery.","Remote manipulators extend hands into hazardous environments."],
    engineerImprovements:["Force-feedback sensors","Flexible soft-robotics grippers","Precision servo motors","AI-guided grasp planning"],
    realWorld:["Industrial assembly line robot arms","Surgical robots like the da Vinci system","Prosthetic robotic hands"],
    funFact:"Some prosthetic robotic hands can now detect pressure and 'feel' objects, sending signals back to the wearer's nerves.",
    engineerTip:"Robotic hands need mechanical engineers, materials scientists, and control engineers working together.",
    minigame:{type:"matching", label:"Match human grip types to robotic grippers"}
  },
  {
    id:"touch",
    icon:"🤚",
    title:"Touch",
    tagline:"Sensing pressure, texture, and temperature",
    human:{
      parts:["Skin receptors — detect pressure, texture, pain","Nerve endings — send touch signals to brain","Somatosensory cortex — interprets touch sensations"],
      limitations:["Sensitivity varies by body part","Can be desensitized by calluses","Limited ability to sense very tiny forces"]
    },
    machine:{
      parts:["Pressure sensors — detect force","Tactile sensor arrays — detect texture patterns","Piezoelectric sensors — convert pressure to signal","Haptic feedback actuators — simulate touch"],
      limitations:["Sensors can be expensive for full-body coverage","May lack the subtlety of human skin","Needs calibration for accuracy"]
    },
    compare:[
      {aspect:"Sensitivity range", human:"Excellent adaptive sensitivity", machine:"Can be engineered to detect forces humans can't feel", winner:"machine"},
      {aspect:"Whole-body natural coverage", human:"Skin covers entire body naturally", machine:"Requires placing many discrete sensors", winner:"human"}
    ],
    extend:["Tactile sensors extend touch into robotic fingertips.","Haptic feedback extends touch into virtual reality experiences.","Pressure-sensitive floors extend 'touch' to detect footsteps for security."],
    engineerImprovements:["Flexible tactile sensor skins","Piezoresistive & capacitive sensors","Haptic feedback technology"],
    realWorld:["Touchscreens on phones","Haptic feedback in game controllers","Robotic skin for humanoid robots"],
    funFact:"Some experimental robotic skins contain thousands of tiny sensors, letting a robot 'feel' a gentle touch almost like human skin does.",
    engineerTip:"Touch sensors require materials engineers and electronics engineers to create flexible, sensitive surfaces.",
    minigame:{type:"guess-component", label:"Guess the touch sensor type"}
  },
  {
    id:"smell",
    icon:"👃",
    title:"Smell",
    tagline:"Detecting chemicals in the air",
    human:{
      parts:["Nasal receptors — detect odor molecules","Olfactory bulb — processes smell signals","Brain (limbic system) — links smell to memory & emotion"],
      limitations:["Can be temporarily lost with cold/illness","Less sensitive than many animals","Fatigues quickly to a constant smell"]
    },
    machine:{
      parts:["Gas sensors (electronic nose) — detect specific chemicals","Chemical sensor arrays — identify complex smells","Signal processor — interprets sensor data"],
      limitations:["Usually built to detect specific chemicals only","Less nuanced than biological smell","Needs regular calibration/replacement"]
    },
    compare:[
      {aspect:"Detecting specific gas concentrations", human:"Cannot measure precisely", machine:"Can detect parts-per-billion accurately", winner:"machine"},
      {aspect:"Emotional/memory connection to smell", human:"Very strong personal associations", machine:"No emotional connection", winner:"human"}
    ],
    extend:["Gas sensors extend smell detection to toxic or explosive gases.","Electronic noses extend smell to detect food spoilage precisely.","Smoke detectors extend 'smell' to sense fire particles."],
    engineerImprovements:["Sensitive gas/chemical sensors","Miniaturized electronic nose devices","AI pattern recognition for smell signatures"],
    realWorld:["Smoke and gas leak detectors","Breathalyzers for alcohol detection","Food industry freshness sensors"],
    funFact:"Electronic noses are used in some airports to detect dangerous chemicals that the human nose could never safely get close enough to smell.",
    engineerTip:"Smell-detecting machines need chemical engineers and electronics engineers to build accurate gas sensors.",
    minigame:{type:"guess-component", label:"Guess which sensor detects which gas"}
  },
  {
    id:"taste",
    icon:"👅",
    title:"Taste",
    tagline:"Detecting flavors in food and drink",
    human:{
      parts:["Taste buds — detect sweet, sour, salty, bitter, umami","Tongue nerves — send taste signals","Brain — combines taste with smell for full flavor"],
      limitations:["Taste sensitivity decreases with age","Easily influenced by smell and appearance","Cannot measure exact chemical composition"]
    },
    machine:{
      parts:["Electronic tongue sensors — detect chemical composition","Ion-selective electrodes — measure specific taste chemicals","Data analysis software — classifies flavor profiles"],
      limitations:["Cannot 'enjoy' or prefer a taste","Limited to trained chemical categories","Expensive and specialized equipment"]
    },
    compare:[
      {aspect:"Precise chemical measurement", human:"Cannot measure exact quantities", machine:"Can quantify exact chemical concentrations", winner:"machine"},
      {aspect:"Enjoyment and preference", human:"Rich subjective experience", machine:"No subjective enjoyment", winner:"human"}
    ],
    extend:["Electronic tongues extend taste detection to quality control in food factories.","Chemical sensors extend taste analysis to water safety testing."],
    engineerImprovements:["Ion-selective electrode sensors","Miniaturized taste-sensing chips","AI-based flavor profiling"],
    realWorld:["Food and beverage quality testing","Water contamination detection","Wine and coffee flavor analysis devices"],
    funFact:"An electronic tongue can detect subtle differences between beverage batches faster and more consistently than a human tasting panel.",
    engineerTip:"Taste-sensing devices need chemical engineers and sensor specialists collaborating with food scientists.",
    minigame:{type:"guess-component", label:"Match taste type to sensor reading"}
  },
  {
    id:"balance",
    icon:"🤸",
    title:"Balance",
    tagline:"Staying upright and stable",
    human:{
      parts:["Inner ear (vestibular system) — senses head motion","Cerebellum — coordinates balance corrections","Eyes — provide visual balance cues","Muscles — make quick postural adjustments"],
      limitations:["Can be disrupted by motion sickness","Balance ability declines with age or injury","Struggles on very unstable surfaces"]
    },
    machine:{
      parts:["Gyroscope — measures rotation","Accelerometer — measures acceleration/tilt","IMU (Inertial Measurement Unit) — combines both","Control algorithm — adjusts motors to stay stable"],
      limitations:["Can drift over time without recalibration","Needs fast processing for real-time balance","Depends on quality of sensors"]
    },
    compare:[
      {aspect:"Recovering from sudden pushes", human:"Excellent instinctive reflexes", machine:"Improving with advanced control loops", winner:"human"},
      {aspect:"Precision on flat controlled surfaces", human:"Very good but can wobble", machine:"Extremely precise (e.g. self-balancing robots)", winner:"machine"}
    ],
    extend:["Gyroscopes extend balance sensing to drones and rockets.","Self-balancing robots extend balance to two-wheeled vehicles like hoverboards.","Stabilization systems extend balance to camera gimbals for smooth video."],
    engineerImprovements:["High-precision gyroscopes and accelerometers","Fast feedback control algorithms","Lightweight balancing mechanisms"],
    realWorld:["Segways and hoverboards","Drone flight stabilization","Camera gimbal stabilizers","Humanoid robot walking systems"],
    funFact:"A drone's flight controller checks its balance sensors hundreds of times per second — far faster than any human reflex.",
    engineerTip:"Balance systems need mechanical engineers, control systems engineers, and sensor specialists.",
    minigame:{type:"simulation", label:"Balance the virtual drone"}
  },
  {
    id:"communication",
    icon:"📡",
    title:"Communication",
    tagline:"Sharing information across distance",
    human:{
      parts:["Speech — verbal communication","Body language & gestures — nonverbal cues","Writing — recorded communication","Facial expressions — emotional signals"],
      limitations:["Limited range (voice doesn't travel far)","Language barriers between people","Can be misunderstood or unclear"]
    },
    machine:{
      parts:["Antenna — sends/receives radio signals","Transmitter/receiver — encodes/decodes signals","Network protocols — organize data transfer","Satellites & towers — relay signals globally"],
      limitations:["Needs infrastructure (towers, satellites)","Can be hacked or intercepted","Signal can be blocked or degraded"]
    },
    compare:[
      {aspect:"Distance of communication", human:"Limited to shouting/writing range without tools", machine:"Instant global communication", winner:"machine"},
      {aspect:"Emotional nuance", human:"Rich tone, expression, empathy", machine:"Text/voice can lose emotional nuance", winner:"human"},
      {aspect:"Speed of information transfer", human:"Limited by speech/writing speed", machine:"Near speed-of-light data transfer", winner:"machine"}
    ],
    extend:["Radio waves extend communication across continents instantly.","Satellites extend communication to remote/rural areas and space.","Internet protocols extend communication to billions of connected devices."],
    engineerImprovements:["Radio frequency (RF) engineering","Satellite communication systems","Fiber optic and 5G networks","Encryption for secure communication"],
    realWorld:["Mobile phone networks","Satellite internet (like Starlink)","Wi-Fi and Bluetooth devices","Space communication with rovers on Mars"],
    funFact:"A radio signal from Mars takes several minutes to reach Earth — communication engineers must design systems that handle this delay smoothly.",
    engineerTip:"Communication systems need RF/telecom engineers, network engineers, and cybersecurity specialists.",
    minigame:{type:"simulation", label:"Route the communication packet across the network"}
  },
  {
    id:"energy",
    icon:"⚡",
    title:"Energy",
    tagline:"Powering the body or the machine",
    human:{
      parts:["Digestive system — breaks down food","Mitochondria — convert food into usable energy (ATP)","Bloodstream — distributes energy/oxygen","Muscles & organs — consume energy to function"],
      limitations:["Needs regular food and water intake","Energy runs low with fatigue/hunger","Cannot store huge reserves of energy"]
    },
    machine:{
      parts:["Battery — stores electrical energy","Power supply/generator — provides electricity","Solar panels — convert sunlight to energy","Circuitry — distributes power to components"],
      limitations:["Batteries degrade over time","Requires charging or fuel refills","Limited energy density compared to some needs"]
    },
    compare:[
      {aspect:"Energy source flexibility", human:"Needs food specifically", machine:"Can use electricity, solar, fuel, etc.", winner:"machine"},
      {aspect:"Self-sustaining energy conversion", human:"Automatic, no manual charging needed", machine:"Needs charging/refueling", winner:"human"},
      {aspect:"Continuous operation duration", human:"Needs sleep and rest", machine:"Can run 24/7 if powered continuously", winner:"machine"}
    ],
    extend:["Solar panels extend energy capture to sunlight conversion.","Batteries extend energy storage into portable, rechargeable form.","Nuclear reactors extend energy production far beyond biological limits."],
    engineerImprovements:["Higher energy-density batteries (Lithium-ion, solid-state)","Efficient solar cells","Power management circuits","Renewable energy generators"],
    realWorld:["Electric vehicle batteries","Solar-powered satellites","Portable power banks","Wind turbines and hydro plants"],
    funFact:"A single modern lithium-ion battery cell went through decades of chemical engineering to become safe, light, and powerful enough for phones and cars.",
    engineerTip:"Energy systems need chemical engineers (batteries), electrical engineers (circuits), and renewable energy engineers.",
    minigame:{type:"simulation", label:"Charge the battery correctly"}
  },
  {
    id:"protection",
    icon:"🛡️",
    title:"Protection",
    tagline:"Defending against harm and damage",
    human:{
      parts:["Skin — barrier against germs and injury","Immune system — fights infections","Bones — protect vital organs","Pain receptors — warn of danger"],
      limitations:["Can be overwhelmed by severe injury/illness","Healing takes time","Limited protection against extreme forces"]
    },
    machine:{
      parts:["Casing/shielding — protects internal components","Firewalls — protect against cyber threats","Sensors/alarms — detect intrusion or danger","Redundant systems — backup if one part fails"],
      limitations:["Physical shielding adds weight/cost","Cybersecurity threats constantly evolve","Cannot 'heal' itself without repair"]
    },
    compare:[
      {aspect:"Self-healing ability", human:"Naturally heals cuts, bruises over time", machine:"Cannot self-repair without engineers/replacement parts", winner:"human"},
      {aspect:"Protection against extreme heat/radiation", human:"Very limited tolerance", machine:"Special materials can withstand extreme conditions", winner:"machine"},
      {aspect:"Cybersecurity threats", human:"Not applicable biologically", machine:"Constant risk requiring active defense", winner:"human"}
    ],
    extend:["Heat shields extend protection to spacecraft re-entry temperatures.","Firewalls extend protection into digital cybersecurity.","Bulletproof materials extend protection beyond human skin's limits."],
    engineerImprovements:["Advanced protective materials (Kevlar, ceramics)","Cybersecurity encryption and firewalls","Redundant safety systems","Heat-resistant coatings"],
    realWorld:["Spacecraft heat shields","Bulletproof vests","Firewall & antivirus software","Airbags in cars"],
    funFact:"A spacecraft's heat shield must survive temperatures hotter than lava during re-entry — engineered by materials scientists over decades.",
    engineerTip:"Protection systems need materials engineers, cybersecurity experts, and safety engineers.",
    minigame:{type:"puzzle", label:"Choose the right shielding material"}
  },
  {
    id:"temperature-sensing",
    icon:"🌡️",
    title:"Temperature Sensing",
    tagline:"Detecting heat and cold",
    human:{
      parts:["Skin thermoreceptors — detect hot/cold","Hypothalamus — regulates body temperature","Sweat glands — cool the body down","Shivering muscles — generate heat when cold"],
      limitations:["Cannot measure exact temperature numerically","Sensitivity varies across the body","Can be dangerously fooled (numbness)"]
    },
    machine:{
      parts:["Thermistor/thermocouple — measures precise temperature","Infrared sensor — detects heat remotely","Digital display — shows exact reading","Cooling/heating control system — regulates temperature automatically"],
      limitations:["Sensor needs calibration for accuracy","Can fail in extreme conditions without proper design","Limited to the range it's built for"]
    },
    compare:[
      {aspect:"Precision of measurement", human:"Cannot give exact numbers", machine:"Can measure to a fraction of a degree", winner:"machine"},
      {aspect:"Remote temperature sensing", human:"Cannot sense temperature at a distance", machine:"Infrared thermometers measure from afar", winner:"machine"},
      {aspect:"Natural instinctive response", human:"Automatic sweating/shivering", machine:"Needs a control system to react", winner:"human"}
    ],
    extend:["Infrared thermometers extend temperature sensing to contactless measurement.","Thermal cameras extend temperature sensing into full visual heat-maps.","Weather satellites extend temperature sensing to global climate monitoring."],
    engineerImprovements:["Precise thermocouples and thermistors","Infrared sensor technology","Automated climate control systems","Thermal imaging cameras"],
    realWorld:["Digital thermometers","Smart home thermostats","Fever-screening cameras at airports","Industrial furnace temperature control"],
    funFact:"Thermal cameras can spot a fever in a crowd of people by detecting body heat differences invisible to the naked eye.",
    engineerTip:"Temperature sensing tech needs materials engineers (sensor design) and control engineers (automatic regulation).",
    minigame:{type:"guess-component", label:"Guess the right temperature sensor"}
  },
  {
    id:"navigation",
    icon:"🧭",
    title:"Navigation",
    tagline:"Knowing where you are and finding your way",
    human:{
      parts:["Spatial memory (hippocampus) — remembers routes","Eyes — recognize landmarks","Inner ear — sense of direction and motion","Sun/stars — natural navigation cues (historically)"],
      limitations:["Can get lost in unfamiliar areas","Limited to remembered or visible landmarks","No precise coordinate sense"]
    },
    machine:{
      parts:["GPS receiver — calculates exact location from satellites","Digital maps — show routes and terrain","Compass sensor (magnetometer) — detects direction","Route-planning algorithm — finds optimal path"],
      limitations:["GPS can lose signal indoors or in tunnels","Needs satellite/network connectivity","Maps must be kept up to date"]
    },
    compare:[
      {aspect:"Precise location accuracy", human:"Rough estimate based on landmarks", machine:"Accurate to a few meters via GPS", winner:"machine"},
      {aspect:"Navigating without any devices/signal", human:"Can use memory, sun, stars", machine:"Struggles without satellite signal", winner:"human"},
      {aspect:"Route optimization for traffic", human:"Limited real-time traffic awareness", machine:"Calculates fastest route using live data", winner:"machine"}
    ],
    extend:["GPS extends navigation to precise global positioning.","Digital maps extend navigation with real-time traffic data.","Satellite navigation extends wayfinding to ships, planes, and rovers on Mars."],
    engineerImprovements:["Satellite positioning systems (GPS/GNSS)","Digital mapping and geospatial engineering","Real-time traffic data algorithms","Inertial navigation for GPS-denied areas"],
    realWorld:["Smartphone maps apps","Airplane autopilot navigation","Ship and drone GPS tracking","Mars rover path planning"],
    funFact:"GPS satellites carry atomic clocks accurate to within nanoseconds — even tiny timing errors would throw off your location by kilometers.",
    engineerTip:"Navigation systems need aerospace engineers, geospatial engineers, and software engineers.",
    minigame:{type:"simulation", label:"Plan the shortest route on the map"}
  },
  {
    id:"emotion-recognition",
    icon:"😊",
    title:"Emotion Recognition",
    tagline:"Understanding feelings in ourselves and others",
    human:{
      parts:["Amygdala — processes emotional signals","Facial expression reading — instinctive social skill","Empathy circuits in brain — feel with others","Tone of voice interpretation — social cue reading"],
      limitations:["Can misread emotions, especially across cultures","Personal bias can affect judgment","Emotional fatigue affects accuracy"]
    },
    machine:{
      parts:["Facial recognition camera — captures expressions","Emotion-detection AI — classifies facial patterns","Voice tone analysis software — detects vocal emotion cues","Sentiment analysis (for text) — detects emotion in writing"],
      limitations:["Cannot truly 'feel' emotions, only detect patterns","Can misclassify emotions across cultures/contexts","Raises important privacy considerations"]
    },
    compare:[
      {aspect:"True empathy and shared feeling", human:"Genuine emotional connection", machine:"Detects patterns, no real feeling", winner:"human"},
      {aspect:"Consistency in reading facial micro-expressions", human:"Can miss subtle cues", machine:"Can be trained to detect tiny facial changes", winner:"machine"},
      {aspect:"Cultural context understanding", human:"Naturally attuned within own culture", machine:"Needs diverse training data, can misfire", winner:"human"}
    ],
    extend:["Emotion-AI extends recognition to analyzing thousands of faces in real time (careful ethical use needed).","Voice sentiment analysis extends emotion detection to customer service calls.","Wearable sensors extend emotion tracking to physiological signals like heart rate."],
    engineerImprovements:["Facial expression recognition AI","Voice sentiment analysis algorithms","Physiological sensor integration (heart rate, skin response)","Careful, ethical dataset design to reduce bias"],
    realWorld:["Customer service sentiment analysis tools","Mental health monitoring apps","Driver drowsiness/emotion detection in cars"],
    funFact:"Emotion-recognition AI must be trained very carefully and ethically, since misreading emotions can lead to unfair or biased outcomes — this is an active area of important engineering research.",
    engineerTip:"This technology needs psychologists, AI ethicists, and computer vision engineers working together responsibly.",
    minigame:{type:"guess-component", label:"Guess the emotion from the expression"}
  },
  {
    id:"creativity",
    icon:"🎨",
    title:"Creativity",
    tagline:"Generating new ideas, art, and solutions",
    human:{
      parts:["Imagination — mental simulation of new ideas","Divergent thinking — generating many possible solutions","Emotional experience — fuels artistic expression","Cultural context — shapes creative expression"],
      limitations:["Creativity can be blocked by stress or fear","Limited by personal experience and knowledge","Inconsistent — creative output varies day to day"]
    },
    machine:{
      parts:["Generative AI models — create images, text, music","Pattern combination algorithms — remix learned patterns","Randomization techniques — introduce novel variation","Training data — the 'inspiration' source for AI"],
      limitations:["Only recombines patterns learned from training data","Lacks genuine lived experience or intention","Raises questions about originality and authorship"]
    },
    compare:[
      {aspect:"Original lived-experience inspiration", human:"Draws from genuine life experiences and emotions", machine:"Recombines patterns from training data", winner:"human"},
      {aspect:"Speed of generating many variations", human:"Slower, limited by time and effort", machine:"Can generate hundreds of variations quickly", winner:"machine"},
      {aspect:"Intentional meaning behind the work", human:"Carries genuine purpose and message", machine:"No true intention, only statistical patterns", winner:"human"}
    ],
    extend:["Generative AI extends creative production to rapid brainstorming and drafts.","Computer-aided design (CAD) extends creativity to precise engineering drawings.","Music composition software extends creativity into new sound experimentation."],
    engineerImprovements:["Generative AI models (careful, ethical design)","Creative software tools (design, music, writing aids)","Human-AI collaborative creative workflows"],
    realWorld:["AI-assisted art and music tools","Game design software","Architectural design tools","Medhā Tech's own game design process!"],
    funFact:"Even the most advanced creative AI still needs a human to set the goal, choose the best output, and add genuine meaning — creativity engineering is about assisting, not replacing, human imagination.",
    engineerTip:"Creative AI tools need machine learning engineers, artists, and ethicists collaborating to keep tools helpful and fair.",
    minigame:{type:"challenge", label:"Remix the pattern like a creative AI"}
  },
  {
    id:"pattern-recognition",
    icon:"🔍",
    title:"Pattern Recognition",
    tagline:"Spotting repeated structures and trends",
    human:{
      parts:["Visual cortex — spots visual patterns quickly","Brain's pattern-matching networks — link new info to known patterns","Intuition — recognizes patterns without conscious effort"],
      limitations:["Can see false patterns that aren't really there","Limited by attention and memory","Slower for huge datasets"]
    },
    machine:{
      parts:["Machine learning models — detect statistical patterns","Neural networks — recognize complex visual/data patterns","Big data processing — analyzes massive pattern sets"],
      limitations:["Can find spurious correlations without true meaning","Needs large, clean datasets","Can be fooled by adversarial patterns"]
    },
    compare:[
      {aspect:"Recognizing familiar faces instantly", human:"Extremely fast and natural", machine:"Needs training but can match/exceed human accuracy", winner:"both"},
      {aspect:"Finding patterns across millions of data points", human:"Nearly impossible manually", machine:"Can analyze huge datasets in seconds", winner:"machine"}
    ],
    extend:["Machine learning extends pattern recognition to fraud detection in banking.","Medical imaging AI extends pattern spotting to detect diseases in scans.","Weather models extend pattern recognition to predict storms."],
    engineerImprovements:["Deep learning neural networks","Big data infrastructure","Statistical anomaly detection algorithms"],
    realWorld:["Credit card fraud detection","Medical scan disease detection AI","Spam email filters"],
    funFact:"A well-trained AI model can review medical scans from thousands of patients and spot subtle disease patterns faster than a team of doctors reviewing manually — though doctors still make the final call.",
    engineerTip:"Pattern recognition systems are built by data scientists, statisticians, and domain experts together.",
    minigame:{type:"puzzle", label:"Spot the pattern challenge"}
  },
  {
    id:"speed",
    icon:"🚀",
    title:"Speed",
    tagline:"How fast can it act or move",
    human:{
      parts:["Reaction time (~200ms average)","Muscle contraction speed","Nerve signal transmission speed"],
      limitations:["Reaction time limited by biology","Fatigue reduces speed over time"]
    },
    machine:{
      parts:["Processor clock speed — billions of cycles per second","Motor RPM — rotations per minute","Data transmission speed — near speed of light"],
      limitations:["High speed can generate heat needing cooling","Mechanical speed limited by material strength"]
    },
    compare:[
      {aspect:"Reaction time", human:"~200 milliseconds", machine:"Microseconds or less", winner:"machine"},
      {aspect:"Physical top speed", human:"~45 km/h sprinting", machine:"Vehicles/rockets: hundreds to thousands km/h", winner:"machine"}
    ],
    extend:["High-speed cameras extend perception of events faster than the eye can see.","Processors extend calculation speed to billions of operations per second.","Rockets extend travel speed to escape Earth's gravity."],
    engineerImprovements:["Faster processors and clock speeds","High-RPM motor design","Fiber-optic/electronic signal transmission"],
    realWorld:["High-speed trains","Rocket launches","Gigahertz computer processors"],
    funFact:"A modern CPU can perform billions of calculations every single second — faster than you can even finish reading this sentence.",
    engineerTip:"Speed engineering spans mechanical, electrical, and computer engineers depending on the system.",
    minigame:{type:"challenge", label:"Race reaction-time mini game"}
  },
  {
    id:"accuracy",
    icon:"🎯",
    title:"Accuracy",
    tagline:"How precise and error-free an action is",
    human:{
      parts:["Fine motor control — steady hands for precision tasks","Visual feedback — corrects aim in real time","Practice — improves precision over time"],
      limitations:["Hand tremors and fatigue reduce precision","Precision varies between individuals"]
    },
    machine:{
      parts:["Precision sensors — measure tiny deviations","Closed-loop control systems — self-correct errors","CNC/robotic actuators — execute precise movements"],
      limitations:["Requires careful calibration","Mechanical wear can reduce precision over time"]
    },
    compare:[
      {aspect:"Repeated precision over thousands of tries", human:"Precision drops with fatigue", machine:"Stays consistently precise", winner:"machine"},
      {aspect:"Adaptive precision in unpredictable tasks", human:"Very adaptable", machine:"Needs reprogramming for new tasks", winner:"human"}
    ],
    extend:["CNC machines extend precision to micron-level manufacturing.","Surgical robots extend precision beyond human hand-tremor limits.","GPS extends location accuracy to within meters."],
    engineerImprovements:["Precision sensors and encoders","Closed-loop feedback control","High-tolerance manufacturing (CNC machining)"],
    realWorld:["3D printers","Surgical precision robots","Satellite positioning systems"],
    funFact:"Some industrial robots can repeat the same movement with an accuracy of a fraction of a millimeter, millions of times in a row.",
    engineerTip:"Precision engineering relies on mechanical engineers, metrology experts, and control systems engineers.",
    minigame:{type:"challenge", label:"Precision aiming mini game"}
  },
  {
    id:"storage",
    icon:"💾",
    title:"Storage",
    tagline:"Holding information for later use",
    human:{
      parts:["Long-term memory in the brain","Written notes (external aid)","Photographs (external aid)"],
      limitations:["Biological memory fades and distorts","Limited natural capacity"]
    },
    machine:{
      parts:["Hard drives / SSDs — store data magnetically or electronically","Cloud servers — remote large-scale storage","Memory cards — portable storage"],
      limitations:["Physical media can fail or degrade","Requires backups for safety"]
    },
    compare:[
      {aspect:"Capacity", human:"Enormous but selective/lossy", machine:"Can scale to petabytes", winner:"machine"},
      {aspect:"Perfect fidelity of stored info", human:"Memories can distort over time", machine:"Bit-perfect storage retrieval", winner:"machine"}
    ],
    extend:["Cloud storage extends memory to global, always-available data.","Digital archives extend storage to preserve history for centuries.","Databases extend storage to instantly searchable records."],
    engineerImprovements:["High-density storage media","Cloud data centers","Data compression algorithms","Redundant backup systems (RAID)"],
    realWorld:["Cloud photo/video backup","Company databases","Digital libraries and archives"],
    funFact:"A single modern data center can store more information than all the books ever written by humanity, combined.",
    engineerTip:"Storage systems need computer engineers, database architects, and data center engineers.",
    minigame:{type:"find-missing", label:"Find the missing piece of the storage hierarchy"}
  },
  {
    id:"attention",
    icon:"🎯",
    title:"Attention",
    tagline:"Focusing on what matters most",
    human:{
      parts:["Selective attention — filters out distractions","Prefrontal cortex — sustains focus","Reticular activating system — controls alertness"],
      limitations:["Attention span is limited","Easily distracted by novel stimuli","Multitasking reduces performance"]
    },
    machine:{
      parts:["Attention mechanisms in AI models — weigh important data","Sensor prioritization algorithms — focus processing power","Alert/filtering systems — flag important signals"],
      limitations:["Needs careful design to focus on the 'right' things","Can be tricked by irrelevant but flashy data"]
    },
    compare:[
      {aspect:"Sustained focus over long periods", human:"Attention drifts over time", machine:"Can maintain constant monitoring", winner:"machine"},
      {aspect:"Flexibly shifting focus for context", human:"Very good at contextual judgment", machine:"Needs explicit programming/training for context", winner:"human"}
    ],
    extend:["AI attention mechanisms extend focus to relevant words in a sentence (used in translation apps).","Surveillance systems extend attention to monitor many camera feeds at once.","Alert systems extend attention to flag rare critical events in huge data streams."],
    engineerImprovements:["Attention-based AI models (like in translation & chatbots)","Sensor fusion prioritization","Smart alert filtering systems"],
    realWorld:["AI translation tools focusing on key words","Security systems monitoring multiple cameras","Anomaly alert systems in factories"],
    funFact:"The 'attention mechanism' in modern AI language models was directly inspired by trying to mimic how humans focus on relevant words while ignoring others.",
    engineerTip:"Attention systems need AI researchers and systems engineers to balance focus and coverage.",
    minigame:{type:"challenge", label:"Spot the important signal game"}
  },
  {
    id:"reaction",
    icon:"⚡",
    title:"Reaction",
    tagline:"Responding quickly to sudden events",
    human:{
      parts:["Reflex arc — fast automatic nerve response","Sensory neurons — detect stimulus","Motor neurons — trigger quick muscle response"],
      limitations:["Reflexes still take ~100-200ms","Can be slowed by fatigue or distraction"]
    },
    machine:{
      parts:["Sensors — instantly detect a trigger event","Control circuits — process signal quickly","Actuators — respond within milliseconds"],
      limitations:["Depends on sensor and processor speed","Needs fail-safe design for critical reactions"]
    },
    compare:[
      {aspect:"Response time to danger", human:"~150-300ms typical reflex", machine:"Can react in microseconds", winner:"machine"},
      {aspect:"Contextual judgment during reaction", human:"Can adapt reaction based on context instantly", machine:"Reacts based on programmed rules only", winner:"human"}
    ],
    extend:["Airbag sensors extend reaction speed to save lives in milliseconds.","Automatic braking systems extend reaction beyond human reflex limits.","Circuit breakers extend reaction to prevent electrical fires instantly."],
    engineerImprovements:["Fast-response sensors","Low-latency control circuits","Redundant safety-critical systems"],
    realWorld:["Car airbags and automatic braking","Industrial machine emergency stops","Circuit breakers in electrical systems"],
    funFact:"A car's airbag sensor can detect a crash and deploy the airbag in about 30 milliseconds — roughly 10 times faster than a human blink.",
    engineerTip:"Reaction systems need safety engineers, electronics engineers, and control systems designers.",
    minigame:{type:"challenge", label:"Beat the machine's reaction time"}
  },
  {
    id:"coordination",
    icon:"🤹",
    title:"Coordination",
    tagline:"Making multiple body parts work together smoothly",
    human:{
      parts:["Cerebellum — coordinates multi-muscle movement","Motor cortex — plans coordinated actions","Proprioception — sense of body position"],
      limitations:["Coordination skill takes years of practice","Can be disrupted by injury or fatigue"]
    },
    machine:{
      parts:["Multi-axis control systems — coordinate several motors","Synchronization algorithms — time actions precisely","Central controller (like a robot's 'brain') — manages all parts together"],
      limitations:["Complex coordination needs advanced programming","Mechanical linkages can introduce timing errors"]
    },
    compare:[
      {aspect:"Complex whole-body coordination (e.g. dance, sports)", human:"Extremely fluid and adaptive", machine:"Improving but often more rigid", winner:"human"},
      {aspect:"Coordinating hundreds of components simultaneously", human:"Limited to own body", machine:"Can coordinate factory-wide robotic systems", winner:"machine"}
    ],
    extend:["Robotic arms extend coordination to synchronized multi-arm assembly lines.","Drone swarms extend coordination to dozens of aircraft moving together.","Orchestral synchronization software extends coordination to musical timing."],
    engineerImprovements:["Multi-axis motor controllers","Real-time synchronization protocols","Centralized robotic control systems"],
    realWorld:["Robotic assembly lines","Drone swarm light shows","Multi-jointed humanoid robots"],
    funFact:"A drone swarm show can synchronize hundreds of drones to move in perfect formation — coordination that would be impossible for any single human to direct manually in real time.",
    engineerTip:"Coordination engineering needs robotics engineers, control systems engineers, and software engineers.",
    minigame:{type:"simulation", label:"Coordinate the drone swarm formation"}
  }
];

if (typeof module !== "undefined") { module.exports = ABILITIES; }
