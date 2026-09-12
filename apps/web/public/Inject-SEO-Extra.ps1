# Medhaa SEO Extension: Open Graph Image + FAQ Schema
# Run this AFTER Inject-SEO-Meta.ps1, from: E:\medhaa\apps\web\public
# Usage: powershell -ExecutionPolicy Bypass -File Inject-SEO-Extra.ps1

$root = "."
$games = @(
    @{
        Path = 'games-static\focus-under-distraction.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Focus Master designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Focus Master is designed for children aged 12 to 17 and focuses on Selective Attention, Self-Control, Distraction Resistance."}}, {"@type": "Question", "name": "Is Focus Master free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Focus Master is free to play on Medhaa as part of the Cognitive Focus game collection."}}, {"@type": "Question", "name": "What skills does Focus Master help build?", "acceptedAnswer": {"@type": "Answer", "text": "Focus Master helps build Selective Attention, Self-Control, Distraction Resistance through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\iq-test-level-3.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is IQ Test designed for?", "acceptedAnswer": {"@type": "Answer", "text": "IQ Test is designed for children aged 12 to 17 and focuses on Logical Reasoning, Mixed Cognitive Domains, Self-Awareness."}}, {"@type": "Question", "name": "Is IQ Test free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, IQ Test is free to play on Medhaa as part of the Cognitive Logic game collection."}}, {"@type": "Question", "name": "What skills does IQ Test help build?", "acceptedAnswer": {"@type": "Answer", "text": "IQ Test helps build Logical Reasoning, Mixed Cognitive Domains, Self-Awareness through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\dharana-arena.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Dharana Arena designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Dharana Arena is designed for children aged 5 to 17 and focuses on Sustained Attention, Reading Comprehension, Mindfulness."}}, {"@type": "Question", "name": "Is Dharana Arena free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Dharana Arena is free to play on Medhaa as part of the Cognitive Focus game collection."}}, {"@type": "Question", "name": "What skills does Dharana Arena help build?", "acceptedAnswer": {"@type": "Answer", "text": "Dharana Arena helps build Sustained Attention, Reading Comprehension, Mindfulness through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\bhava-math-grid.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Apt Number designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Apt Number is designed for children aged 11 to 17 and focuses on Numerical Reasoning, Logical Deduction, Working Memory."}}, {"@type": "Question", "name": "Is Apt Number free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Apt Number is free to play on Medhaa as part of the Cognitive Math game collection."}}, {"@type": "Question", "name": "What skills does Apt Number help build?", "acceptedAnswer": {"@type": "Answer", "text": "Apt Number helps build Numerical Reasoning, Logical Deduction, Working Memory through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\focus-flash\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Focus Flash designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Focus Flash is designed for children aged 5 to 17 and focuses on Attention Span, Reaction Speed, Impulse Control."}}, {"@type": "Question", "name": "Is Focus Flash free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Focus Flash is free to play on Medhaa as part of the Cognitive Focus game collection."}}, {"@type": "Question", "name": "What skills does Focus Flash help build?", "acceptedAnswer": {"@type": "Answer", "text": "Focus Flash helps build Attention Span, Reaction Speed, Impulse Control through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\neuroflash-memory.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Flash Memory designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Flash Memory is designed for children aged 7 to 17 and focuses on Working Memory Span, Sequential Recall, Auditory-Visual Integration."}}, {"@type": "Question", "name": "Is Flash Memory free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Flash Memory is free to play on Medhaa as part of the Cognitive Memory game collection."}}, {"@type": "Question", "name": "What skills does Flash Memory help build?", "acceptedAnswer": {"@type": "Answer", "text": "Flash Memory helps build Working Memory Span, Sequential Recall, Auditory-Visual Integration through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\bhava-smriti\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Bhava-smriti designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Bhava-smriti is designed for children aged 5 to 17 and focuses on Visual Memory, Concentration, Pattern Recall."}}, {"@type": "Question", "name": "Is Bhava-smriti free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Bhava-smriti is free to play on Medhaa as part of the Cognitive Memory game collection."}}, {"@type": "Question", "name": "What skills does Bhava-smriti help build?", "acceptedAnswer": {"@type": "Answer", "text": "Bhava-smriti helps build Visual Memory, Concentration, Pattern Recall through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\memory-match-puzzle.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Memory Match Puzzle designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Memory Match Puzzle is designed for children aged 5 to 17 and focuses on Visual Memory, Focus, Pattern Recognition."}}, {"@type": "Question", "name": "Is Memory Match Puzzle free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Memory Match Puzzle is free to play on Medhaa as part of the Cognitive Memory game collection."}}, {"@type": "Question", "name": "What skills does Memory Match Puzzle help build?", "acceptedAnswer": {"@type": "Answer", "text": "Memory Match Puzzle helps build Visual Memory, Focus, Pattern Recognition through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\memory-match-ultimate.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Memory Match Ultimate designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Memory Match Ultimate is designed for children aged 5 to 17 and focuses on Visual Memory, Speed Under Pressure, Focus."}}, {"@type": "Question", "name": "Is Memory Match Ultimate free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Memory Match Ultimate is free to play on Medhaa as part of the Cognitive Memory game collection."}}, {"@type": "Question", "name": "What skills does Memory Match Ultimate help build?", "acceptedAnswer": {"@type": "Answer", "text": "Memory Match Ultimate helps build Visual Memory, Speed Under Pressure, Focus through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\memory-zoo-puzzle.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Memory Zoo Puzzle designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Memory Zoo Puzzle is designed for children aged 5 to 8 and focuses on Working Memory, Visual Attention, Object Recognition."}}, {"@type": "Question", "name": "Is Memory Zoo Puzzle free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Memory Zoo Puzzle is free to play on Medhaa as part of the Cognitive Memory game collection."}}, {"@type": "Question", "name": "What skills does Memory Zoo Puzzle help build?", "acceptedAnswer": {"@type": "Answer", "text": "Memory Zoo Puzzle helps build Working Memory, Visual Attention, Object Recognition through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\mental-rotation-game.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Mind Rotation designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Mind Rotation is designed for children aged 12 to 17 and focuses on Spatial Reasoning, Visualization, Logical Deduction."}}, {"@type": "Question", "name": "Is Mind Rotation free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Mind Rotation is free to play on Medhaa as part of the Cognitive Logic game collection."}}, {"@type": "Question", "name": "What skills does Mind Rotation help build?", "acceptedAnswer": {"@type": "Answer", "text": "Mind Rotation helps build Spatial Reasoning, Visualization, Logical Deduction through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\visual-difference-detector.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Focus Flow designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Focus Flow is designed for children aged 5 to 17 and focuses on Visual Scanning, Attention to Detail, Patience."}}, {"@type": "Question", "name": "Is Focus Flow free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Focus Flow is free to play on Medhaa as part of the Cognitive Focus game collection."}}, {"@type": "Question", "name": "What skills does Focus Flow help build?", "acceptedAnswer": {"@type": "Answer", "text": "Focus Flow helps build Visual Scanning, Attention to Detail, Patience through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\bhava-build-device-engineer\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Device Engineer designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Device Engineer is designed for children aged 11 to 18 and focuses on Systems Thinking, Debugging, Engineering Trade-offs."}}, {"@type": "Question", "name": "Is Device Engineer free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Device Engineer is free to play on Medhaa as part of the STEM Engineering game collection."}}, {"@type": "Question", "name": "What skills does Device Engineer help build?", "acceptedAnswer": {"@type": "Answer", "text": "Device Engineer helps build Systems Thinking, Debugging, Engineering Trade-offs through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\secret-of-silicon-game\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Chip Detective designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Chip Detective is designed for children aged 10 to 18 and focuses on Scientific Curiosity, Analytical Thinking, Technical Literacy."}}, {"@type": "Question", "name": "Is Chip Detective free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Chip Detective is free to play on Medhaa as part of the STEM Engineering game collection."}}, {"@type": "Question", "name": "What skills does Chip Detective help build?", "acceptedAnswer": {"@type": "Answer", "text": "Chip Detective helps build Scientific Curiosity, Analytical Thinking, Technical Literacy through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\rocket-build-engineer\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Rocket Engineer designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Rocket Engineer is designed for children aged 14 to 17 and focuses on Systems Thinking, Applied Physics, Budget-Constrained Design."}}, {"@type": "Question", "name": "Is Rocket Engineer free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Rocket Engineer is free to play on Medhaa as part of the STEM Engineering game collection."}}, {"@type": "Question", "name": "What skills does Rocket Engineer help build?", "acceptedAnswer": {"@type": "Answer", "text": "Rocket Engineer helps build Systems Thinking, Applied Physics, Budget-Constrained Design through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\bhava-space-academy\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Bhava Space Academy designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Bhava Space Academy is designed for children aged 14 to 17 and focuses on Scientific Curiosity, Systems Diagnosis, Real-World Engineering Knowledge."}}, {"@type": "Question", "name": "Is Bhava Space Academy free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Bhava Space Academy is free to play on Medhaa as part of the STEM Engineering game collection."}}, {"@type": "Question", "name": "What skills does Bhava Space Academy help build?", "acceptedAnswer": {"@type": "Answer", "text": "Bhava Space Academy helps build Scientific Curiosity, Systems Diagnosis, Real-World Engineering Knowledge through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\drone-build-engineer\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Drone Engineer designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Drone Engineer is designed for children aged 14 to 17 and focuses on Engineering Design, Applied Physics, Precision Trade-offs."}}, {"@type": "Question", "name": "Is Drone Engineer free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Drone Engineer is free to play on Medhaa as part of the STEM Engineering game collection."}}, {"@type": "Question", "name": "What skills does Drone Engineer help build?", "acceptedAnswer": {"@type": "Answer", "text": "Drone Engineer helps build Engineering Design, Applied Physics, Precision Trade-offs through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\build-your-car\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Car Designer designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Car Designer is designed for children aged 11 to 17 and focuses on Engineering Trade-offs, Budget Management, Systems Thinking."}}, {"@type": "Question", "name": "Is Car Designer free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Car Designer is free to play on Medhaa as part of the STEM Engineering game collection."}}, {"@type": "Question", "name": "What skills does Car Designer help build?", "acceptedAnswer": {"@type": "Answer", "text": "Car Designer helps build Engineering Trade-offs, Budget Management, Systems Thinking through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\plane-builder\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Plane Builder designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Plane Builder is designed for children aged 11 to 15 and focuses on Applied Physics, Systems Thinking, Attention to Detail."}}, {"@type": "Question", "name": "Is Plane Builder free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Plane Builder is free to play on Medhaa as part of the STEM Engineering game collection."}}, {"@type": "Question", "name": "What skills does Plane Builder help build?", "acceptedAnswer": {"@type": "Answer", "text": "Plane Builder helps build Applied Physics, Systems Thinking, Attention to Detail through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\motorcycle-one-workshop.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Bike Builder designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Bike Builder is designed for children aged 11 to 17 and focuses on Mechanical Thinking, Systems Knowledge, Attention to Detail."}}, {"@type": "Question", "name": "Is Bike Builder free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Bike Builder is free to play on Medhaa as part of the STEM Engineering game collection."}}, {"@type": "Question", "name": "What skills does Bike Builder help build?", "acceptedAnswer": {"@type": "Answer", "text": "Bike Builder helps build Mechanical Thinking, Systems Knowledge, Attention to Detail through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\bhava-tech-build-your-bike\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Build Cycles designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Build Cycles is designed for children aged 8 to 10 and focuses on Mechanical Thinking, Diagnostic Reasoning, Sequencing."}}, {"@type": "Question", "name": "Is Build Cycles free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Build Cycles is free to play on Medhaa as part of the STEM Engineering game collection."}}, {"@type": "Question", "name": "What skills does Build Cycles help build?", "acceptedAnswer": {"@type": "Answer", "text": "Build Cycles helps build Mechanical Thinking, Diagnostic Reasoning, Sequencing through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\nagarikx-enhanced.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Future Citizen designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Future Citizen is designed for children aged 14 to 17 and focuses on Civic Sense, Legal Literacy, Real-World Decision-Making."}}, {"@type": "Question", "name": "Is Future Citizen free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Future Citizen is free to play on Medhaa as part of the Civics Life Skills game collection."}}, {"@type": "Question", "name": "What skills does Future Citizen help build?", "acceptedAnswer": {"@type": "Answer", "text": "Future Citizen helps build Civic Sense, Legal Literacy, Real-World Decision-Making through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\soccomm-enhanced.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Me and Society designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Me and Society is designed for children aged 11 to 17 and focuses on Social Responsibility, Communication, Negotiation."}}, {"@type": "Question", "name": "Is Me and Society free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Me and Society is free to play on Medhaa as part of the Civics Life Skills game collection."}}, {"@type": "Question", "name": "What skills does Me and Society help build?", "acceptedAnswer": {"@type": "Answer", "text": "Me and Society helps build Social Responsibility, Communication, Negotiation through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\good-habits.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Good Habits designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Good Habits is designed for children aged 5 to 7 and focuses on Self-Monitoring, Healthy Habits, Decision-Making."}}, {"@type": "Question", "name": "Is Good Habits free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Good Habits is free to play on Medhaa as part of the Emotional Intelligence game collection."}}, {"@type": "Question", "name": "What skills does Good Habits help build?", "acceptedAnswer": {"@type": "Answer", "text": "Good Habits helps build Self-Monitoring, Healthy Habits, Decision-Making through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\calm-zone.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Calm Zone designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Calm Zone is designed for children aged 5 to 17 and focuses on Mindfulness, Emotional Regulation, Stress Management."}}, {"@type": "Question", "name": "Is Calm Zone free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Calm Zone is free to play on Medhaa as part of the Emotional Intelligence game collection."}}, {"@type": "Question", "name": "What skills does Calm Zone help build?", "acceptedAnswer": {"@type": "Answer", "text": "Calm Zone helps build Mindfulness, Emotional Regulation, Stress Management through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\life-strategist-starter\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Life Strategist designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Life Strategist is designed for children aged 14 to 17 and focuses on Decision-Making, Long-Term Planning, Reflective Thinking."}}, {"@type": "Question", "name": "Is Life Strategist free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Life Strategist is free to play on Medhaa as part of the Life Skills game collection."}}, {"@type": "Question", "name": "What skills does Life Strategist help build?", "acceptedAnswer": {"@type": "Answer", "text": "Life Strategist helps build Decision-Making, Long-Term Planning, Reflective Thinking through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\finlife-india-quest-enhanced.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Fin Smart designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Fin Smart is designed for children aged 14 to 17 and focuses on Financial Literacy, Delayed Gratification, Risk Awareness."}}, {"@type": "Question", "name": "Is Fin Smart free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Fin Smart is free to play on Medhaa as part of the Finance game collection."}}, {"@type": "Question", "name": "What skills does Fin Smart help build?", "acceptedAnswer": {"@type": "Answer", "text": "Fin Smart helps build Financial Literacy, Delayed Gratification, Risk Awareness through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\empathy-quest.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Empathy Quest designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Empathy Quest is designed for children aged 8 to 13 and focuses on Empathy, Social Awareness, Emotional Reasoning."}}, {"@type": "Question", "name": "Is Empathy Quest free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Empathy Quest is free to play on Medhaa as part of the Emotional Intelligence game collection."}}, {"@type": "Question", "name": "What skills does Empathy Quest help build?", "acceptedAnswer": {"@type": "Answer", "text": "Empathy Quest helps build Empathy, Social Awareness, Emotional Reasoning through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\heart-heroes.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Heart Heroes designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Heart Heroes is designed for children aged 5 to 8 and focuses on Prosocial Behaviour, Values Education, Moral Reasoning."}}, {"@type": "Question", "name": "Is Heart Heroes free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Heart Heroes is free to play on Medhaa as part of the Emotional Intelligence game collection."}}, {"@type": "Question", "name": "What skills does Heart Heroes help build?", "acceptedAnswer": {"@type": "Answer", "text": "Heart Heroes helps build Prosocial Behaviour, Values Education, Moral Reasoning through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\ready-for-the-world.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Ready for the World designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Ready for the World is designed for children aged 11 to 17 and focuses on Self-Discipline, Social Etiquette, Practical Responsibility."}}, {"@type": "Question", "name": "Is Ready for the World free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Ready for the World is free to play on Medhaa as part of the Life Skills game collection."}}, {"@type": "Question", "name": "What skills does Ready for the World help build?", "acceptedAnswer": {"@type": "Answer", "text": "Ready for the World helps build Self-Discipline, Social Etiquette, Practical Responsibility through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\day-hero-game.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Day Hero designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Day Hero is designed for children aged 5 to 9 and focuses on Time Management, Prioritization, Planning."}}, {"@type": "Question", "name": "Is Day Hero free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Day Hero is free to play on Medhaa as part of the Life Skills game collection."}}, {"@type": "Question", "name": "What skills does Day Hero help build?", "acceptedAnswer": {"@type": "Answer", "text": "Day Hero helps build Time Management, Prioritization, Planning through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\planet-guardians.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Planet Guardians designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Planet Guardians is designed for children aged 12 to 17 and focuses on Scientific Reasoning, Environmental Awareness, Collaborative Problem-Solving."}}, {"@type": "Question", "name": "Is Planet Guardians free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Planet Guardians is free to play on Medhaa as part of the Environment game collection."}}, {"@type": "Question", "name": "What skills does Planet Guardians help build?", "acceptedAnswer": {"@type": "Answer", "text": "Planet Guardians helps build Scientific Reasoning, Environmental Awareness, Collaborative Problem-Solving through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\hidden-maths\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Hidden Maths designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Hidden Maths is designed for children aged 14 to 17 and focuses on Observation, Applied Mathematics, Pattern Recognition."}}, {"@type": "Question", "name": "Is Hidden Maths free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Hidden Maths is free to play on Medhaa as part of the Maths Science game collection."}}, {"@type": "Question", "name": "What skills does Hidden Maths help build?", "acceptedAnswer": {"@type": "Answer", "text": "Hidden Maths helps build Observation, Applied Mathematics, Pattern Recognition through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\intelligent-machines\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Intelligent Machines designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Intelligent Machines is designed for children aged 11 to 13 and focuses on Analytical Thinking, Logical Sequencing, Computational Curiosity."}}, {"@type": "Question", "name": "Is Intelligent Machines free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Intelligent Machines is free to play on Medhaa as part of the Maths Science game collection."}}, {"@type": "Question", "name": "What skills does Intelligent Machines help build?", "acceptedAnswer": {"@type": "Answer", "text": "Intelligent Machines helps build Analytical Thinking, Logical Sequencing, Computational Curiosity through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\know-maths\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Know Maths designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Know Maths is designed for children aged 14 to 17 and focuses on Attention, Conceptual Understanding, Mathematical Reasoning."}}, {"@type": "Question", "name": "Is Know Maths free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Know Maths is free to play on Medhaa as part of the Maths Science game collection."}}, {"@type": "Question", "name": "What skills does Know Maths help build?", "acceptedAnswer": {"@type": "Answer", "text": "Know Maths helps build Attention, Conceptual Understanding, Mathematical Reasoning through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\number-garden-quest.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Number Garden designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Number Garden is designed for children aged 5 to 8 and focuses on Number Sense, Focus, Early Counting Skills."}}, {"@type": "Question", "name": "Is Number Garden free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Number Garden is free to play on Medhaa as part of the Maths Science game collection."}}, {"@type": "Question", "name": "What skills does Number Garden help build?", "acceptedAnswer": {"@type": "Answer", "text": "Number Garden helps build Number Sense, Focus, Early Counting Skills through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\percentile-game.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Percentile designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Percentile is designed for children aged 11 to 17 and focuses on Data Reasoning, Statistical Thinking, Comparative Analysis."}}, {"@type": "Question", "name": "Is Percentile free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Percentile is free to play on Medhaa as part of the Maths Science game collection."}}, {"@type": "Question", "name": "What skills does Percentile help build?", "acceptedAnswer": {"@type": "Answer", "text": "Percentile helps build Data Reasoning, Statistical Thinking, Comparative Analysis through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\brain-of-all-machines\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Brain of All Machines designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Brain of All Machines is designed for children aged 11 to 13 and focuses on Attention, Logical Reasoning, Systems Thinking."}}, {"@type": "Question", "name": "Is Brain of All Machines free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Brain of All Machines is free to play on Medhaa as part of the Maths Science game collection."}}, {"@type": "Question", "name": "What skills does Brain of All Machines help build?", "acceptedAnswer": {"@type": "Answer", "text": "Brain of All Machines helps build Attention, Logical Reasoning, Systems Thinking through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\math-blitz.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Math Blitz designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Math Blitz is designed for children aged 12 to 17 and focuses on Numerical Fluency, Speed Under Pressure, Mental Math."}}, {"@type": "Question", "name": "Is Math Blitz free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Math Blitz is free to play on Medhaa as part of the Maths Science game collection."}}, {"@type": "Question", "name": "What skills does Math Blitz help build?", "acceptedAnswer": {"@type": "Answer", "text": "Math Blitz helps build Numerical Fluency, Speed Under Pressure, Mental Math through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\logic-game.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Logic Game designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Logic Game is designed for children aged 12 to 17 and focuses on Deductive Reasoning, Logical Thinking, Working Memory."}}, {"@type": "Question", "name": "Is Logic Game free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Logic Game is free to play on Medhaa as part of the Cognitive Logic game collection."}}, {"@type": "Question", "name": "What skills does Logic Game help build?", "acceptedAnswer": {"@type": "Answer", "text": "Logic Game helps build Deductive Reasoning, Logical Thinking, Working Memory through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\brain-garden.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Brain Garden designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Brain Garden is designed for children aged 8 to 17 and focuses on Cognitive Consistency, Varied Reasoning, Habit Building."}}, {"@type": "Question", "name": "Is Brain Garden free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Brain Garden is free to play on Medhaa as part of the Cognitive Logic game collection."}}, {"@type": "Question", "name": "What skills does Brain Garden help build?", "acceptedAnswer": {"@type": "Answer", "text": "Brain Garden helps build Cognitive Consistency, Varied Reasoning, Habit Building through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\brain-quest.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Brain Quest designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Brain Quest is designed for children aged 12 to 17 and focuses on Attention, Memory, Reasoning."}}, {"@type": "Question", "name": "Is Brain Quest free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Brain Quest is free to play on Medhaa as part of the Cognitive Logic game collection."}}, {"@type": "Question", "name": "What skills does Brain Quest help build?", "acceptedAnswer": {"@type": "Answer", "text": "Brain Quest helps build Attention, Memory, Reasoning through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\mindscape-pro.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is MindScape Pro designed for?", "acceptedAnswer": {"@type": "Answer", "text": "MindScape Pro is designed for children aged 12 to 17 and focuses on Fluid Reasoning, Pattern Recognition, Abstract Thinking."}}, {"@type": "Question", "name": "Is MindScape Pro free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, MindScape Pro is free to play on Medhaa as part of the Cognitive Assessment game collection."}}, {"@type": "Question", "name": "What skills does MindScape Pro help build?", "acceptedAnswer": {"@type": "Answer", "text": "MindScape Pro helps build Fluid Reasoning, Pattern Recognition, Abstract Thinking through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\mindspark-iq.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is MindSpark IQ designed for?", "acceptedAnswer": {"@type": "Answer", "text": "MindSpark IQ is designed for children aged 12 to 17 and focuses on Pattern Recognition, Spatial Reasoning, Verbal and Numerical Reasoning."}}, {"@type": "Question", "name": "Is MindSpark IQ free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, MindSpark IQ is free to play on Medhaa as part of the Cognitive Assessment game collection."}}, {"@type": "Question", "name": "What skills does MindSpark IQ help build?", "acceptedAnswer": {"@type": "Answer", "text": "MindSpark IQ helps build Pattern Recognition, Spatial Reasoning, Verbal and Numerical Reasoning through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\neuro-ascend-iq.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Neuro Ascend IQ designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Neuro Ascend IQ is designed for children aged 12 to 17 and focuses on Cognitive Processing Speed, Advanced Reasoning, Adaptive Thinking."}}, {"@type": "Question", "name": "Is Neuro Ascend IQ free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Neuro Ascend IQ is free to play on Medhaa as part of the Cognitive Assessment game collection."}}, {"@type": "Question", "name": "What skills does Neuro Ascend IQ help build?", "acceptedAnswer": {"@type": "Answer", "text": "Neuro Ascend IQ helps build Cognitive Processing Speed, Advanced Reasoning, Adaptive Thinking through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\neurospark.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is NeuroSpark designed for?", "acceptedAnswer": {"@type": "Answer", "text": "NeuroSpark is designed for children aged 12 to 17 and focuses on Cognitive Flexibility, Dual-Task Processing, Executive Function."}}, {"@type": "Question", "name": "Is NeuroSpark free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, NeuroSpark is free to play on Medhaa as part of the Cognitive Focus game collection."}}, {"@type": "Question", "name": "What skills does NeuroSpark help build?", "acceptedAnswer": {"@type": "Answer", "text": "NeuroSpark helps build Cognitive Flexibility, Dual-Task Processing, Executive Function through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\bcs-lite-v3.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is BCS Lite designed for?", "acceptedAnswer": {"@type": "Answer", "text": "BCS Lite is designed for children aged 11 to 17 and focuses on Self-Awareness, Baseline Cognitive Screening."}}, {"@type": "Question", "name": "Is BCS Lite free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, BCS Lite is free to play on Medhaa as part of the Cognitive Assessment game collection."}}, {"@type": "Question", "name": "What skills does BCS Lite help build?", "acceptedAnswer": {"@type": "Answer", "text": "BCS Lite helps build Self-Awareness, Baseline Cognitive Screening through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\telugu-script-game.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Telugu Script designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Telugu Script is designed for children aged 5 to 12 and focuses on Script Recognition, Reading Fluency, Language Literacy."}}, {"@type": "Question", "name": "Is Telugu Script free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Telugu Script is free to play on Medhaa as part of the Language Learning game collection."}}, {"@type": "Question", "name": "What skills does Telugu Script help build?", "acceptedAnswer": {"@type": "Answer", "text": "Telugu Script helps build Script Recognition, Reading Fluency, Language Literacy through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\devanagari-game\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Devanagari designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Devanagari is designed for children aged 5 to 7 and focuses on Script Recognition, Visual Memory, Language Foundations."}}, {"@type": "Question", "name": "Is Devanagari free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Devanagari is free to play on Medhaa as part of the Language Learning game collection."}}, {"@type": "Question", "name": "What skills does Devanagari help build?", "acceptedAnswer": {"@type": "Answer", "text": "Devanagari helps build Script Recognition, Visual Memory, Language Foundations through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\grammar-galaxy.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Grammar Galaxy designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Grammar Galaxy is designed for children aged 5 to 10 and focuses on Grammar Fundamentals, Sentence Construction, Vocabulary."}}, {"@type": "Question", "name": "Is Grammar Galaxy free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Grammar Galaxy is free to play on Medhaa as part of the Language Learning game collection."}}, {"@type": "Question", "name": "What skills does Grammar Galaxy help build?", "acceptedAnswer": {"@type": "Answer", "text": "Grammar Galaxy helps build Grammar Fundamentals, Sentence Construction, Vocabulary through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\Grammar-Pro.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Daily English designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Daily English is designed for children aged 11 to 17 and focuses on Grammar Mastery, Sentence Analysis, Daily Practice Habit."}}, {"@type": "Question", "name": "Is Daily English free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Daily English is free to play on Medhaa as part of the Language Learning game collection."}}, {"@type": "Question", "name": "What skills does Daily English help build?", "acceptedAnswer": {"@type": "Answer", "text": "Daily English helps build Grammar Mastery, Sentence Analysis, Daily Practice Habit through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\google-search-lab-deep-v2.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Know Google Lab designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Know Google Lab is designed for children aged 11 to 17 and focuses on Computational Thinking, Digital Literacy, Systems Understanding."}}, {"@type": "Question", "name": "Is Know Google Lab free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Know Google Lab is free to play on Medhaa as part of the Digital Literacy game collection."}}, {"@type": "Question", "name": "What skills does Know Google Lab help build?", "acceptedAnswer": {"@type": "Answer", "text": "Know Google Lab helps build Computational Thinking, Digital Literacy, Systems Understanding through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\imaginia-quest.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Imaginia Quest designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Imaginia Quest is designed for children aged 5 to 9 and focuses on Pattern Recognition, Creative Thinking, Narrative Reasoning."}}, {"@type": "Question", "name": "Is Imaginia Quest free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Imaginia Quest is free to play on Medhaa as part of the Creativity game collection."}}, {"@type": "Question", "name": "What skills does Imaginia Quest help build?", "acceptedAnswer": {"@type": "Answer", "text": "Imaginia Quest helps build Pattern Recognition, Creative Thinking, Narrative Reasoning through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\nadopaasana\index.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Nadopaasana designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Nadopaasana is designed for children aged 5 to 17 and focuses on Musical Ear Training, Cultural Literacy, Focused Listening."}}, {"@type": "Question", "name": "Is Nadopaasana free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Nadopaasana is free to play on Medhaa as part of the Music Learning game collection."}}, {"@type": "Question", "name": "What skills does Nadopaasana help build?", "acceptedAnswer": {"@type": "Answer", "text": "Nadopaasana helps build Musical Ear Training, Cultural Literacy, Focused Listening through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\bhava_Tech_Likhwell.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Likhwell designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Likhwell is designed for children aged 5 to 10 and focuses on Fine Motor Skills, Handwriting Fluency, Self-Tracking Progress."}}, {"@type": "Question", "name": "Is Likhwell free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Likhwell is free to play on Medhaa as part of the Language Learning game collection."}}, {"@type": "Question", "name": "What skills does Likhwell help build?", "acceptedAnswer": {"@type": "Answer", "text": "Likhwell helps build Fine Motor Skills, Handwriting Fluency, Self-Tracking Progress through interactive, game-based practice."}}]}'
    },
    @{
        Path = 'games-static\career-adventure.html'
        OgImage = 'https://medhaa.net/medha_logo_transparent.png'
        Faq = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What age group is Career Adventure designed for?", "acceptedAnswer": {"@type": "Answer", "text": "Career Adventure is designed for children aged 14 to 17 and focuses on Long-Term Planning, Financial Awareness, Real-World Decision-Making."}}, {"@type": "Question", "name": "Is Career Adventure free to play?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, Career Adventure is free to play on Medhaa as part of the Career Exploration game collection."}}, {"@type": "Question", "name": "What skills does Career Adventure help build?", "acceptedAnswer": {"@type": "Answer", "text": "Career Adventure helps build Long-Term Planning, Financial Awareness, Real-World Decision-Making through interactive, game-based practice."}}]}'
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

    $content = Get-Content $fullPath -Raw -Encoding UTF8

    if ($content -match "MEDHAA-SEO-EXTRA-INJECTED") {
        Write-Host "SKIP (already extended): $fullPath" -ForegroundColor Yellow
        continue
    }

    $extraBlock = "<!-- MEDHAA-SEO-EXTRA-INJECTED -->`r`n"
    $extraBlock += '<meta property="og:image" content="' + $g.OgImage + '">' + "`r`n"
    $extraBlock += '<meta name="twitter:card" content="summary_large_image">' + "`r`n"
    $extraBlock += '<meta name="twitter:image" content="' + $g.OgImage + '">' + "`r`n"
    $extraBlock += '<script type="application/ld+json">' + "`r`n"
    $extraBlock += $g.Faq + "`r`n"
    $extraBlock += '</script>' + "`r`n"

    if ($content -match '<head[^>]*>') {
        $headTag = $matches[0]
        $newContent = $content.Replace($headTag, $headTag + "`r`n" + $extraBlock)
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
