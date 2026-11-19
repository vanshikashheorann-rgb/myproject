/**
 * SIGNIFY - Cybernetic Web Audio Feedback Synthesizer
 * Generates lightweight procedural sound effects using browser Web Audio API
 * without external MP3/WAV dependencies. Fully toggleable / muttable.
 */

class AudioSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.initAudioContext();
  }

  initAudioContext() {
    // Lazy initialize on first interaction to comply with browser autoplay policies
    const initFn = () => {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      window.removeEventListener('click', initFn);
      window.removeEventListener('keydown', initFn);
    };

    window.addEventListener('click', initFn, { once: true });
    window.addEventListener('keydown', initFn, { once: true });
  }

  ensureContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  play(type = 'click') {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      if (type === 'click') {
        // High-tech subtle tactile tick
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'translate') {
        // Futuristic two-tone harmonic chime
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const noteTime = now + (idx * 0.04);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0.06, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(noteTime);
          osc.stop(noteTime + 0.25);
        });
      } else if (type === 'success') {
        // Ascending pleasant chord
        [440, 554.37, 659.25].forEach((f, i) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.05);

          gain.gain.setValueAtTime(0.05, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + 0.3);
        });
      } else if (type === 'error') {
        // Low descending blip
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.15);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'modal') {
        // Soft atmospheric whoosh
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      // Audio autoplay policy or device without audio
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

const audioSynth = new AudioSynthesizer();
window.playSfx = (type) => audioSynth.play(type);
window.toggleAudioMute = () => audioSynth.toggleMute();
