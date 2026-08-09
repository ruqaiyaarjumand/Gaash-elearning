/* =====================================================================
   LESSON DATA: WATER BUFFALO
   A second lesson that loads through the exact same code as the cow.
   Proof that the platform is data-driven and scalable.
   ===================================================================== */
window.LESSONS = window.LESSONS || {};
window.LESSONS.buffalo = {
  id: "buffalo",
  animal: "Water Buffalo",
  title: "Know Your Water Buffalo",
  subject: "External Anatomy · Livestock Production & Management",
  difficulty: "Beginner",
  estMinutes: 5,
  objective: "Identify key external structures of a water buffalo and note how they differ from cattle.",
  outcomes: [
    "Locate and name key external structures of a water buffalo",
    "Describe how buffalo conformation differs from dairy cattle"
  ],
  categories: ["Head & Neck", "Trunk", "Limbs", "Mammary"],

  parts: [
    { id: "horn", name: "Horn", category: "Head & Neck", difficulty: "easy", points: 5, x: 19, y: 32,
      function: "Large, swept-back horns, flatter and more curved than cattle horns.",
      clinical: "Horn shape is a key breed-identification feature in buffalo.",
      fact: "Murrah buffalo are prized for their tightly curled horns." },

    { id: "muzzle", name: "Muzzle", category: "Head & Neck", difficulty: "medium", points: 10, x: 16, y: 60,
      function: "The nose and upper lip, used to grasp fodder.",
      clinical: "As in cattle, a dry muzzle can indicate fever or dehydration." },

    { id: "udder", name: "Udder", category: "Mammary", difficulty: "easy", points: 5, x: 56, y: 72,
      function: "Produces milk that is notably higher in fat than cow's milk.",
      clinical: "Buffalo milk's high fat content makes udder health central to dairy value." },

    { id: "hoof", name: "Hoof", category: "Limbs", difficulty: "easy", points: 5, x: 40, y: 86,
      function: "Wide, splayed cloven hooves suited to soft, muddy ground.",
      clinical: "The broad hoof helps buffalo move through wet paddy and wallows." }
  ],

  quiz: [
    { id: "q1", type: "mcq", bloom: "Understand", category: "Mammary", difficulty: "medium", points: 10,
      prompt: "Compared with cow's milk, buffalo milk is notably higher in what?",
      options: ["Water", "Fat", "Salt", "Sugar"], answer: "Fat",
      explain: "Buffalo milk has a higher fat content than cow's milk." },

    { id: "q2", type: "tap", bloom: "Remember", category: "Head & Neck", difficulty: "easy", points: 5,
      prompt: "Tap the horn on the buffalo.", target: "horn",
      explain: "Buffalo horns are large, flat, and swept back." }
  ],

  badge: { id: "buffalo-anatomy-novice", name: "Buffalo Anatomy Novice" }
};
