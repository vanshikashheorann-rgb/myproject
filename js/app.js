/**
 * SIGNIFY - Main Application Coordinator
 * Connects Translation, Speech Recognition, Gapless Playback, Dictionary, and UI Navigation.
 */

class SignifyApp {
  constructor() {
    this.playbackEngine = null;
    this.voiceModule = null;
    this.dictionaryModule = null;
    this.learnModule = null;
    this.activeLanguage = 'en';

    this.init();
  }

  init() {
    // 1. Initialize Continuous Playback Engine
    this.playbackEngine = new ContinuousPlaybackEngine({
      stageContainer: document.getElementById('demonstration-stage'),
      layerA: document.getElementById('playback-layer-a'),
      layerB: document.getElementById('playback-layer-b'),
      progressBar: document.getElementById('playback-progress-bar'),
      progressFill: document.getElementById('playback-progress-fill'),
      signTitleEl: document.getElementById('active-sign-title'),
      signBadgeEl: document.getElementById('active-sign-badge'),
      signCounterEl: document.getElementById('playback-counter'),
      timeDisplayEl: document.getElementById('playback-time-display'),
      tokenTimelineEl: document.getElementById('playback-tokens-timeline'),
      playPauseBtn: document.getElementById('btn-play-pause'),
      onSignChange: (index, sign) => {
        const descEl = document.getElementById('active-sign-desc');
        if (descEl) descEl.textContent = sign.description;
      },
      onFinish: () => {
        // Finished sentence playback
      }
    });

    // 2. Initialize Voice Recognition Module
    this.voiceModule = new VoiceRecognitionModule({
      micBtn: document.getElementById('btn-voice-input'),
      textInput: document.getElementById('translator-text-input'),
      statusEl: document.getElementById('voice-status-indicator'),
      langSelect: document.getElementById('input-language-select'),
      visualizerEl: document.getElementById('voice-visualizer'),
      onResult: (text) => {
        this.updateCharCount();
      }
    });

    // 3. Initialize Dictionary Module
    this.dictionaryModule = new SignDictionaryModule({
      container: document.getElementById('dictionary-grid'),
      searchInput: document.getElementById('dict-search-input'),
      categoryPills: document.getElementById('dict-category-pills'),
      countEl: document.getElementById('dict-results-count'),
      modalEl: document.getElementById('sign-detail-modal')
    });

    // 4. Initialize Learn ISL Module
    this.learnModule = new LearnISLModule({
      lessonNav: document.getElementById('lesson-nav-list'),
      lessonContent: document.getElementById('lesson-display-content'),
      quizContainer: document.getElementById('learn-quiz-box')
    });

    // 5. Setup Event Handlers
    this.setupNavigation();
    this.setupTranslatorUI();
    this.setupPlaybackControls();
    this.setupToastSystem();

    // 6. Preload initial default demonstration (Namaste / Welcome)
    this.loadDefaultDemo();
  }

  loadDefaultDemo() {
    const welcomeSequence = [
      window.ISL_LEXICON['namaste'],
      window.ISL_LEXICON['welcome']
    ].filter(Boolean);

    if (this.playbackEngine && welcomeSequence.length > 0) {
      this.playbackEngine.loadSequence(welcomeSequence, false);
      const descEl = document.getElementById('active-sign-desc');
      if (descEl) descEl.textContent = welcomeSequence[0].description;
      const grammarBanner = document.getElementById('translation-grammar-banner');
      if (grammarBanner) {
        grammarBanner.innerHTML = `<span class="font-bold text-sky-400">ISL Demo:</span> [NAMASTE] -> [WELCOME] (Default demonstration ready. Type or speak your sentence above).`;
        grammarBanner.classList.remove('hidden');
      }
    }
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-anchor');
    const sections = document.querySelectorAll('section[id]');
    const mobileMenuBtn = document.getElementById('btn-mobile-menu');
    const mobileNav = document.getElementById('mobile-nav-panel');

    // Mobile nav toggle
    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener('click', () => {
        const isClosed = mobileNav.classList.contains('hidden');
        if (isClosed) {
          mobileNav.classList.remove('hidden');
        } else {
          mobileNav.classList.add('hidden');
        }
      });

      // Close mobile nav when clicking a link
      mobileNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          mobileNav.classList.add('hidden');
        });
      });
    }

    // Smooth scroll for nav anchors
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    });

    // CTA "Start Translating" button
    const ctaBtn = document.getElementById('btn-hero-cta');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        const translatorSection = document.getElementById('translator');
        if (translatorSection) {
          translatorSection.scrollIntoView({ behavior: 'smooth' });
          const input = document.getElementById('translator-text-input');
          if (input) {
            setTimeout(() => input.focus(), 600);
          }
        }
      });
    }

    // Scroll spy for active section highlight
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollPos = window.scrollY + 120;
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      if (current) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
      }
    }, { passive: true });
  }

  setupTranslatorUI() {
    const textInput = document.getElementById('translator-text-input');
    const translateBtn = document.getElementById('btn-execute-translate');
    const clearBtn = document.getElementById('btn-clear-text');
    const langSelect = document.getElementById('input-language-select');
    const exampleChips = document.querySelectorAll('.example-prompt-chip');

    // Language selection change
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        this.activeLanguage = e.target.value;
        this.updateExampleChips(this.activeLanguage);
        if (window.playSfx) window.playSfx('click');
      });
    }

    // Character counter & clear button visibility
    if (textInput) {
      textInput.addEventListener('input', () => {
        this.updateCharCount();
      });

      textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.executeTranslation();
        }
      });
    }

    // Clear Button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (textInput) {
          textInput.value = '';
          textInput.focus();
          this.updateCharCount();
        }
        if (window.playSfx) window.playSfx('click');
      });
    }

    // Translate Button
    if (translateBtn) {
      translateBtn.addEventListener('click', () => {
        this.executeTranslation();
      });
    }

    // Example prompt chips
    exampleChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const sampleText = chip.getAttribute('data-text');
        if (textInput && sampleText) {
          textInput.value = sampleText;
          this.updateCharCount();
          this.executeTranslation();
        }
      });
    });
  }

  updateCharCount() {
    const textInput = document.getElementById('translator-text-input');
    const countEl = document.getElementById('char-counter');
    const clearBtn = document.getElementById('btn-clear-text');
    if (!textInput) return;

    const len = textInput.value.length;
    if (countEl) {
      countEl.textContent = `${len} / 180`;
    }

    if (clearBtn) {
      if (len > 0) {
        clearBtn.classList.remove('opacity-0', 'pointer-events-none');
        clearBtn.classList.add('opacity-100');
      } else {
        clearBtn.classList.add('opacity-0', 'pointer-events-none');
        clearBtn.classList.remove('opacity-100');
      }
    }
  }

  updateExampleChips(lang) {
    const chips = document.querySelectorAll('.example-prompt-chip');
    chips.forEach(chip => {
      const chipLang = chip.getAttribute('data-lang');
      if (chipLang === lang) {
        chip.classList.remove('hidden');
      } else {
        chip.classList.add('hidden');
      }
    });
  }

  executeTranslation() {
    const textInput = document.getElementById('translator-text-input');
    const translateBtn = document.getElementById('btn-execute-translate');
    const grammarBanner = document.getElementById('translation-grammar-banner');
    const errorNotice = document.getElementById('translation-error-notice');

    if (!textInput) return;
    const rawText = textInput.value.trim();

    if (!rawText) {
      this.showToast('Please enter or speak a message to translate into ISL.', 'warning');
      textInput.focus();
      return;
    }

    // Show processing animation
    if (translateBtn) {
      translateBtn.classList.add('processing');
      translateBtn.disabled = true;
    }

    if (window.playSfx) window.playSfx('translate');

    setTimeout(() => {
      if (translateBtn) {
        translateBtn.classList.remove('processing');
        translateBtn.disabled = false;
      }

      const result = window.translateToISL(rawText);

      if (!result.success) {
        if (errorNotice) {
          errorNotice.textContent = result.error;
          errorNotice.classList.remove('hidden');
        }
        if (grammarBanner) grammarBanner.classList.add('hidden');
        this.showToast(result.error, 'info');
        return;
      }

      // Hide error notice if visible
      if (errorNotice) errorNotice.classList.add('hidden');

      // Show ISL grammar breakdown
      if (grammarBanner) {
        grammarBanner.innerHTML = `
          <div class="flex items-start gap-2">
            <span class="p-1 rounded bg-sky-500/20 text-sky-400 flex-shrink-0 mt-0.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </span>
            <div>
              <div class="font-bold text-white text-xs mb-0.5">${result.grammarSummary}</div>
              <div class="text-[11px] text-slate-400">Continuous playback active • ${result.signs.length} sign${result.signs.length === 1 ? '' : 's'} queued without interruption</div>
            </div>
          </div>
        `;
        grammarBanner.classList.remove('hidden');
      }

      // Load into continuous playback engine
      this.playbackEngine.loadSequence(result.signs, true);

      // Smoothly scroll demonstration stage into comfortable viewport if on mobile
      if (window.innerWidth < 768) {
        const stage = document.getElementById('demonstration-stage');
        if (stage) stage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 200);
  }

  setupPlaybackControls() {
    const playPauseBtn = document.getElementById('btn-play-pause');
    const replayBtn = document.getElementById('btn-replay-all');
    const prevBtn = document.getElementById('btn-prev-sign');
    const nextBtn = document.getElementById('btn-next-sign');
    const speedSelect = document.getElementById('playback-speed-select');
    const fullscreenBtn = document.getElementById('btn-toggle-fullscreen');

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        this.playbackEngine.toggle();
        if (window.playSfx) window.playSfx('click');
      });
    }

    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.playbackEngine.replay();
        if (window.playSfx) window.playSfx('click');
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.playbackEngine.prevSign();
        if (window.playSfx) window.playSfx('click');
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.playbackEngine.nextSign();
        if (window.playSfx) window.playSfx('click');
      });
    }

    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => {
        const speed = parseFloat(e.target.value);
        this.playbackEngine.setSpeed(speed);
        if (window.playSfx) window.playSfx('click');
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        const stage = document.getElementById('demonstration-stage-container');
        if (!stage) return;
        if (!document.fullscreenElement) {
          stage.requestFullscreen().catch(err => {
            console.warn('Fullscreen failed:', err);
          });
        } else {
          document.exitFullscreen();
        }
      });
    }

    // Audio mute toggle button in footer / header
    const audioToggleBtn = document.getElementById('btn-toggle-audio');
    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        const isMuted = window.toggleAudioMute();
        audioToggleBtn.innerHTML = isMuted ? `
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
          <span class="text-xs text-slate-400">Audio Muted</span>
        ` : `
          <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
          <span class="text-xs text-sky-400">SFX Active</span>
        `;
      });
    }
  }

  loadSingleSignToTranslator(sign) {
    if (!sign) return;
    const input = document.getElementById('translator-text-input');
    if (input) {
      input.value = sign.label.split('/')[0].trim();
      this.updateCharCount();
    }

    const translatorSection = document.getElementById('translator');
    if (translatorSection) {
      translatorSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (this.playbackEngine) {
      this.playbackEngine.loadSequence([sign], true);
      const grammarBanner = document.getElementById('translation-grammar-banner');
      if (grammarBanner) {
        grammarBanner.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-sky-400">Direct ISL Demonstration:</span>
            <span class="text-xs text-white font-medium">[${sign.label.toUpperCase()}]</span>
            <span class="text-xs text-slate-400">(${sign.category})</span>
          </div>
        `;
        grammarBanner.classList.remove('hidden');
      }
    }
  }

  setupToastSystem() {
    window.showAppToast = (message, type = 'info') => {
      this.showToast(message, type);
    };
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const colors = {
      info: 'bg-slate-900/90 border-sky-500/50 text-sky-300',
      success: 'bg-slate-900/90 border-emerald-500/50 text-emerald-300',
      warning: 'bg-slate-900/90 border-amber-500/50 text-amber-300',
      error: 'bg-slate-900/90 border-rose-500/50 text-rose-300'
    };

    toast.className = `p-3.5 rounded-xl border shadow-2xl backdrop-blur-md text-xs font-medium flex items-center gap-3 transition-all transform translate-y-4 opacity-0 max-w-sm ${colors[type] || colors.info}`;
    toast.innerHTML = `
      <div class="flex-grow">${message}</div>
      <button type="button" class="text-slate-400 hover:text-white p-1" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    }, 10);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4200);
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.appCoordinator = new SignifyApp();
});
