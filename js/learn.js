/**
 * SIGNIFY - Interactive Learn ISL Module
 * Structured lessons, Two-Handed Alphabet explorer, and interactive sign quiz practice.
 */

class LearnISLModule {
  constructor(options = {}) {
    this.lessonNav = options.lessonNav || document.getElementById('lesson-nav-list');
    this.lessonContent = options.lessonContent || document.getElementById('lesson-display-content');
    this.alphabetGrid = options.alphabetGrid || document.getElementById('alphabet-interactive-grid');
    this.quizContainer = options.quizContainer || document.getElementById('learn-quiz-box');

    this.currentLessonId = 'lesson-1';
    this.quizState = {
      questionIndex: 0,
      score: 0,
      streak: 0,
      totalQuestions: 5,
      activeQuestion: null
    };

    this.init();
  }

  init() {
    this.setupLessonNav();
    this.loadLesson(this.currentLessonId);
    this.setupAlphabetGrid();
    this.initQuiz();
  }

  setupLessonNav() {
    if (!this.lessonNav) return;
    const buttons = this.lessonNav.querySelectorAll('.lesson-nav-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const lessonId = btn.getAttribute('data-lesson');
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.loadLesson(lessonId);
        if (window.playSfx) window.playSfx('click');
      });
    });
  }

  loadLesson(lessonId) {
    this.currentLessonId = lessonId;
    if (!this.lessonContent) return;

    const lessonsData = {
      'lesson-1': {
        title: 'Module 1: Fundamentals of Indian Sign Language (ISL)',
        subtitle: 'Linguistic structure, cultural importance, and the Two-Handed Manual Alphabet',
        overview: `
          Indian Sign Language (ISL) is a natural, complete visual-spatial language with its own grammar, syntax, and morphology, recognized under the Rights of Persons with Disabilities Act (2016).
          Unlike American Sign Language (ASL) which is predominantly one-handed, ISL utilizes a unique <strong>two-handed manual alphabet</strong> shared historically with British Sign Language (BSL) and Auslan.
        `,
        rules: [
          { title: 'Dominant vs. Non-Dominant Hand', desc: 'Your dominant hand (usually right) performs the primary movement, while your non-dominant hand provides the stationary spatial reference or base.' },
          { title: 'Signing Space', desc: 'Signs are articulated within a comfortable spatial sphere extending from just above the head down to the waist and slightly beyond the shoulders.' },
          { title: 'Non-Manual Markers (NMM)', desc: 'Facial expressions, head tilts, and mouth shapes are not just emotion—they serve fundamental grammatical roles like negation, intensity, and WH-questions.' }
        ],
        showAlphabet: true,
        recommendedSigns: ['namaste', 'sign-language', 'deaf']
      },
      'lesson-2': {
        title: 'Module 2: Essential Greetings & Social Etiquette',
        subtitle: 'Respectful expressions, welcoming visitors, and daily courtesy in ISL',
        overview: `
          Greetings in ISL reflect Indian cultural values of reverence and warmth. Namaste holds a universal place of honor, accompanied by open-faced warmth.
        `,
        rules: [
          { title: 'Namaste', desc: 'Press both palms together at chest level with fingers pointing up. Gentle forward nod. Used for meeting and departing.' },
          { title: 'Thank You', desc: 'Flat dominant fingertips touch chin and move outward towards the person with open palm.' },
          { title: 'Please & Apologies', desc: 'Circular gentle rubbing on the chest indicates polite requests ("Please") or heartfelt apologies ("Sorry").' }
        ],
        showAlphabet: false,
        recommendedSigns: ['namaste', 'thank-you', 'please', 'welcome', 'good-morning', 'good-night', 'sorry']
      },
      'lesson-3': {
        title: 'Module 3: Medical Emergencies & Vital Life-Savers',
        subtitle: 'Crucial signs for hospitals, doctors, acute pain, and emergency responders',
        overview: `
          In urgent situations, clear visual communication saves lives. These high-priority signs allow non-signers and first responders to convey and comprehend life-saving information immediately.
        `,
        rules: [
          { title: 'Doctor vs Hospital', desc: '"Doctor" taps the pulse on the inner wrist. "Hospital" draws the iconic red cross on the upper arm.' },
          { title: 'Expressing Pain', desc: 'Twist both index fingers toward each other directly in front of the body part that hurts.' },
          { title: 'Urgent Help', desc: 'Fist with thumb up lifted on flat palm. Lifting upward toward yourself indicates "Help me immediately".' }
        ],
        showAlphabet: false,
        recommendedSigns: ['help', 'doctor', 'hospital', 'emergency', 'ambulance', 'medicine', 'pain']
      },
      'lesson-4': {
        title: 'Module 4: Daily Inquiries & Sentence Construction',
        subtitle: 'Questions, basic needs, and Topic-Comment word order in ISL',
        overview: `
          ISL syntax does not follow spoken English Subject-Verb-Object (SVO) order. Instead, it frequently employs <strong>Topic-Comment / Subject-Object-Verb (SOV)</strong> order, placing question markers at the end of the sentence.
        `,
        rules: [
          { title: 'Question Placement', desc: 'Questions like "Where" or "What" are placed at the end: e.g. "Hospital Where?" rather than "Where is the hospital?".' },
          { title: 'Basic Needs', desc: 'Signs for "Water" (W-hand tapping chin) and "Food" (bunched fingers to mouth) are direct and iconic.' },
          { title: 'Time Reference', desc: 'Tapping the wrist signals "Time". Past actions move backward over the shoulder; future actions move forward.' }
        ],
        showAlphabet: false,
        recommendedSigns: ['how-are-you', 'what-is-your-name', 'water', 'food', 'time', 'where', 'yes', 'no']
      }
    };

    const data = lessonsData[lessonId] || lessonsData['lesson-1'];

    this.lessonContent.innerHTML = `
      <div class="space-y-6 animate-fadeIn">
        <div class="border-b border-slate-800 pb-5">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <span>LESSON GUIDE</span>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">${data.title}</h3>
          <p class="text-slate-400 text-sm">${data.subtitle}</p>
        </div>

        <div class="glass-panel p-5 rounded-xl border border-slate-700/50 text-slate-300 text-sm leading-relaxed">
          ${data.overview}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${data.rules.map((rule, idx) => `
            <div class="glass-panel p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
              <div class="flex items-center gap-2.5 mb-2">
                <span class="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center border border-sky-500/30">${idx + 1}</span>
                <h4 class="text-white font-semibold text-sm">${rule.title}</h4>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">${rule.desc}</p>
            </div>
          `).join('')}
        </div>

        ${data.showAlphabet ? `
          <div class="mt-8 pt-6 border-t border-slate-800">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-lg font-bold text-white">Interactive Two-Handed ISL Alphabet</h4>
                <p class="text-xs text-slate-400">Click any letter below to view its authentic two-handed manual demonstration</p>
              </div>
              <span class="text-xs px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">A to Z Verified</span>
            </div>
            <div id="alphabet-letters-mount" class="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-2"></div>
            <div id="alphabet-preview-stage" class="mt-4 p-4 rounded-xl glass-panel border border-slate-700/60 flex items-center justify-center min-h-[220px]">
              <div class="text-center text-slate-400 text-sm">
                <svg class="w-8 h-8 mx-auto mb-2 text-sky-400 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                Select a letter above to preview its demonstration
              </div>
            </div>
          </div>
        ` : ''}

        <div class="mt-8 pt-6 border-t border-slate-800">
          <h4 class="text-base font-bold text-white mb-3">Key Demonstrations in this Module</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            ${data.recommendedSigns.map(signId => {
      const sign = window.ISL_LEXICON[signId];
      if (!sign) return '';
      return `
                <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/40 transition-all flex flex-col items-center text-center cursor-pointer group" onclick="window.appCoordinator.loadSingleSignToTranslator(window.ISL_LEXICON['${sign.id}'])">
                  <img src="${sign.assetUrl}" alt="${sign.label}" class="w-full h-24 object-contain rounded-lg mb-2 group-hover:scale-105 transition-transform" />
                  <span class="text-xs font-bold text-white">${sign.label.split('/')[0]}</span>
                  <span class="text-[10px] text-sky-400 mt-1 flex items-center gap-1">
                    <span>Try Demonstration</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </span>
                </div>
              `;
    }).join('')}
          </div>
        </div>
      </div>
    `;

    if (data.showAlphabet) {
      this.populateAlphabetMount();
    }
  }

  populateAlphabetMount() {
    const mount = document.getElementById('alphabet-letters-mount');
    const previewStage = document.getElementById('alphabet-preview-stage');
    if (!mount) return;

    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    mount.innerHTML = '';

    letters.forEach(letter => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'alphabet-letter-tile';
      btn.textContent = letter.toUpperCase();
      btn.addEventListener('click', () => {
        mount.querySelectorAll('.alphabet-letter-tile').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sign = window.ISL_LEXICON[`letter-${letter}`];
        if (sign && previewStage) {
          previewStage.innerHTML = `
            <div class="flex flex-col md:flex-row items-center gap-6 w-full max-w-xl mx-auto animate-fadeIn">
              <div class="w-48 h-36 flex-shrink-0 bg-slate-900/80 rounded-xl overflow-hidden border border-slate-700/80 p-2">
                <img src="${sign.assetUrl}" alt="${sign.label}" class="w-full h-full object-contain" />
              </div>
              <div class="flex-grow text-left">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-2xl font-black text-white">${letter.toUpperCase()}</span>
                  <span class="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">Two-Handed Alphabet</span>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed mb-3">${sign.description}</p>
                <button type="button" class="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5" onclick="window.appCoordinator.loadSingleSignToTranslator(window.ISL_LEXICON['letter-${letter}'])">
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                  <span>Demonstrate in Player</span>
                </button>
              </div>
            </div>
          `;
        }
        if (window.playSfx) window.playSfx('click');
      });
      mount.appendChild(btn);
    });

    // Auto select 'A'
    const firstBtn = mount.querySelector('.alphabet-letter-tile');
    if (firstBtn) firstBtn.click();
  }

  setupAlphabetGrid() {
    // Optional standalone alphabet grid
  }

  // --- INTERACTIVE PRACTICE QUIZ ---
  initQuiz() {
    if (!this.quizContainer) return;
    this.quizState.score = 0;
    this.quizState.streak = 0;
    this.quizState.questionIndex = 0;
    this.renderNextQuizQuestion();
  }

  renderNextQuizQuestion() {
    if (!this.quizContainer) return;

    const quizPool = [
      {
        signId: 'namaste',
        options: ['Namaste / Hello', 'Thank You', 'Doctor', 'Hospital'],
        correctIndex: 0,
        tip: 'Both hands joined together in reverence at chest level.'
      },
      {
        signId: 'thank-you',
        options: ['Please', 'Thank You', 'Emergency', 'Water'],
        correctIndex: 1,
        tip: 'Flat hand touches chin and extends forward with open palm.'
      },
      {
        signId: 'doctor',
        options: ['Teacher', 'Police', 'Doctor', 'Friend'],
        correctIndex: 2,
        tip: 'Tapping the pulse on the inner wrist with two fingers.'
      },
      {
        signId: 'hospital',
        options: ['School', 'Hospital', 'Home', 'Store'],
        correctIndex: 1,
        tip: 'Drawing a medical cross on the upper arm.'
      },
      {
        signId: 'help',
        options: ['Help', 'Stop', 'Time', 'Love'],
        correctIndex: 0,
        tip: 'Closed fist with thumb up resting on flat palm lifting upward.'
      },
      {
        signId: 'water',
        options: ['Food', 'Water', 'Medicine', 'Sleep'],
        correctIndex: 1,
        tip: 'W-handshape tapping the side of the chin/mouth.'
      },
      {
        signId: 'time',
        options: ['Today', 'Tomorrow', 'Time', 'Stop'],
        correctIndex: 2,
        tip: 'Tapping the back of the wrist where a watch is worn.'
      }
    ];

    // Pick a random question
    const qIndex = Math.floor(Math.random() * quizPool.length);
    const q = quizPool[qIndex];
    this.quizState.activeQuestion = q;
    const sign = window.ISL_LEXICON[q.signId];

    this.quizContainer.innerHTML = `
      <div class="glass-panel p-6 rounded-2xl border border-slate-700/60 max-w-xl mx-auto">
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </span>
            <span class="text-xs font-bold text-white uppercase tracking-wider">ISL Gesture Quiz</span>
          </div>
          <div class="flex items-center gap-3 text-xs">
            <span class="text-slate-400">Score: <strong class="text-sky-400">${this.quizState.score}</strong></span>
            <span class="text-slate-400">Streak: <strong class="text-amber-400">${this.quizState.streak} 🔥</strong></span>
          </div>
        </div>

        <div class="text-center mb-5">
          <p class="text-xs text-slate-400 mb-3">Identify the meaning of this Indian Sign Language demonstration:</p>
          <div class="w-64 h-48 mx-auto bg-slate-950/70 rounded-xl overflow-hidden border border-slate-700/80 p-2 shadow-inner flex items-center justify-center">
            <img src="${sign.assetUrl}" alt="Quiz sign demonstration" class="w-full h-full object-contain" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4" id="quiz-options-container">
          ${q.options.map((opt, i) => `
            <button type="button" class="quiz-option-btn p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium text-xs border border-slate-700 transition-all text-left flex items-center justify-between" data-index="${i}">
              <span>${opt}</span>
              <span class="option-check-icon hidden"></span>
            </button>
          `).join('')}
        </div>

        <div id="quiz-feedback-box" class="hidden p-3 rounded-xl text-xs font-medium mb-3"></div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-800">
          <span class="text-[11px] text-slate-500">Practice builds muscle memory & visual comprehension</span>
          <button type="button" id="btn-next-quiz" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1.5 hidden">
            <span>Next Sign</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    `;

    // Attach option listeners
    const optionBtns = this.quizContainer.querySelectorAll('.quiz-option-btn');
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const nextBtn = document.getElementById('btn-next-quiz');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIndex = parseInt(btn.getAttribute('data-index'), 10);
        optionBtns.forEach(b => b.disabled = true);

        if (selectedIndex === q.correctIndex) {
          // Correct
          btn.classList.add('bg-emerald-500/20', 'border-emerald-500', 'text-emerald-300');
          this.quizState.score += 10;
          this.quizState.streak += 1;
          if (feedbackBox) {
            feedbackBox.className = 'p-3 rounded-xl text-xs font-semibold mb-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 block';
            feedbackBox.textContent = `Correct! ${q.tip}`;
          }
          if (window.playSfx) window.playSfx('success');
        } else {
          // Incorrect
          btn.classList.add('bg-rose-500/20', 'border-rose-500', 'text-rose-300');
          this.quizState.streak = 0;
          const correctBtn = optionBtns[q.correctIndex];
          if (correctBtn) {
            correctBtn.classList.add('bg-emerald-500/20', 'border-emerald-500', 'text-emerald-300');
          }
          if (feedbackBox) {
            feedbackBox.className = 'p-3 rounded-xl text-xs font-semibold mb-3 bg-rose-500/20 text-rose-300 border border-rose-500/40 block';
            feedbackBox.textContent = `Not quite. That was "${q.options[q.correctIndex]}". Hint: ${q.tip}`;
          }
          if (window.playSfx) window.playSfx('error');
        }

        if (nextBtn) {
          nextBtn.classList.remove('hidden');
          nextBtn.onclick = () => {
            this.renderNextQuizQuestion();
          };
        }
      });
    });
  }
}

window.LearnISLModule = LearnISLModule;
