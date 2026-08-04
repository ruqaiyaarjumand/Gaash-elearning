/* =====================================================================
   LESSON DATA — DAIRY COW
   Each animal is a separate data file registered into the LESSONS
   catalog. Add a file (goat.js, sheep.js) -> the platform gains a
   lesson, with no change to app logic. This is the "data-driven,
   scalable" design.  (x / y are % positions on the cow illustration.)
   ===================================================================== */
window.LESSONS = window.LESSONS || {};
window.LESSONS.cow = {
  id: "cow",
  animal: "Dairy Cow",
  title: "Know Your Dairy Cow",
  subject: "External Anatomy · Livestock Production & Management",
  difficulty: "Beginner",
  estMinutes: 6,
  objective: "Identify the major external structures of a dairy cow and explain why each matters in routine health checks and husbandry.",
  outcomes: [
    "Locate and name 12 external structures of a dairy cow",
    "Describe the primary function of each structure",
    "Recognise the clinical relevance of key structures during daily observation"
  ],
  categories: ["Head & Neck", "Trunk", "Limbs", "Mammary"],

  parts: [
    { id: "muzzle", name: "Muzzle", category: "Head & Neck", difficulty: "medium", points: 10, x: 16, y: 60,
      function: "The nose and upper lip. Grasps grass during grazing and senses texture and temperature.",
      clinical: "A cool, moist muzzle usually signals good hydration; a dry, crusted muzzle can point to fever or dehydration.",
      tip: "Check for moisture, symmetry, and any nasal discharge.",
      fact: "A cow's muzzle print is unique — like a human fingerprint — and can be used for identification." },

    { id: "udder", name: "Udder", category: "Mammary", difficulty: "easy", points: 5, x: 56, y: 72,
      function: "The mammary organ. Four independent quarters, each with a teat, produce and store milk.",
      clinical: "The primary site of mastitis. Heat, swelling, or clotted milk signals infection — a major welfare and economic issue in dairy herds.",
      tip: "Palpate each quarter for heat or hardness; check milk for clots or discolouration.",
      fact: "A high-yielding cow's udder can hold over 20 litres of milk between milkings." },

    { id: "hoof", name: "Hoof", category: "Limbs", difficulty: "easy", points: 5, x: 40, y: 86,
      function: "The hard, cloven (two-clawed) covering that bears weight and enables walking.",
      clinical: "Lameness from hoof lesions is one of the top health and welfare problems in dairy cattle.",
      tip: "Watch gait for evenness; look for overgrowth, cracks, or swelling at the coronet.",
      fact: "Routine hoof trimming balances weight across both claws and prevents chronic lameness." },

    { id: "dewlap", name: "Dewlap", category: "Head & Neck", difficulty: "medium", points: 10, x: 22, y: 68,
      function: "The loose fold of skin hanging under the neck and brisket.",
      clinical: "Increases skin surface area to aid heat loss — relevant to heat-stress management in warmer climates.",
      tip: "More pronounced in zebu (Bos indicus) breeds; note as part of breed conformation.",
      fact: "Dewlap size is a classic visual marker separating humped indicine cattle from taurine breeds." },

    { id: "tail", name: "Tail", category: "Trunk", difficulty: "easy", points: 5, x: 85, y: 62,
      function: "Ends in a switch of long hair used to flick away flies and insects.",
      clinical: "The tail-head region is used for body-condition scoring and for epidurals/injections in practice.",
      tip: "Note switch condition and any swelling or deviation at the tail-head.",
      fact: "Vigorous tail swishing can also be a behavioural sign of discomfort or irritation." },

    { id: "horn", name: "Horn", category: "Head & Neck", difficulty: "easy", points: 5, x: 15, y: 31,
      function: "Bony growths on the poll, used for defence and establishing social rank.",
      clinical: "Many dairy herds disbud calves early to prevent injuries to handlers and other cows." },

    { id: "ear", name: "Ear", category: "Head & Neck", difficulty: "easy", points: 5, x: 31, y: 41,
      function: "Highly mobile — cattle rotate their ears to locate sound and to signal mood.",
      clinical: "Drooping ears can be an early, easily-missed sign of illness; also the standard site for ID ear-tags." },

    { id: "poll", name: "Poll", category: "Head & Neck", difficulty: "hard", points: 15, x: 24, y: 25,
      function: "The top of the head between the ears, where the horns emerge.",
      clinical: "A key landmark for haltering and restraint during handling and examination." },

    { id: "withers", name: "Withers", category: "Trunk", difficulty: "medium", points: 10, x: 44, y: 30,
      function: "The ridge between the shoulder blades.",
      clinical: "The standard anatomical point for measuring a cow's height." },

    { id: "loin", name: "Loin", category: "Trunk", difficulty: "hard", points: 15, x: 62, y: 31,
      function: "The back region between the ribs and the hip bones.",
      clinical: "A primary site for body-condition scoring, which guides feeding and fertility decisions." },

    { id: "flank", name: "Flank", category: "Trunk", difficulty: "medium", points: 10, x: 67, y: 55,
      function: "The soft side of the body between the last rib and the hind leg.",
      clinical: "The left paralumbar fossa reflects rumen fill and is the site for rumen examination — the link to digestion." },

    { id: "hock", name: "Hock", category: "Limbs", difficulty: "hard", points: 15, x: 70, y: 80,
      function: "The tarsal joint of the hind limb — equivalent to a human ankle.",
      clinical: "Swelling or hair loss here (hock lesions) points to poor lying comfort or housing problems." }
  ],

  quiz: [
    { id: "q1", type: "mcq", bloom: "Remember", category: "Mammary", difficulty: "easy", points: 5,
      prompt: "Which structure produces milk?",
      options: ["Dewlap", "Udder", "Withers", "Flank"], answer: "Udder",
      explain: "The udder is the mammary organ, divided into four quarters." },

    { id: "q2", type: "tap", bloom: "Remember", category: "Head & Neck", difficulty: "easy", points: 5,
      prompt: "Tap the muzzle on the cow.", target: "muzzle",
      explain: "The muzzle is the nose and upper lip, used to grasp grass." },

    { id: "q3", type: "mcq", bloom: "Understand", category: "Head & Neck", difficulty: "medium", points: 10,
      prompt: "A cow has a cool, moist muzzle. What does this usually indicate?",
      options: ["It is overheating", "Good hydration and health", "It is hungry", "It is in labour"],
      answer: "Good hydration and health",
      explain: "A cool, moist muzzle is a routine sign of adequate hydration." },

    { id: "q4", type: "mcq", bloom: "Apply", category: "Limbs", difficulty: "hard", points: 15,
      prompt: "A cow is reluctant to walk and keeps shifting weight between legs. Which structure should you inspect first?",
      options: ["Hoof", "Ear", "Horn", "Tail"], answer: "Hoof",
      explain: "Weight-shifting and reluctance to move are classic signs of hoof lesions and lameness." },

    { id: "q5", type: "mcq", bloom: "Apply", category: "Mammary", difficulty: "hard", points: 15,
      prompt: "One quarter of a cow's udder is hot and swollen, with clotted milk. What is the most likely problem?",
      options: ["Normal lactation", "Mastitis", "Dehydration", "Bloat"], answer: "Mastitis",
      explain: "Heat, swelling, and clotted milk in a quarter are hallmark signs of mastitis." },

    { id: "q6", type: "mcq", bloom: "Understand", category: "Head & Neck", difficulty: "medium", points: 10,
      prompt: "The dewlap mainly helps the cow with which of these?",
      options: ["Digestion", "Heat loss", "Milk storage", "Balance"], answer: "Heat loss",
      explain: "The dewlap increases skin surface area, aiding heat dissipation." },

    { id: "q7", type: "mcq", bloom: "Analyze", category: "Trunk", difficulty: "hard", points: 15,
      prompt: "To assess how full the rumen is, which region do you observe?",
      options: ["Right shoulder", "Left flank", "Poll", "Udder"], answer: "Left flank",
      explain: "The left paralumbar fossa (left flank) reflects rumen fill." },

    { id: "q8", type: "tap", bloom: "Apply", category: "Trunk", difficulty: "medium", points: 10,
      prompt: "You need to measure the cow's height. Tap the correct landmark.", target: "withers",
      explain: "Height is measured at the withers, the ridge between the shoulder blades." },

    { id: "q9", type: "mcq", bloom: "Remember", category: "Limbs", difficulty: "easy", points: 5,
      prompt: "The tarsal joint of the hind limb is called the?",
      options: ["Hock", "Poll", "Loin", "Flank"], answer: "Hock",
      explain: "The hock is the tarsal joint, equivalent to a human ankle." },

    { id: "q10", type: "mcq", bloom: "Understand", category: "Head & Neck", difficulty: "medium", points: 10,
      prompt: "Drooping ears in a cow can be an early sign of what?",
      options: ["Hunger", "Illness", "Contentment", "Thirst"], answer: "Illness",
      explain: "A change in ear carriage, such as drooping, can be an early sign of illness." }
  ],

  badge: { id: "cow-anatomy-novice", name: "Cow Anatomy Novice" }
};
