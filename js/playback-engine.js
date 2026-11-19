/**
 * SIGNIFY - Continuous Gapless Indian Sign Language Playback Engine
 * Dual-Mode Engine supporting:
 * 1. 2D Studio View: Photorealistic human hand demonstrations with dual-buffer gapless crossfade.
 * 2. 3D Interactive View: Rigged anatomical human hand models with 360° orbit rotation & joint kinematics.
 */

class ContinuousPlaybackEngine {
  constructor(options = {}) {
    // DOM Elements
    this.stageContainer = options.stageContainer || document.getElementById('demonstration-stage');
    this.layerA = options.layerA || document.getElementById('playback-layer-a');
    this.layerB = options.layerB || document.getElementById('playback-layer-b');
    this.progressBar = options.progressBar || document.getElementById('playback-progress-bar');
    this.progressFill = options.progressFill || document.getElementById('playback-progress-fill');
    this.signTitleEl = options.signTitleEl || document.getElementById('active-sign-title');
    this.signBadgeEl = options.signBadgeEl || document.getElementById('active-sign-badge');
    this.signCounterEl = options.signCounterEl || document.getElementById('playback-counter');
    this.timeDisplayEl = options.timeDisplayEl || document.getElementById('playback-time-display');
    this.tokenTimelineEl = options.tokenTimelineEl || document.getElementById('playback-tokens-timeline');
    this.playPauseBtn = options.playPauseBtn || document.getElementById('btn-play-pause');

    // Dual-Mode State: '2d' (Photorealistic 2D Studio) or '3d' (Rigged Anatomical 3D)
    this.mode = '2d';
    this.activeLayer = 'a'; // 'a' or 'b' for 2D double-buffering

    // 3D Hand Renderer Engine
    this.hand3D = null;
    this.init3DRenderer();

    // Playback State
    this.signs = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.speed = 1.0;
    this.isSlowMotion = false;
    this.rafId = null;
    this.lastFrameTime = 0;
    this.signElapsed = 0;
    this.totalElapsed = 0;
    this.totalDuration = 0;

    // Callbacks
    this.onSignChange = options.onSignChange || null;
    this.onFinish = options.onFinish || null;

    this.initControls();
    this.setMode('2d');
  }

  init3DRenderer() {
    if (typeof Hand3DRenderer !== 'undefined' && this.stageContainer) {
      this.hand3D = new Hand3DRenderer({ container: this.stageContainer });
    }
  }

  initControls() {
    // Mode Switcher Buttons
    const btn2D = document.getElementById('btn-mode-2d');
    const btn3D = document.getElementById('btn-mode-3d');
    if (btn2D) {
      btn2D.addEventListener('click', () => this.setMode('2d'));
    }
    if (btn3D) {
      btn3D.addEventListener('click', () => this.setMode('3d'));
    }

    // Scrubbing on progress bar
    if (this.progressBar) {
      this.progressBar.addEventListener('click', (e) => {
        if (!this.signs || this.signs.length === 0) return;
        const rect = this.progressBar.getBoundingClientRect();
        const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.seekToRatio(clickRatio);
      });
    }

    // Camera preset view angle buttons
    const btnPresetFront = document.getElementById('btn-view-front');
    const btnPresetIso = document.getElementById('btn-view-3d');
    const btnPresetTop = document.getElementById('btn-view-top');
    const btnPresetReset = document.getElementById('btn-view-reset');

    if (btnPresetFront && this.hand3D) {
      btnPresetFront.addEventListener('click', () => {
        this.hand3D.setCameraPreset('front');
        this.updatePresetButtons(btnPresetFront);
      });
    }
    if (btnPresetIso && this.hand3D) {
      btnPresetIso.addEventListener('click', () => {
        this.hand3D.setCameraPreset('isometric');
        this.updatePresetButtons(btnPresetIso);
      });
    }
    if (btnPresetTop && this.hand3D) {
      btnPresetTop.addEventListener('click', () => {
        this.hand3D.setCameraPreset('top');
        this.updatePresetButtons(btnPresetTop);
      });
    }
    if (btnPresetReset && this.hand3D) {
      btnPresetReset.addEventListener('click', () => {
        this.hand3D.setCameraPreset('front');
        this.updatePresetButtons(btnPresetFront);
      });
    }
  }

  setMode(targetMode) {
    this.mode = targetMode === '3d' ? '3d' : '2d';

    const btn2D = document.getElementById('btn-mode-2d');
    const btn3D = document.getElementById('btn-mode-3d');
    const orbitBadge = document.getElementById('orbit-hint-badge');
    const viewPresets = document.getElementById('view-presets-bar');
    const canvas3D = document.getElementById('hand-3d-canvas');

    if (this.mode === '2d') {
      if (btn2D) btn2D.classList.add('active');
      if (btn3D) btn3D.classList.remove('active');
      if (orbitBadge) orbitBadge.classList.add('hidden');
      if (viewPresets) viewPresets.classList.add('hidden');
      if (canvas3D) canvas3D.style.display = 'none';

      if (this.layerA) this.layerA.style.display = 'block';
      if (this.layerB) this.layerB.style.display = 'block';
    } else {
      if (btn3D) btn3D.classList.add('active');
      if (btn2D) btn2D.classList.remove('active');
      if (orbitBadge) orbitBadge.classList.remove('hidden');
      if (viewPresets) viewPresets.classList.remove('hidden');
      if (canvas3D) {
        canvas3D.style.display = 'block';
        if (this.hand3D) {
          this.hand3D.onWindowResize();
        }
      }

      if (this.layerA) this.layerA.style.display = 'none';
      if (this.layerB) this.layerB.style.display = 'none';

      if (this.hand3D && this.signs[this.currentIndex]) {
        const curSign = this.signs[this.currentIndex];
        this.hand3D.setSign(curSign.id, curSign.duration / this.speed, true);
      }
    }

    if (this.signs[this.currentIndex]) {
      this.updateHUD(this.signs[this.currentIndex], this.currentIndex);
    }

    if (window.playSfx) window.playSfx('click');
  }

  updatePresetButtons(activeBtn) {
    const buttons = document.querySelectorAll('.btn-view-angle');
    buttons.forEach(b => b.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
    if (window.playSfx) window.playSfx('click');
  }

  /**
   * Loads a new sequence of verified ISL signs into the engine
   * and prepares the continuous hand stage.
   */
  loadSequence(signs, autoPlay = true) {
    this.pause();
    this.signs = signs || [];
    this.currentIndex = 0;
    this.signElapsed = 0;
    this.totalElapsed = 0;

    if (this.signs.length === 0) {
      this.renderEmptyState();
      return;
    }

    // Calculate total duration based on current speed
    this.calculateDurations();
    this.renderTimelineTokens();
    this.renderSign(0, true);

    if (autoPlay) {
      setTimeout(() => {
        this.play();
      }, 50);
    }
  }

  calculateDurations() {
    this.totalDuration = this.signs.reduce((sum, s) => sum + (s.duration / this.speed), 0);
  }

  setSpeed(speedMultiplier) {
    const wasPlaying = this.isPlaying;
    if (wasPlaying) this.pause();
    this.speed = speedMultiplier;
    this.isSlowMotion = (speedMultiplier < 1.0);
    this.calculateDurations();
    if (this.hand3D) {
      this.hand3D.setSpeed(speedMultiplier);
    }
    if (wasPlaying) this.play();
  }

  play() {
    if (this.signs.length === 0) return;
    if (this.currentIndex >= this.signs.length) {
      this.currentIndex = 0;
      this.signElapsed = 0;
      this.totalElapsed = 0;
      this.renderSign(0, true);
    }

    this.isPlaying = true;
    this.lastFrameTime = performance.now();
    if (this.hand3D && this.mode === '3d') {
      this.hand3D.play();
    }
    this.updatePlayPauseUI();
    this.loop();
  }

  pause() {
    this.isPlaying = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.hand3D) {
      this.hand3D.pause();
    }
    this.updatePlayPauseUI();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  replay() {
    this.pause();
    this.currentIndex = 0;
    this.signElapsed = 0;
    this.totalElapsed = 0;
    this.renderSign(0, true);
    this.play();
  }

  nextSign() {
    if (this.currentIndex < this.signs.length - 1) {
      this.jumpToSign(this.currentIndex + 1);
    }
  }

  prevSign() {
    if (this.currentIndex > 0) {
      this.jumpToSign(this.currentIndex - 1);
    }
  }

  jumpToSign(index) {
    if (index < 0 || index >= this.signs.length) return;
    const wasPlaying = this.isPlaying;
    this.pause();

    this.currentIndex = index;
    this.signElapsed = 0;

    // Recalculate total elapsed up to this index
    let elapsed = 0;
    for (let i = 0; i < index; i++) {
      elapsed += (this.signs[i].duration / this.speed);
    }
    this.totalElapsed = elapsed;

    this.renderSign(index, true);
    this.updateProgressUI();

    if (wasPlaying) {
      this.play();
    }
  }

  seekToRatio(ratio) {
    const targetMs = ratio * this.totalDuration;
    let accumulated = 0;
    let targetIndex = 0;
    let signOffset = 0;

    for (let i = 0; i < this.signs.length; i++) {
      const dur = (this.signs[i].duration / this.speed);
      if (accumulated + dur >= targetMs || i === this.signs.length - 1) {
        targetIndex = i;
        signOffset = targetMs - accumulated;
        break;
      }
      accumulated += dur;
    }

    this.currentIndex = targetIndex;
    this.signElapsed = signOffset;
    this.totalElapsed = targetMs;

    const currentSign = this.signs[targetIndex];
    const currentDur = currentSign ? (currentSign.duration / this.speed) : 1000;
    const intraRatio = currentDur > 0 ? (signOffset / currentDur) : 0;

    this.renderSign(targetIndex, true);
    if (this.hand3D && this.mode === '3d') {
      this.hand3D.seekToProgress(intraRatio);
    }
    this.updateProgressUI();
  }

  /**
   * Master RequestAnimationFrame Loop for gapless continuous playback
   */
  loop() {
    if (!this.isPlaying) return;

    const now = performance.now();
    const delta = (now - this.lastFrameTime);
    this.lastFrameTime = now;

    this.signElapsed += delta;
    this.totalElapsed += delta;

    const currentSign = this.signs[this.currentIndex];
    const currentSignDuration = currentSign ? (currentSign.duration / this.speed) : 1000;

    // Synchronize 3D hand intra-sign animation progress if in 3D mode
    const intraRatio = Math.min(1.0, this.signElapsed / currentSignDuration);
    if (this.hand3D && this.mode === '3d') {
      this.hand3D.seekToProgress(intraRatio);
    }

    // Check if current sign has completed
    if (this.signElapsed >= currentSignDuration) {
      const overshoot = this.signElapsed - currentSignDuration;
      if (this.currentIndex + 1 < this.signs.length) {
        // Continuous fluid transition to next sign without interruption
        this.currentIndex++;
        this.signElapsed = overshoot;
        this.renderSign(this.currentIndex, false);
      } else {
        // Sequence Finished
        this.totalElapsed = this.totalDuration;
        this.updateProgressUI();
        this.pause();
        if (this.onFinish) this.onFinish();
        return;
      }
    }

    this.updateProgressUI();
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  /**
   * Renders the designated sign in the Hand Viewport
   */
  renderSign(index, isImmediate = false) {
    const sign = this.signs[index];
    if (!sign) return;

    const effectiveDuration = sign.duration / this.speed;

    // 1. Dual-Buffer 2D Layer Crossfade (Zero Gap, Zero Blank Screen)
    if (this.layerA && this.layerB) {
      const targetLayer = this.activeLayer === 'a' ? this.layerA : this.layerB;
      const otherLayer = this.activeLayer === 'a' ? this.layerB : this.layerA;

      targetLayer.src = sign.assetUrl || `assets/signs/${sign.id}.svg`;
      targetLayer.alt = `ISL Sign: ${sign.label}`;

      if (isImmediate) {
        targetLayer.style.opacity = '1';
        otherLayer.style.opacity = '0';
      } else {
        // Smooth crossfade
        targetLayer.style.opacity = '1';
        otherLayer.style.opacity = '0';
      }

      // Preload next sign into memory
      if (this.signs[index + 1]) {
        const nextSign = this.signs[index + 1];
        const preloader = new Image();
        preloader.src = nextSign.assetUrl || `assets/signs/${nextSign.id}.svg`;
      }

      // Swap active layer for next sign transition
      this.activeLayer = (this.activeLayer === 'a' ? 'b' : 'a');
    }

    // 2. 3D Hand Model Renderer
    if (this.hand3D) {
      this.hand3D.setSign(sign.id, effectiveDuration, isImmediate);
    }

    // Update HUD information
    this.updateHUD(sign, index);
    this.highlightActiveToken(index);

    if (this.onSignChange) {
      this.onSignChange(index, sign);
    }
  }

  updateHUD(sign, index) {
    if (this.signTitleEl) {
      this.signTitleEl.textContent = sign.label;
    }
    if (this.signBadgeEl) {
      const modeLabel = this.mode === '3d' ? '3D RIGGED' : '2D STUDIO';
      const typeLabel = sign.type === 'phrase' ? 'ISL PHRASE' : (sign.type === 'letter' ? 'ISL ALPHABET' : 'ISL VOCAB');
      this.signBadgeEl.textContent = `${modeLabel} • ${sign.twoHanded ? 'Two-Handed' : 'One-Handed'}`;
    }
    if (this.signCounterEl) {
      this.signCounterEl.textContent = `Sign ${index + 1} of ${this.signs.length}`;
    }
  }

  updateProgressUI() {
    if (this.totalDuration <= 0) return;
    const progress = Math.min(1, Math.max(0, this.totalElapsed / this.totalDuration));

    if (this.progressFill) {
      this.progressFill.style.width = `${(progress * 100).toFixed(1)}%`;
    }

    if (this.timeDisplayEl) {
      const currentSec = (this.totalElapsed / 1000).toFixed(1);
      const totalSec = (this.totalDuration / 1000).toFixed(1);
      this.timeDisplayEl.textContent = `${currentSec}s / ${totalSec}s (${this.speed}x)`;
    }
  }

  updatePlayPauseUI() {
    if (!this.playPauseBtn) return;
    if (this.isPlaying) {
      this.playPauseBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>
        <span>Pause</span>
      `;
      this.playPauseBtn.classList.add('playing');
    } else {
      this.playPauseBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
        <span>Play</span>
      `;
      this.playPauseBtn.classList.remove('playing');
    }
  }

  renderTimelineTokens() {
    if (!this.tokenTimelineEl) return;
    this.tokenTimelineEl.innerHTML = '';

    this.signs.forEach((sign, idx) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `timeline-token ${idx === 0 ? 'active' : ''}`;
      chip.setAttribute('data-index', idx);
      chip.innerHTML = `
        <span class="token-idx">${idx + 1}</span>
        <span class="token-text">${sign.label.split('/')[0].trim()}</span>
      `;
      chip.addEventListener('click', () => {
        this.jumpToSign(idx);
      });
      this.tokenTimelineEl.appendChild(chip);
    });
  }

  highlightActiveToken(index) {
    if (!this.tokenTimelineEl) return;
    const tokens = this.tokenTimelineEl.querySelectorAll('.timeline-token');
    tokens.forEach((t, i) => {
      if (i === index) {
        t.classList.add('active');
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        t.classList.remove('active');
      }
    });
  }

  renderEmptyState() {
    if (this.layerA) {
      this.layerA.src = 'assets/signs/namaste.svg';
      this.layerA.style.opacity = '1';
    }
    if (this.layerB) {
      this.layerB.style.opacity = '0';
    }
    if (this.hand3D) {
      this.hand3D.setSign('namaste', 1800, true);
    }
    if (this.signTitleEl) this.signTitleEl.textContent = 'Ready to Demonstrate';
    if (this.signBadgeEl) this.signBadgeEl.textContent = 'Continuous Playback';
    if (this.signCounterEl) this.signCounterEl.textContent = '0 Signs';
    if (this.timeDisplayEl) this.timeDisplayEl.textContent = '0.0s / 0.0s';
    if (this.tokenTimelineEl) this.tokenTimelineEl.innerHTML = '<span class="text-xs text-slate-400">Enter a phrase above to see the continuous hand sign sequence</span>';
    if (this.progressFill) this.progressFill.style.width = '0%';
    this.updatePlayPauseUI();
  }
}

window.ContinuousPlaybackEngine = ContinuousPlaybackEngine;
