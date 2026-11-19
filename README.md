# SIGNIFY – Indian Sign Language (ISL) Translator

> **“Your Words. Their Language.”**  
> *An accessibility-focused, futuristic web application that translates spoken and written English and Hindi into continuous Indian Sign Language (ISL) hand demonstrations.*

---

## 🌟 Overview

**SIGNIFY** is a complete, modern, interactive, and accessibility-focused web application designed to bridge communication barriers between the Deaf and Hard of Hearing community and hearing non-signers.

Unlike traditional sign language dictionaries that force users to click static images or isolated video clips with awkward blank pauses, SIGNIFY features a **Continuous Gapless Playback Engine**: when a sentence is entered, its corresponding verified Indian Sign Language demonstrations play fluidly in a single unified sequence with zero black screens, dual-buffering, speed controls, and interactive timeline scrubbing.

Furthermore, SIGNIFY features an innovative **Dual-Mode Player**:
1. **2D Studio View (Default)**: Photorealistic 2D human hand demonstrations showing verified ISL hand poses with double-buffered crossfade for instant, stutter-free playback.
2. **3D Interactive View**: Anatomically accurate 3D human hands rendered with Three.js, featuring 21 articulated joint bones per hand, natural skin shaders, realistic lighting, and interactive 360° drag-to-rotate orbit controls.

---

## 🚀 Key Features

### 1. Dual-Mode Continuous Hand Demonstration Player
- **2D Studio Mode**: Clear, photorealistic 2D human hand demonstrations with natural skin tones, defined knuckles, and fingernails (no cartoonish or robotic hands). Uses double-buffered canvas/DOM layers to eliminate white flickers or blank frames.
- **3D Rigged Mode**: Anatomically accurate 3D human hand models rendered with Three.js. Supports dual-hand articulation (dominant right hand + reference left hand), realistic skin shaders, soft shadows, and 360° interactive orbit rotation.
- **Camera Presets**: In 3D mode, quickly switch between `Front`, `3D Angle`, `Top`, and `Reset` views.
- **Only Hand Demonstrations**: Focused strictly on clear hand and finger gestures without distracting full avatars or body characters.

### 2. Continuous Gapless Playback Engine
- **Fluid Sequence Playback**: Enter phrases like `"Where is the hospital?"` or `"नमस्ते आप कैसे हैं?"` and watch the corresponding signs play continuously in one stream.
- **Asset Preloading**: Preloads upcoming sign media into memory during playback to ensure 0 ms latency between sign transitions.
- **Scrubbable Progress Bar**: Click or drag anywhere along the master progress bar to jump to any point in the sequence.
- **Interactive Sentence Timeline**: Click any individual word chip in the sentence ribbon to jump directly to that sign.
- **Variable Playback Speed & Slow-Motion**: Choose from `0.5x (Slow-Motion)`, `0.75x`, `1.0x (Normal)`, `1.25x`, and `1.5x`.
- **Comprehensive Controls**: Play/Pause, Replay Sentence, Previous/Next Sign, and Fullscreen demonstration mode.

### 3. Dual-Language Text-to-Sign Translator (English & हिन्दी)
- Full support for both English and Hindi text input.
- Real-time character counter (up to 180 chars) and instant one-click clear button.
- One-click prompt chips for instant testing in English and Hindi.
- **Smart ISL Linguistic Grammar Parser**:
  - Automatically converts English Subject-Verb-Object (SVO) order into authentic ISL Topic-Comment / Subject-Object-Verb (SOV) order.
  - Automatically moves WH-question markers (Where, What, Why) to the end of clauses (e.g. `[HOSPITAL] -> [WHERE]`).
  - Graceful fingerspelling fallback using the authentic ISL Two-Handed Manual Alphabet for proper nouns and unsupported vocabulary.

### 4. Voice-to-Sign Speech Recognition
- Real-time microphone input powered by the Web Speech API.
- Bilingual recognition for **English (India - `en-IN`)** and **Hindi (`hi-IN`)**.
- User-permission requested only upon clicking the microphone button.
- Animated audio visualizer wave display during active listening.
- Transcribed speech appears in the text box and can be freely edited prior to translation.
- Graceful fallbacks and informational toasts if microphone access is restricted.

### 5. Authentic Indian Sign Language (ISL) Linguistics
- **Two-Handed Manual Alphabet (A–Z)**: Respects authentic ISL manual alphabet conventions where both hands participate (non-dominant hand serves as the spatial reference while the dominant hand forms the sign).
- **Verified 80+ Sign Lexicon**: Covering greetings, social phrases, health/emergency, education, family relations, numbers 0–9, and alphabet A–Z.
- **RPWD Act 2016 & ISLRTC Alignment**: Built with deep respect for Indian Deaf culture and standardized ISL vocabulary.

### 6. Searchable Sign Dictionary
- Instant search by English keyword, Hindi translation, or sign category.
- 7 categorized filter pills: *Greetings, Daily Conversation, Emergency, Education, Family, Two-Handed Alphabet, Numbers*.
- Interactive modal card showing handshape notes, two-handed indicators, grammatical usage, and a `"Demonstrate in Translator"` action.

### 7. Interactive Learn ISL Academy
- 4 structured learning modules: *Introduction to ISL, Social & Greetings, Emergency Life-Savers, Grammar & Syntax*.
- Interactive Two-Handed Alphabet (A–Z) letter picker with instant visual previews.
- **Gamified Sign Practice Quiz**: Tests gesture recognition with live scoring, streak counters, and instant explanatory feedback.

### 8. Premium Futuristic Cyberpunk Interface
- Dark futuristic palette: deep navy (`#070b16`), glassmorphism cards, glowing borders (`#38bdf8`, `#6366f1`).
- Three.js animated interactive particle background with mouse parallax (with pure HTML5 Canvas fallback).
- Procedural Web Audio API sound feedback (clicks, translation chimes, mute toggle).
- Fully responsive across mobile, tablet, laptop, and ultra-wide desktop viewports.

---

## 🛠️ Project Structure

```
SIGNIFY/
├── index.html                   # Main web application interface and responsive layout
├── server.js                    # Zero-dependency local Node.js static web server
├── package.json                 # Project configuration & npm scripts
├── README.md                    # Project documentation & presentation guide
├── css/
│   ├── style.css                # Futuristic design system, glassmorphism, responsive grid
│   ├── components.css           # Continuous player stage, scrubber, HUD, inputs, dictionary
│   └── animations.css           # Keyframe animations (pulse, scanline, waves, fadeIn)
├── js/
│   ├── app.js                   # Main application coordinator & navigation
│   ├── sign-library.js          # Verified ISL lexicon (80 signs), grammar parser & Hindi mapping
│   ├── sign-poses-3d.js         # Verified 3D joint rotations & keyframes for all 80 signs
│   ├── hand-3d-model.js         # Rigged anatomical 3D human hand model & skin shaders
│   ├── hand-renderer.js         # Three.js 3D hand viewport, orbit controls & studio lights
│   ├── playback-engine.js       # Dual-mode continuous gapless playback engine
│   ├── voice-recognition.js     # Web Speech API speech-to-text module (en-IN & hi-IN)
│   ├── dictionary.js            # Sign dictionary search, filter, and modal inspector
│   ├── learn.js                 # Interactive lesson modules, alphabet explorer, quiz
│   ├── three-bg.js              # Three.js 3D interactive particle background
│   └── audio-fx.js              # Procedural Web Audio API sound feedback
├── scripts/
│   ├── generate-assets.js       # Verified 2D realistic human hand SVG generator
│   ├── generate-icons.js        # Crisp UI SVG icon generator
│   ├── verify-integrity.js      # Integrity check script for links, assets, and css
│   └── test-translation.js     # Translation grammar and linguistic unit tests
└── assets/
    ├── icons/                   # UI action icons (play, mic, translate, info, etc.)
    └── signs/                   # 80 verified 2D realistic ISL hand demonstration SVGs
```

---

## 💻 How to Run Locally

SIGNIFY requires **zero external npm packages** to install.

### Option 1: Native Node.js Server (Recommended)
Open your terminal in the project directory and run:

```bash
node server.js
```

Then open your browser and navigate to:
```
http://localhost:3000
```

### Option 2: Direct Browser Access
Because SIGNIFY is built using standard native web technologies with local assets, you can also double-click `index.html` or open it directly in any modern browser (Google Chrome, Microsoft Edge, Brave, Firefox, Safari).

*Note: For the Web Speech API microphone recognition feature, modern browsers require serving via `http://localhost` or `https://`.*

---

## 🎓 College / Viva Project Demonstration Guide

When presenting SIGNIFY in a live viva, college review, or exhibition, follow this recommended walkthrough:

1. **Introduction & Mission (1 minute)**:
   - Introduce SIGNIFY's purpose: *“Over 18 million individuals in India communicate using Indian Sign Language. Existing digital tools are often static, fragmented, or rely on cartoonish full avatars that fail to capture the subtle hand configurations of ISL. SIGNIFY is built to provide continuous, verified hand translation with zero gaps.”*
2. **Dual-Mode Hand Demonstration (2 minutes)**:
   - Point out that the demonstration shows **ONLY hands** (no full avatar or human body), ensuring maximum clarity on finger joints, palm orientation, and hand positioning.
   - Click the example chip: `"Hello, how are you?"` or type `"Where is the hospital?"`.
   - Point out the **ISL Grammar Banner**: Explain how English SVO order is automatically converted to authentic ISL Topic-Comment order (`[HOSPITAL] -> [WHERE]`).
   - Highlight the **Continuous Playback**: Show that signs flow gaplessly without black screens using dual-buffer preloading.
   - Switch to **3D Rigged View**: Click `3D Rigged` in the HUD to demonstrate the Three.js anatomical hand model, drag to rotate in 360°, and click camera presets (`3D Angle`, `Top`, `Front`).
   - Toggle **0.5x Slow-Motion**: Show how students or first responders can inspect complex handshapes in slow motion.
3. **Voice Translation Demo (1 minute)**:
   - Click the **Speak** button. Speak clearly: *“Thank you very much”* or *“I need help”*.
   - Show how the voice is transcribed in real-time, can be edited, and translates directly into ISL.
   - Demonstrate the Hindi switcher: Switch to हिन्दी and try speaking or typing *"नमस्ते आप कैसे हैं?"* or *"अस्पताल कहाँ है?"*.
4. **Dictionary & Two-Handed Alphabet (1.5 minutes)**:
   - Navigate to the **Sign Dictionary**: Search for `"Doctor"` or filter by `"Health & Emergency"`.
   - Open the card to show the linguistic breakdown (handshape, movement, two-handed vs. one-handed).
   - Navigate to **Learn ISL -> Module 1**: Show the **Two-Handed Manual Alphabet**. Emphasize to the examiners that ISL uses a two-handed alphabet, demonstrating deep cultural authenticity.
5. **Interactive Practice Quiz (1 minute)**:
   - Scroll to the interactive quiz at the bottom of the Learn section.
   - Answer a question live to show instant feedback, score accrual, and streak counter.

---

## ♿ Accessibility & Ethics

- **Respectful Terminology**: SIGNIFY adheres to guidelines established by the Indian Sign Language Research and Training Centre (ISLRTC) and the Rights of Persons with Disabilities Act (2016).
- **No Mock or Random Gestures**: Unrecognized words are not faked with random hand waving; they are either fingerspelled in the authentic ISL manual alphabet or clearly explained to the user.
- **Local Asset Architecture**: All sign demonstrations are loaded locally, ensuring rapid responsiveness, privacy, and zero reliance on paid commercial translation APIs.

---

## 📄 License

This project is licensed under the MIT License – free for academic, personal, and open educational use.
