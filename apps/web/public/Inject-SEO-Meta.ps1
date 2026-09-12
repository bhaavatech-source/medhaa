# Medhaa SEO Meta Tag Injector
# Run this from: E:\medhaa\apps\web\public
# Usage: powershell -ExecutionPolicy Bypass -File Inject-SEO-Meta.ps1

$root = "."
$games = @(
    @{
        Path = 'games-static\focus-under-distraction.html'
        Title = "Focus Master – Cognitive Focus Game for Kids | Medhaa"
        Desc = "A wave of look-alike shapes and colours floods the screen alongside one true target; tap only the real target and ignore... Free game for ages 12-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/focus-under-distraction.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Focus Master", "description": "A wave of look-alike shapes and colours floods the screen alongside one true target; tap only the real target and ignore everything else, rewarding calm, selective attention.", "url": "https://medhaa.net/games-static/focus-under-distraction.html", "learningResourceType": "Educational Game", "teaches": ["Selective Attention", "Self-Control", "Distraction Resistance"], "typicalAgeRange": "12-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\iq-test-level-3.html'
        Title = "IQ Test – Cognitive Logic Game for Kids | Medhaa"
        Desc = "The hardest tier in the IQ suite: a senior-level, timed set of reasoning puzzles spanning verbal, numerical, and spatial logic. Free game for ages 12-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/iq-test-level-3.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "IQ Test", "description": "The hardest tier in the IQ suite: a senior-level, timed set of reasoning puzzles spanning verbal, numerical, and spatial logic.", "url": "https://medhaa.net/games-static/iq-test-level-3.html", "learningResourceType": "Educational Game", "teaches": ["Logical Reasoning", "Mixed Cognitive Domains", "Self-Awareness"], "typicalAgeRange": "12-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\dharana-arena.html'
        Title = "Dharana Arena – Cognitive Focus Game for Kids | Medhaa"
        Desc = "A holistic attention trainer starting with guided breathing, then real focus challenges under time pressure. Free game for ages 5-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/dharana-arena.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Dharana Arena", "description": "A holistic attention trainer starting with guided breathing, then real focus challenges under time pressure.", "url": "https://medhaa.net/games-static/dharana-arena.html", "learningResourceType": "Educational Game", "teaches": ["Sustained Attention", "Reading Comprehension", "Mindfulness"], "typicalAgeRange": "5-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\bhava-math-grid.html'
        Title = "Apt Number – Cognitive Math Game for Kids | Medhaa"
        Desc = "A grid-based number puzzle where you fill in digits so every row and column adds up to its target total. Free game for ages 11-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/bhava-math-grid.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Apt Number", "description": "A grid-based number puzzle where you fill in digits so every row and column adds up to its target total.", "url": "https://medhaa.net/games-static/bhava-math-grid.html", "learningResourceType": "Educational Game", "teaches": ["Numerical Reasoning", "Logical Deduction", "Working Memory"], "typicalAgeRange": "11-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\focus-flash\index.html'
        Title = "Focus Flash – Cognitive Focus Game for Kids | Medhaa"
        Desc = "A shape appears and you must tap it before it vanishes, but only when it matches the current rule. Free game for ages 5-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/focus-flash/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Focus Flash", "description": "A shape appears and you must tap it before it vanishes, but only when it matches the current rule.", "url": "https://medhaa.net/games-static/focus-flash/index.html", "learningResourceType": "Educational Game", "teaches": ["Attention Span", "Reaction Speed", "Impulse Control"], "typicalAgeRange": "5-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\neuroflash-memory.html'
        Title = "Flash Memory – Cognitive Memory Game for Kids | Medhaa"
        Desc = "Watch a sequence of flashes or symbols, then reproduce it in exact order using the on-screen grid. Free game for ages 7-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/neuroflash-memory.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Flash Memory", "description": "Watch a sequence of flashes or symbols, then reproduce it in exact order using the on-screen grid.", "url": "https://medhaa.net/games-static/neuroflash-memory.html", "learningResourceType": "Educational Game", "teaches": ["Working Memory Span", "Sequential Recall", "Auditory-Visual Integration"], "typicalAgeRange": "7-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\bhava-smriti\index.html'
        Title = "Bhava-smriti – Cognitive Memory Game for Kids | Medhaa"
        Desc = "A classic card-flip memory match game: tap two cards to reveal them, remember what you saw, and find every matching pair. Free game for ages 5-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/bhava-smriti/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Bhava-smriti", "description": "A classic card-flip memory match game: tap two cards to reveal them, remember what you saw, and find every matching pair.", "url": "https://medhaa.net/games-static/bhava-smriti/index.html", "learningResourceType": "Educational Game", "teaches": ["Visual Memory", "Concentration", "Pattern Recall"], "typicalAgeRange": "5-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\memory-match-puzzle.html'
        Title = "Memory Match Puzzle – Cognitive Memory Game for Kids | Medhaa"
        Desc = "The foundational memory-match experience: flip picture cards two at a time and find every matching pair before time runs out. Free game for ages 5-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/memory-match-puzzle.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Memory Match Puzzle", "description": "The foundational memory-match experience: flip picture cards two at a time and find every matching pair before time runs out.", "url": "https://medhaa.net/games-static/memory-match-puzzle.html", "learningResourceType": "Educational Game", "teaches": ["Visual Memory", "Focus", "Pattern Recognition"], "typicalAgeRange": "5-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\memory-match-ultimate.html'
        Title = "Memory Match Ultimate – Cognitive Memory Game for Kids | Medhaa"
        Desc = "The harder sibling of Memory Match Puzzle with bigger grids, richer themes, and real time pressure. Free game for ages 5-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/memory-match-ultimate.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Memory Match Ultimate", "description": "The harder sibling of Memory Match Puzzle with bigger grids, richer themes, and real time pressure.", "url": "https://medhaa.net/games-static/memory-match-ultimate.html", "learningResourceType": "Educational Game", "teaches": ["Visual Memory", "Speed Under Pressure", "Focus"], "typicalAgeRange": "5-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\memory-zoo-puzzle.html'
        Title = "Memory Zoo Puzzle – Cognitive Memory Game for Kids | Medhaa"
        Desc = "Animals peek out from zoo enclosure doors; tap two doors to see if their animals match, and free every pair. Free game for ages 5-8 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/memory-zoo-puzzle.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Memory Zoo Puzzle", "description": "Animals peek out from zoo enclosure doors; tap two doors to see if their animals match, and free every pair.", "url": "https://medhaa.net/games-static/memory-zoo-puzzle.html", "learningResourceType": "Educational Game", "teaches": ["Working Memory", "Visual Attention", "Object Recognition"], "typicalAgeRange": "5-8", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\mental-rotation-game.html'
        Title = "Mind Rotation – Cognitive Logic Game for Kids | Medhaa"
        Desc = "3D shapes spin on screen; mentally rotate them to decide if two shapes truly match or are mirror images. Free game for ages 12-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/mental-rotation-game.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Mind Rotation", "description": "3D shapes spin on screen; mentally rotate them to decide if two shapes truly match or are mirror images.", "url": "https://medhaa.net/games-static/mental-rotation-game.html", "learningResourceType": "Educational Game", "teaches": ["Spatial Reasoning", "Visualization", "Logical Deduction"], "typicalAgeRange": "12-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\visual-difference-detector.html'
        Title = "Focus Flow – Cognitive Focus Game for Kids | Medhaa"
        Desc = "Two nearly-identical images sit side by side; spot every small difference before time runs out. Free game for ages 5-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/visual-difference-detector.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Focus Flow", "description": "Two nearly-identical images sit side by side; spot every small difference before time runs out.", "url": "https://medhaa.net/games-static/visual-difference-detector.html", "learningResourceType": "Educational Game", "teaches": ["Visual Scanning", "Attention to Detail", "Patience"], "typicalAgeRange": "5-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\bhava-build-device-engineer\index.html'
        Title = "Device Engineer – STEM Engineering Game for Kids | Medhaa"
        Desc = "A genuine engineering simulator where you assemble a smartphone or laptop from real, data-driven components, then test, debug,... Free game for ages 11-18 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/bhava-build-device-engineer/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Device Engineer", "description": "A genuine engineering simulator where you assemble a smartphone or laptop from real, data-driven components, then test, debug, and optimize your build.", "url": "https://medhaa.net/games-static/bhava-build-device-engineer/index.html", "learningResourceType": "Educational Game", "teaches": ["Systems Thinking", "Debugging", "Engineering Trade-offs"], "typicalAgeRange": "11-18", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\secret-of-silicon-game\index.html'
        Title = "Chip Detective – STEM Engineering Game for Kids | Medhaa"
        Desc = "An interactive discovery game that walks you into the microscopic world of a computer chip to see how semiconductors actually... Free game for ages 10-18 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/secret-of-silicon-game/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Chip Detective", "description": "An interactive discovery game that walks you into the microscopic world of a computer chip to see how semiconductors actually work.", "url": "https://medhaa.net/games-static/secret-of-silicon-game/index.html", "learningResourceType": "Educational Game", "teaches": ["Scientific Curiosity", "Analytical Thinking", "Technical Literacy"], "typicalAgeRange": "10-18", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\rocket-build-engineer\index.html'
        Title = "Rocket Engineer – STEM Engineering Game for Kids | Medhaa"
        Desc = "Design a sounding rocket or a full two-stage orbital rocket from real components on a fixed mission budget, then launch and... Free game for ages 14-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/rocket-build-engineer/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Rocket Engineer", "description": "Design a sounding rocket or a full two-stage orbital rocket from real components on a fixed mission budget, then launch and watch real engineering trade-offs decide your fate.", "url": "https://medhaa.net/games-static/rocket-build-engineer/index.html", "learningResourceType": "Educational Game", "teaches": ["Systems Thinking", "Applied Physics", "Budget-Constrained Design"], "typicalAgeRange": "14-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\bhava-space-academy\index.html'
        Title = "Bhava Space Academy – STEM Engineering Game for Kids | Medhaa"
        Desc = "Explore a fully modeled 3D International Space Station module by module, and diagnose real space-station emergencies. Free game for ages 14-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/bhava-space-academy/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Bhava Space Academy", "description": "Explore a fully modeled 3D International Space Station module by module, and diagnose real space-station emergencies.", "url": "https://medhaa.net/games-static/bhava-space-academy/index.html", "learningResourceType": "Educational Game", "teaches": ["Scientific Curiosity", "Systems Diagnosis", "Real-World Engineering Knowledge"], "typicalAgeRange": "14-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\drone-build-engineer\index.html'
        Title = "Drone Engineer – STEM Engineering Game for Kids | Medhaa"
        Desc = "Choose between building an FPV racing drone or a cinematic camera drone from real parts, then run a launch sequence and see... Free game for ages 14-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/drone-build-engineer/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Drone Engineer", "description": "Choose between building an FPV racing drone or a cinematic camera drone from real parts, then run a launch sequence and see whether your build actually flies.", "url": "https://medhaa.net/games-static/drone-build-engineer/index.html", "learningResourceType": "Educational Game", "teaches": ["Engineering Design", "Applied Physics", "Precision Trade-offs"], "typicalAgeRange": "14-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\build-your-car\index.html'
        Title = "Car Designer – STEM Engineering Game for Kids | Medhaa"
        Desc = "Pick a chassis, engine, gearbox, battery, radiator, and fuel tank, each with real cost, weight, reliability, and heat-load... Free game for ages 11-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/build-your-car/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Car Designer", "description": "Pick a chassis, engine, gearbox, battery, radiator, and fuel tank, each with real cost, weight, reliability, and heat-load numbers.", "url": "https://medhaa.net/games-static/build-your-car/index.html", "learningResourceType": "Educational Game", "teaches": ["Engineering Trade-offs", "Budget Management", "Systems Thinking"], "typicalAgeRange": "11-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\plane-builder\index.html'
        Title = "Plane Builder – STEM Engineering Game for Kids | Medhaa"
        Desc = "Assemble an aircraft piece by piece, fuselage, wings, flaps, learning what each part does. Free game for ages 11-15 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/plane-builder/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Plane Builder", "description": "Assemble an aircraft piece by piece, fuselage, wings, flaps, learning what each part does.", "url": "https://medhaa.net/games-static/plane-builder/index.html", "learningResourceType": "Educational Game", "teaches": ["Applied Physics", "Systems Thinking", "Attention to Detail"], "typicalAgeRange": "11-15", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\motorcycle-one-workshop.html'
        Title = "Bike Builder – STEM Engineering Game for Kids | Medhaa"
        Desc = "Explore two full motorcycle builds, a Sport bike and a Scooter, labeling and understanding 18 real parts each. Free game for ages 11-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/motorcycle-one-workshop.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Bike Builder", "description": "Explore two full motorcycle builds, a Sport bike and a Scooter, labeling and understanding 18 real parts each.", "url": "https://medhaa.net/games-static/motorcycle-one-workshop.html", "learningResourceType": "Educational Game", "teaches": ["Mechanical Thinking", "Systems Knowledge", "Attention to Detail"], "typicalAgeRange": "11-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\bhava-tech-build-your-bike\index.html'
        Title = "Build Cycles – STEM Engineering Game for Kids | Medhaa"
        Desc = "Build a bicycle in progressive levels, then face a real diagnostics system and identify the cause and fix. Free game for ages 8-10 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/bhava-tech-build-your-bike/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Build Cycles", "description": "Build a bicycle in progressive levels, then face a real diagnostics system and identify the cause and fix.", "url": "https://medhaa.net/games-static/bhava-tech-build-your-bike/index.html", "learningResourceType": "Educational Game", "teaches": ["Mechanical Thinking", "Diagnostic Reasoning", "Sequencing"], "typicalAgeRange": "8-10", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\nagarikx-enhanced.html'
        Title = "Future Citizen – Civics Life Skills Game for Kids | Medhaa"
        Desc = "A full civic legal awareness suite covering ID documents, age-based rights, digital safety, police FIR procedure, RTI and... Free game for ages 14-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/nagarikx-enhanced.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Future Citizen", "description": "A full civic legal awareness suite covering ID documents, age-based rights, digital safety, police FIR procedure, RTI and consumer rights.", "url": "https://medhaa.net/games-static/nagarikx-enhanced.html", "learningResourceType": "Educational Game", "teaches": ["Civic Sense", "Legal Literacy", "Real-World Decision-Making"], "typicalAgeRange": "14-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\soccomm-enhanced.html'
        Title = "Me and Society – Civics Life Skills Game for Kids | Medhaa"
        Desc = "Navigate branching real-life scenes where every response you choose shifts a visible relationship meter up or down. Free game for ages 11-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/soccomm-enhanced.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Me and Society", "description": "Navigate branching real-life scenes where every response you choose shifts a visible relationship meter up or down.", "url": "https://medhaa.net/games-static/soccomm-enhanced.html", "learningResourceType": "Educational Game", "teaches": ["Social Responsibility", "Communication", "Negotiation"], "typicalAgeRange": "11-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\good-habits.html'
        Title = "Good Habits – Emotional Intelligence Game for Kids | Medhaa"
        Desc = "Quick, playful daily-life scenarios where you pick the smart choice from four options. Free game for ages 5-7 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/good-habits.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Good Habits", "description": "Quick, playful daily-life scenarios where you pick the smart choice from four options.", "url": "https://medhaa.net/games-static/good-habits.html", "learningResourceType": "Educational Game", "teaches": ["Self-Monitoring", "Healthy Habits", "Decision-Making"], "typicalAgeRange": "5-7", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\calm-zone.html'
        Title = "Calm Zone – Emotional Intelligence Game for Kids | Medhaa"
        Desc = "A guided breathing exercise, inhale, hold, exhale, a calm space to reset before an exam or after a stressful moment. Free game for ages 5-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/calm-zone.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Calm Zone", "description": "A guided breathing exercise, inhale, hold, exhale, a calm space to reset before an exam or after a stressful moment.", "url": "https://medhaa.net/games-static/calm-zone.html", "learningResourceType": "Educational Game", "teaches": ["Mindfulness", "Emotional Regulation", "Stress Management"], "typicalAgeRange": "5-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\life-strategist-starter\index.html'
        Title = "Life Strategist – Life Skills Game for Kids | Medhaa"
        Desc = "Work through realistic high-stakes scenarios scored across multiple life dimensions. Free game for ages 14-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/life-strategist-starter/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Life Strategist", "description": "Work through realistic high-stakes scenarios scored across multiple life dimensions.", "url": "https://medhaa.net/games-static/life-strategist-starter/index.html", "learningResourceType": "Educational Game", "teaches": ["Decision-Making", "Long-Term Planning", "Reflective Thinking"], "typicalAgeRange": "14-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\finlife-india-quest-enhanced.html'
        Title = "Fin Smart – Finance Game for Kids | Medhaa"
        Desc = "Work through real Indian financial scenarios like surprise health expenses and the EMI trap. Free game for ages 14-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/finlife-india-quest-enhanced.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Fin Smart", "description": "Work through real Indian financial scenarios like surprise health expenses and the EMI trap.", "url": "https://medhaa.net/games-static/finlife-india-quest-enhanced.html", "learningResourceType": "Educational Game", "teaches": ["Financial Literacy", "Delayed Gratification", "Risk Awareness"], "typicalAgeRange": "14-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\empathy-quest.html'
        Title = "Empathy Quest – Emotional Intelligence Game for Kids | Medhaa"
        Desc = "Look at social clues and work out how a person is most likely feeling, then get an empathy lesson. Free game for ages 8-13 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/empathy-quest.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Empathy Quest", "description": "Look at social clues and work out how a person is most likely feeling, then get an empathy lesson.", "url": "https://medhaa.net/games-static/empathy-quest.html", "learningResourceType": "Educational Game", "teaches": ["Empathy", "Social Awareness", "Emotional Reasoning"], "typicalAgeRange": "8-13", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\empathy-conversation.html'
        Title = "Empathy Conversation – Emotional Intelligence Game for Kids | Medhaa"
        Desc = "Navigate an emotionally real conversation with a hurt friend; good responses repair the relationship. Free game for ages 11-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/empathy-conversation.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Empathy Conversation", "description": "Navigate an emotionally real conversation with a hurt friend; good responses repair the relationship.", "url": "https://medhaa.net/games-static/empathy-conversation.html", "learningResourceType": "Educational Game", "teaches": ["Communication", "Empathy", "Conflict Resolution"], "typicalAgeRange": "11-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\heart-heroes.html'
        Title = "Heart Heroes – Emotional Intelligence Game for Kids | Medhaa"
        Desc = "Four Heart Hero characters represent kindness, courage, honesty, and patience. Free game for ages 5-8 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/heart-heroes.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Heart Heroes", "description": "Four Heart Hero characters represent kindness, courage, honesty, and patience.", "url": "https://medhaa.net/games-static/heart-heroes.html", "learningResourceType": "Educational Game", "teaches": ["Prosocial Behaviour", "Values Education", "Moral Reasoning"], "typicalAgeRange": "5-8", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\ready-for-the-world.html'
        Title = "Ready for the World – Life Skills Game for Kids | Medhaa"
        Desc = "Live through 13 real teen scenarios where every choice shifts your readiness scores. Free game for ages 11-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/ready-for-the-world.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Ready for the World", "description": "Live through 13 real teen scenarios where every choice shifts your readiness scores.", "url": "https://medhaa.net/games-static/ready-for-the-world.html", "learningResourceType": "Educational Game", "teaches": ["Self-Discipline", "Social Etiquette", "Practical Responsibility"], "typicalAgeRange": "11-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\day-hero-game.html'
        Title = "Day Hero – Life Skills Game for Kids | Medhaa"
        Desc = "Plan out a full day as a young hero, juggling time, tasks, and energy. Free game for ages 5-9 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/day-hero-game.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Day Hero", "description": "Plan out a full day as a young hero, juggling time, tasks, and energy.", "url": "https://medhaa.net/games-static/day-hero-game.html", "learningResourceType": "Educational Game", "teaches": ["Time Management", "Prioritization", "Planning"], "typicalAgeRange": "5-9", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\planet-guardians.html'
        Title = "Planet Guardians – Environment Game for Kids | Medhaa"
        Desc = "Take on environmental challenges requiring real scientific reasoning and teamwork. Free game for ages 12-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/planet-guardians.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Planet Guardians", "description": "Take on environmental challenges requiring real scientific reasoning and teamwork.", "url": "https://medhaa.net/games-static/planet-guardians.html", "learningResourceType": "Educational Game", "teaches": ["Scientific Reasoning", "Environmental Awareness", "Collaborative Problem-Solving"], "typicalAgeRange": "12-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\hidden-maths\index.html'
        Title = "Hidden Maths – Maths Science Game for Kids | Medhaa"
        Desc = "A 9-mystery series uncovering real math hiding in everyday things. Free game for ages 14-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/hidden-maths/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Hidden Maths", "description": "A 9-mystery series uncovering real math hiding in everyday things.", "url": "https://medhaa.net/games-static/hidden-maths/index.html", "learningResourceType": "Educational Game", "teaches": ["Observation", "Applied Mathematics", "Pattern Recognition"], "typicalAgeRange": "14-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\intelligent-machines\index.html'
        Title = "Intelligent Machines – Maths Science Game for Kids | Medhaa"
        Desc = "A 4-level progression tracing how simple human decisions evolve into computational thinking. Free game for ages 11-13 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/intelligent-machines/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Intelligent Machines", "description": "A 4-level progression tracing how simple human decisions evolve into computational thinking.", "url": "https://medhaa.net/games-static/intelligent-machines/index.html", "learningResourceType": "Educational Game", "teaches": ["Analytical Thinking", "Logical Sequencing", "Computational Curiosity"], "typicalAgeRange": "11-13", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\know-maths\index.html'
        Title = "Know Maths – Maths Science Game for Kids | Medhaa"
        Desc = "A structured walkthrough of core math concepts explained through interactive visuals. Free game for ages 14-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/know-maths/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Know Maths", "description": "A structured walkthrough of core math concepts explained through interactive visuals.", "url": "https://medhaa.net/games-static/know-maths/index.html", "learningResourceType": "Educational Game", "teaches": ["Attention", "Conceptual Understanding", "Mathematical Reasoning"], "typicalAgeRange": "14-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\number-garden-quest.html'
        Title = "Number Garden – Maths Science Game for Kids | Medhaa"
        Desc = "Grow a garden by watering exactly the right number of plants for each puzzle. Free game for ages 5-8 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/number-garden-quest.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Number Garden", "description": "Grow a garden by watering exactly the right number of plants for each puzzle.", "url": "https://medhaa.net/games-static/number-garden-quest.html", "learningResourceType": "Educational Game", "teaches": ["Number Sense", "Focus", "Early Counting Skills"], "typicalAgeRange": "5-8", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\percentile-game.html'
        Title = "Percentile – Maths Science Game for Kids | Medhaa"
        Desc = "Work with rankings and score comparisons to understand what a percentile actually means. Free game for ages 11-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/percentile-game.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Percentile", "description": "Work with rankings and score comparisons to understand what a percentile actually means.", "url": "https://medhaa.net/games-static/percentile-game.html", "learningResourceType": "Educational Game", "teaches": ["Data Reasoning", "Statistical Thinking", "Comparative Analysis"], "typicalAgeRange": "11-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\brain-of-all-machines\index.html'
        Title = "Brain of All Machines – Maths Science Game for Kids | Medhaa"
        Desc = "Explore the hidden logic circuits inside every machine from a washing machine to a smartphone. Free game for ages 11-13 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/brain-of-all-machines/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Brain of All Machines", "description": "Explore the hidden logic circuits inside every machine from a washing machine to a smartphone.", "url": "https://medhaa.net/games-static/brain-of-all-machines/index.html", "learningResourceType": "Educational Game", "teaches": ["Attention", "Logical Reasoning", "Systems Thinking"], "typicalAgeRange": "11-13", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\hidden-science.html'
        Title = "Hidden Science – Maths Science Game for Kids | Medhaa"
        Desc = "Investigate 20 real science mysteries, feel materials to learn what conducts electricity. Free game for ages 11-15 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/hidden-science.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Hidden Science", "description": "Investigate 20 real science mysteries, feel materials to learn what conducts electricity.", "url": "https://medhaa.net/games-static/hidden-science.html", "learningResourceType": "Educational Game", "teaches": ["Scientific Observation", "Hands-On Reasoning", "Curiosity"], "typicalAgeRange": "11-15", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\math-blitz.html'
        Title = "Math Blitz – Maths Science Game for Kids | Medhaa"
        Desc = "Rapid-fire arithmetic drills that push your mental math speed to the limit. Free game for ages 12-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/math-blitz.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Math Blitz", "description": "Rapid-fire arithmetic drills that push your mental math speed to the limit.", "url": "https://medhaa.net/games-static/math-blitz.html", "learningResourceType": "Educational Game", "teaches": ["Numerical Fluency", "Speed Under Pressure", "Mental Math"], "typicalAgeRange": "12-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\logic-game.html'
        Title = "Logic Game – Cognitive Logic Game for Kids | Medhaa"
        Desc = "Classic deductive-reasoning puzzles: given a set of clues, figure out who sits where. Free game for ages 12-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/logic-game.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Logic Game", "description": "Classic deductive-reasoning puzzles: given a set of clues, figure out who sits where.", "url": "https://medhaa.net/games-static/logic-game.html", "learningResourceType": "Educational Game", "teaches": ["Deductive Reasoning", "Logical Thinking", "Working Memory"], "typicalAgeRange": "12-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\logic-grid-puzzle.html'
        Title = "Logic Grid Puzzle – Cognitive Logic Game for Kids | Medhaa"
        Desc = "Multi-variable logic grids that scale from a manageable 3x3 up to a genuinely challenging 5x5. Free game for ages 12-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/logic-grid-puzzle.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Logic Grid Puzzle", "description": "Multi-variable logic grids that scale from a manageable 3x3 up to a genuinely challenging 5x5.", "url": "https://medhaa.net/games-static/logic-grid-puzzle.html", "learningResourceType": "Educational Game", "teaches": ["Deductive Reasoning", "Systematic Thinking", "Patience"], "typicalAgeRange": "12-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\brain-garden.html'
        Title = "Brain Garden – Cognitive Logic Game for Kids | Medhaa"
        Desc = "Complete a short cognitive mini-game each day and watch your personal brain garden grow. Free game for ages 8-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/brain-garden.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Brain Garden", "description": "Complete a short cognitive mini-game each day and watch your personal brain garden grow.", "url": "https://medhaa.net/games-static/brain-garden.html", "learningResourceType": "Educational Game", "teaches": ["Cognitive Consistency", "Varied Reasoning", "Habit Building"], "typicalAgeRange": "8-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\brain-quest.html'
        Title = "Brain Quest – Cognitive Logic Game for Kids | Medhaa"
        Desc = "A multi-stage cognitive quest that tests attention, memory, and reasoning back to back. Free game for ages 12-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/brain-quest.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Brain Quest", "description": "A multi-stage cognitive quest that tests attention, memory, and reasoning back to back.", "url": "https://medhaa.net/games-static/brain-quest.html", "learningResourceType": "Educational Game", "teaches": ["Attention", "Memory", "Reasoning"], "typicalAgeRange": "12-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\mindscape-pro.html'
        Title = "MindScape Pro – Cognitive Assessment Game for Kids | Medhaa"
        Desc = "Advanced fluid-reasoning assessment using matrix reasoning, abstract analogies, and number series. Free game for ages 12-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/mindscape-pro.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "MindScape Pro", "description": "Advanced fluid-reasoning assessment using matrix reasoning, abstract analogies, and number series.", "url": "https://medhaa.net/games-static/mindscape-pro.html", "learningResourceType": "Educational Game", "teaches": ["Fluid Reasoning", "Pattern Recognition", "Abstract Thinking"], "typicalAgeRange": "12-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\mindspark-iq.html'
        Title = "MindSpark IQ – Cognitive Assessment Game for Kids | Medhaa"
        Desc = "A structured IQ-style assessment covering pattern, spatial, verbal, and numerical reasoning. Free game for ages 12-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/mindspark-iq.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "MindSpark IQ", "description": "A structured IQ-style assessment covering pattern, spatial, verbal, and numerical reasoning.", "url": "https://medhaa.net/games-static/mindspark-iq.html", "learningResourceType": "Educational Game", "teaches": ["Pattern Recognition", "Spatial Reasoning", "Verbal and Numerical Reasoning"], "typicalAgeRange": "12-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\neuro-ascend-iq.html'
        Title = "Neuro Ascend IQ – Cognitive Assessment Game for Kids | Medhaa"
        Desc = "Ascend through escalating cognitive levels, starting with basic processing and climbing toward advanced reasoning. Free game for ages 12-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/neuro-ascend-iq.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Neuro Ascend IQ", "description": "Ascend through escalating cognitive levels, starting with basic processing and climbing toward advanced reasoning.", "url": "https://medhaa.net/games-static/neuro-ascend-iq.html", "learningResourceType": "Educational Game", "teaches": ["Cognitive Processing Speed", "Advanced Reasoning", "Adaptive Thinking"], "typicalAgeRange": "12-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\neurospark.html'
        Title = "NeuroSpark – Cognitive Focus Game for Kids | Medhaa"
        Desc = "High-speed multi-tasking challenges like sorting shapes by colour while counting sounds. Free game for ages 12-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/neurospark.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "NeuroSpark", "description": "High-speed multi-tasking challenges like sorting shapes by colour while counting sounds.", "url": "https://medhaa.net/games-static/neurospark.html", "learningResourceType": "Educational Game", "teaches": ["Cognitive Flexibility", "Dual-Task Processing", "Executive Function"], "typicalAgeRange": "12-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\take-test.html'
        Title = "Take Test – Cognitive Assessment Game for Kids | Medhaa"
        Desc = "The comprehensive Bhava Tech assessment experience: a full Brain Power Test session. Free game for ages 11-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/take-test.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Take Test", "description": "The comprehensive Bhava Tech assessment experience: a full Brain Power Test session.", "url": "https://medhaa.net/games-static/take-test.html", "learningResourceType": "Educational Game", "teaches": ["Mixed Cognitive Domains", "Sustained Test-Taking Focus", "Self-Awareness"], "typicalAgeRange": "11-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\bcs-lite-v3.html'
        Title = "BCS Lite – Cognitive Assessment Game for Kids | Medhaa"
        Desc = "A lightweight version of the cognitive screening test, a fast check-in on where you stand. Free game for ages 11-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/bcs-lite-v3.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "BCS Lite", "description": "A lightweight version of the cognitive screening test, a fast check-in on where you stand.", "url": "https://medhaa.net/games-static/bcs-lite-v3.html", "learningResourceType": "Educational Game", "teaches": ["Self-Awareness", "Baseline Cognitive Screening"], "typicalAgeRange": "11-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\telugu-script-game.html'
        Title = "Telugu Script – Language Learning Game for Kids | Medhaa"
        Desc = "Learn to read and write Telugu script step by step, from individual vowels up to full sentences. Free game for ages 5-12 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/telugu-script-game.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Telugu Script", "description": "Learn to read and write Telugu script step by step, from individual vowels up to full sentences.", "url": "https://medhaa.net/games-static/telugu-script-game.html", "learningResourceType": "Educational Game", "teaches": ["Script Recognition", "Reading Fluency", "Language Literacy"], "typicalAgeRange": "5-12", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\devanagari-game\index.html'
        Title = "Devanagari – Language Learning Game for Kids | Medhaa"
        Desc = "An interactive introduction to Devanagari, the script used to write Sanskrit and Hindi. Free game for ages 5-7 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/devanagari-game/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Devanagari", "description": "An interactive introduction to Devanagari, the script used to write Sanskrit and Hindi.", "url": "https://medhaa.net/games-static/devanagari-game/index.html", "learningResourceType": "Educational Game", "teaches": ["Script Recognition", "Visual Memory", "Language Foundations"], "typicalAgeRange": "5-7", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\grammar-galaxy.html'
        Title = "Grammar Galaxy – Language Learning Game for Kids | Medhaa"
        Desc = "A leveled English grammar curriculum wrapped in a space theme. Free game for ages 5-10 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/grammar-galaxy.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Grammar Galaxy", "description": "A leveled English grammar curriculum wrapped in a space theme.", "url": "https://medhaa.net/games-static/grammar-galaxy.html", "learningResourceType": "Educational Game", "teaches": ["Grammar Fundamentals", "Sentence Construction", "Vocabulary"], "typicalAgeRange": "5-10", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\Grammar-Pro.html'
        Title = "Daily English – Language Learning Game for Kids | Medhaa"
        Desc = "A live, daily English challenge covering everything from basic parts of speech up through advanced grammar. Free game for ages 11-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/Grammar-Pro.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Daily English", "description": "A live, daily English challenge covering everything from basic parts of speech up through advanced grammar.", "url": "https://medhaa.net/games-static/Grammar-Pro.html", "learningResourceType": "Educational Game", "teaches": ["Grammar Mastery", "Sentence Analysis", "Daily Practice Habit"], "typicalAgeRange": "11-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\google-search-lab-deep-v2.html'
        Title = "Know Google Lab – Digital Literacy Game for Kids | Medhaa"
        Desc = "Follow a search query through the real four-layer pipeline of a modern search engine. Free game for ages 11-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/google-search-lab-deep-v2.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Know Google Lab", "description": "Follow a search query through the real four-layer pipeline of a modern search engine.", "url": "https://medhaa.net/games-static/google-search-lab-deep-v2.html", "learningResourceType": "Educational Game", "teaches": ["Computational Thinking", "Digital Literacy", "Systems Understanding"], "typicalAgeRange": "11-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\imaginia-quest.html'
        Title = "Imaginia Quest – Creativity Game for Kids | Medhaa"
        Desc = "Solve pattern-completion and odd-one-out puzzles woven into an ongoing fantasy story. Free game for ages 5-9 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/imaginia-quest.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Imaginia Quest", "description": "Solve pattern-completion and odd-one-out puzzles woven into an ongoing fantasy story.", "url": "https://medhaa.net/games-static/imaginia-quest.html", "learningResourceType": "Educational Game", "teaches": ["Pattern Recognition", "Creative Thinking", "Narrative Reasoning"], "typicalAgeRange": "5-9", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\nadopaasana\index.html'
        Title = "Nadopaasana – Music Learning Game for Kids | Medhaa"
        Desc = "An all-ages exploration of worship through sound rooted in Indian classical music traditions. Free game for ages 5-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/nadopaasana/index.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Nadopaasana", "description": "An all-ages exploration of worship through sound rooted in Indian classical music traditions.", "url": "https://medhaa.net/games-static/nadopaasana/index.html", "learningResourceType": "Educational Game", "teaches": ["Musical Ear Training", "Cultural Literacy", "Focused Listening"], "typicalAgeRange": "5-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\bhava_Tech_Likhwell.html'
        Title = "Likhwell – Language Learning Game for Kids | Medhaa"
        Desc = "A dedicated handwriting practice tool that tracks your writing history over time. Free game for ages 5-10 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/bhava_Tech_Likhwell.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Likhwell", "description": "A dedicated handwriting practice tool that tracks your writing history over time.", "url": "https://medhaa.net/games-static/bhava_Tech_Likhwell.html", "learningResourceType": "Educational Game", "teaches": ["Fine Motor Skills", "Handwriting Fluency", "Self-Tracking Progress"], "typicalAgeRange": "5-10", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    },
    @{
        Path = 'games-static\career-adventure.html'
        Title = "Career Adventure – Career Exploration Game for Kids | Medhaa"
        Desc = "Explore three real career decision points with grounded advice. Free game for ages 14-17 on Medhaa."
        Canonical = 'https://medhaa.net/games-static/career-adventure.html'
        Schema = '{"@context": "https://schema.org", "@type": "LearningResource", "name": "Career Adventure", "description": "Explore three real career decision points with grounded advice.", "url": "https://medhaa.net/games-static/career-adventure.html", "learningResourceType": "Educational Game", "teaches": ["Long-Term Planning", "Financial Awareness", "Real-World Decision-Making"], "typicalAgeRange": "14-17", "isAccessibleForFree": true, "provider": {"@type": "Organization", "name": "Bhava Tech", "url": "https://medhaa.net"}}'
    }
)

$successCount = 0
$failCount = 0
$failedFiles = @()

foreach ($g in $games) {
    $fullPath = Join-Path $root $g.Path
    if (-Not (Test-Path $fullPath)) {
        Write-Host "MISSING: $fullPath" -ForegroundColor Red
        $failCount++
        $failedFiles += $fullPath
        continue
    }

    $backupPath = "$fullPath.seo.bak"
    if (-Not (Test-Path $backupPath)) {
        Copy-Item $fullPath $backupPath
    }

    $content = Get-Content $fullPath -Raw -Encoding UTF8

    if ($content -match "MEDHAA-SEO-INJECTED") {
        Write-Host "SKIP (already injected): $fullPath" -ForegroundColor Yellow
        continue
    }

    $metaBlock = "<!-- MEDHAA-SEO-INJECTED -->`r`n"
    $metaBlock += "<title>" + $g.Title + "</title>`r`n"
    $metaBlock += '<meta name="description" content="' + $g.Desc + '">' + "`r`n"
    $metaBlock += '<meta property="og:title" content="' + $g.Title + '">' + "`r`n"
    $metaBlock += '<meta property="og:description" content="' + $g.Desc + '">' + "`r`n"
    $metaBlock += '<meta property="og:url" content="' + $g.Canonical + '">' + "`r`n"
    $metaBlock += '<link rel="canonical" href="' + $g.Canonical + '">' + "`r`n"
    $metaBlock += '<script type="application/ld+json">' + "`r`n"
    $metaBlock += $g.Schema + "`r`n"
    $metaBlock += '</script>' + "`r`n"

    if ($content -match '<head[^>]*>') {
        $headTag = $matches[0]
        $newContent = $content.Replace($headTag, $headTag + "`r`n" + $metaBlock)
        Set-Content -Path $fullPath -Value $newContent -Encoding UTF8 -NoNewline
        Write-Host "OK: $fullPath" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "NO HEAD TAG FOUND: $fullPath" -ForegroundColor Red
        $failCount++
        $failedFiles += $fullPath
    }
}

Write-Host ""
Write-Host "===================================="
Write-Host "Success: $successCount   Failed: $failCount"
if ($failedFiles.Count -gt 0) {
    Write-Host "Failed files:"
    foreach ($f in $failedFiles) { Write-Host "  $f" }
}
