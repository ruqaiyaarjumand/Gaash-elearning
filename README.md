# Gaash — Interactive Veterinary Learning

**Gaash** ("light" in Kashmiri) is a gamified, interactive micro-lesson for
veterinary and animal-husbandry students. The first lesson, *Know Your Dairy
Cow*, teaches external anatomy through tap-to-discover interaction, a
Bloom's-taxonomy quiz, and a learning-analytics summary.

Built as a demonstration for the DST-funded project *Tech-driven Augmentation
of Veterinary Education for Creating an Engaging and Interactive Learning
Experience.*

## What it does
- **Interactive lesson** — tap parts of a cow to reveal name, function, and
  (for key structures) clinical importance, an observation tip, and a
  veterinary fact, using **progressive disclosure**.
- **Gamification** — difficulty-weighted points, a discovery streak, a
  progress bar, and a badge on completion.
- **Bloom's-taxonomy quiz** — mixes multiple-choice and tap-on-the-animal
  questions across Remember → Understand → Apply → Analyze.
- **Learning summary** — per-category mastery (areas mastered vs. needs
  revision), score, level/XP, and a recommended next lesson.
- **Progress tracking** — saved locally so learners can resume.

## Tech
- Plain **HTML, CSS, JavaScript** — no framework, no build step.
- **Data-driven**: each lesson is a separate file in `lessons/` (`cow.js`,
  `buffalo.js`). Adding a lesson = adding a file; the app logic is unchanged.
- **Design system**: two typefaces (Bricolage Grotesque + Inter), a two-hue
  palette (green + yellow) with tints, and a strict 4px spacing grid.
- **Accessibility**: WCAG 2.2 AA targets — visible focus states,
  44px touch targets, keyboard-operable hotspots, ARIA labels,
  `prefers-reduced-motion`, and never relying on colour alone.

## Run it
Open `index.html` in a browser. (When served over HTTP — e.g. GitHub Pages or
`python3 -m http.server` — all features work; it also runs by opening the file
directly.)

## Structure
```
gaash/
├── index.html        app shell + persistent top bar
├── styles.css        design system + all screen styles
├── app.js            state, navigation, and the four screen builders
└── lessons/
    ├── cow.js        Dairy Cow lesson data (parts + quiz)
    └── buffalo.js    Water Buffalo lesson (proves scalability)
```

## Roadmap
Designed to extend toward adaptive difficulty, spaced-repetition review,
a learning-record store for research data, and SCORM packaging for Moodle.

---
Designed and built by Ruqaiya Arjumand.
