/* =====================================================================
   GAASH — CONTENT DATA
   The lesson lives here as DATA, separate from the code that runs it.
   To add a new animal later (goat, sheep, poultry) you edit this file
   only — the logic in app.js never changes. That separation is what
   turns "a page" into "a platform".

   Points are driven by difficulty:  easy = 5, medium = 10, hard = 15.
   x / y are % positions on the cow illustration (calibrated when we
   build the Lesson screen).
   ===================================================================== */

const DIFFICULTY_POINTS = { easy: 5, medium: 10, hard: 15 };

const PARTS = [
  { id: "muzzle",  name: "Muzzle",  difficulty: "medium", x: 0, y: 0,
    desc: "The cow's nose and upper lip. Used to grasp grass and sense temperature and texture." },
  { id: "horn",    name: "Horn",    difficulty: "easy",   x: 0, y: 0,
    desc: "Bony growths on the poll. Used for defence and establishing herd hierarchy." },
  { id: "ear",     name: "Ear",     difficulty: "easy",   x: 0, y: 0,
    desc: "Highly mobile — cows rotate their ears to locate sounds and signal mood." },
  { id: "poll",    name: "Poll",    difficulty: "hard",   x: 0, y: 0,
    desc: "The top of the head between the ears, where the horns emerge." },
  { id: "dewlap",  name: "Dewlap",  difficulty: "medium", x: 0, y: 0,
    desc: "The loose fold of skin under the neck. Helps regulate body temperature." },
  { id: "withers", name: "Withers", difficulty: "medium", x: 0, y: 0,
    desc: "The ridge between the shoulder blades — the standard point for measuring height." },
  { id: "loin",    name: "Loin",    difficulty: "hard",   x: 0, y: 0,
    desc: "The region along the back between ribs and hip — a key area in body condition scoring." },
  { id: "flank",   name: "Flank",   difficulty: "medium", x: 0, y: 0,
    desc: "The soft side of the body between ribs and hind leg. Movement here shows breathing rate." },
  { id: "udder",   name: "Udder",   difficulty: "easy",   x: 0, y: 0,
    desc: "The mammary organ that produces milk, with four separate quarters and teats." },
  { id: "hock",    name: "Hock",    difficulty: "hard",   x: 0, y: 0,
    desc: "The joint on the hind leg (like a human ankle). Its health is vital for mobility." },
  { id: "hoof",    name: "Hoof",    difficulty: "easy",   x: 0, y: 0,
    desc: "The hard covering on each foot. Cows are cloven-hooved — split into two claws." },
  { id: "tail",    name: "Tail",    difficulty: "easy",   x: 0, y: 0,
    desc: "Ends in a switch of long hair, used to flick away flies and other insects." }
].map(p => ({ ...p, points: DIFFICULTY_POINTS[p.difficulty] }));

const QUIZ = [
  { type: "mcq",
    difficulty: "easy",
    prompt: "Which part produces milk?",
    options: ["Dewlap", "Udder", "Withers", "Flank"],
    answer: "Udder",
    explain: "The udder is the mammary organ, divided into four quarters." },

  { type: "mcq",
    difficulty: "medium",
    prompt: "Which part helps a cow grasp grass and sense temperature?",
    options: ["Dewlap", "Muzzle", "Withers", "Flank"],
    answer: "Muzzle",
    explain: "The muzzle is the nose and upper lip." },

  { type: "tap",
    difficulty: "medium",
    prompt: "Tap the tail on the cow.",
    target: "tail",
    explain: "The tail ends in a switch of hair to flick away flies." },

  { type: "mcq",
    difficulty: "hard",
    prompt: "Which joint on the hind leg is like a human ankle?",
    options: ["Hock", "Poll", "Loin", "Hoof"],
    answer: "Hock",
    explain: "The hock is the tarsal joint of the hind limb." },

  { type: "tap",
    difficulty: "hard",
    prompt: "Tap the withers — the point used to measure height.",
    target: "withers",
    explain: "The withers sit at the ridge between the shoulder blades." }
].map(q => ({ ...q, points: DIFFICULTY_POINTS[q.difficulty] }));

const BADGE = { id: "cow-anatomy-novice", name: "Cow Anatomy Novice" };
