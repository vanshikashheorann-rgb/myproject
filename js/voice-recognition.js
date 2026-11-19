/**
 * SIGNIFY - Voice-to-Sign Speech Recognition Module
 * Supports Web Speech API (en-IN and hi-IN) with graceful fallback and visualizer states.
 */

class VoiceRecognitionModule {
  constructor(options = {}) {
    this.micBtn = options.micBtn || document.getElementById('btn-voice-input');
    this.textInput = options.textInput || document.getElementById('translator-text-input');
    this.statusEl = options.statusEl || document.getElementById('voice-status-indicator');
    this.langSelect = options.langSelect || document.getElementById('input-language-select');
    this.visualizerEl = options.visualizerEl || document.getElementById('voice-visualizer');

    this.recognition = null;
    this.isListening = false;
    this.hasSupport = false;

    this.onResult = options.onResult || null;
    this.init();
  }

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.hasSupport = true;
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => this.handleStart();
        this.recognition.onresult = (event) => this.handleResult(event);
        this.recognition.onerror = (event) => this.handleError(event);
        this.recognition.onend = () => this.handleEnd();
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
        this.hasSupport = false;
      }
    } else {
      this.hasSupport = false;
    }

    if (this.micBtn) {
      this.micBtn.addEventListener('click', () => this.toggleListening());
    }
  }

  getCurrentLanguageCode() {
    const selected = this.langSelect ? this.langSelect.value : 'en';
    if (selected === 'hi') {
      return 'hi-IN'; // Indian Hindi
    }
    return 'en-IN'; // Indian English
  }

  toggleListening() {
    if (!this.hasSupport) {
      this.showToast('Speech recognition is not supported in this browser. Please use Chrome, Edge, or type in the text box.', 'warning');
      return;
    }

    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    if (!this.recognition) return;

    try {
      this.recognition.lang = this.getCurrentLanguageCode();
      this.recognition.start();
      this.isListening = true;
      this.updateUI(true);
      if (window.playSfx) window.playSfx('click');
    } catch (e) {
      console.warn('Could not start speech recognition:', e);
      if (e.name === 'NotAllowedError') {
        this.showToast('Microphone access blocked. Please enable microphone permissions in your browser settings.', 'error');
      } else {
        this.showToast('Microphone is busy or already active. Please try again.', 'info');
      }
      this.isListening = false;
      this.updateUI(false);
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.isListening = false;
    this.updateUI(false);
  }

  handleStart() {
    this.isListening = true;
    this.updateUI(true);
    if (this.statusEl) {
      const langName = this.getCurrentLanguageCode() === 'hi-IN' ? 'Hindi' : 'English';
      this.statusEl.textContent = `Listening in ${langName}... Speak clearly`;
      this.statusEl.classList.add('visible', 'pulse');
    }
  }

  handleResult(event) {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }

    if (this.textInput && transcript) {
      this.textInput.value = transcript;
      // Trigger input event to update character counters and clear button visibility
      this.textInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if (this.onResult) {
      this.onResult(transcript);
    }
  }

  handleError(event) {
    console.warn('Speech recognition error occurred:', event.error);
    this.isListening = false;
    this.updateUI(false);

    if (event.error === 'not-allowed') {
      this.showToast('Microphone permission was denied. You can still type your message in the box.', 'warning');
    } else if (event.error === 'no-speech') {
      this.showToast('No speech was detected. Please try speaking into the microphone again.', 'info');
    } else if (event.error === 'network') {
      this.showToast('Network issue encountered during speech recognition. Please type your message.', 'warning');
    }
  }

  handleEnd() {
    this.isListening = false;
    this.updateUI(false);
    if (this.statusEl) {
      this.statusEl.textContent = 'Voice captured! Click Translate or edit text.';
      setTimeout(() => {
        if (!this.isListening) {
          this.statusEl.classList.remove('visible', 'pulse');
        }
      }, 3500);
    }
  }

  updateUI(listening) {
    if (this.micBtn) {
      if (listening) {
        this.micBtn.classList.add('recording');
        this.micBtn.setAttribute('aria-label', 'Stop recording');
        this.micBtn.title = 'Stop listening';
      } else {
        this.micBtn.classList.remove('recording');
        this.micBtn.setAttribute('aria-label', 'Start microphone voice input');
        this.micBtn.title = 'Speak using microphone';
      }
    }

    if (this.visualizerEl) {
      if (listening) {
        this.visualizerEl.classList.add('active');
      } else {
        this.visualizerEl.classList.remove('active');
      }
    }
  }

  showToast(message, type = 'info') {
    if (window.showAppToast) {
      window.showAppToast(message, type);
    } else {
      alert(message);
    }
  }
}

window.VoiceRecognitionModule = VoiceRecognitionModule;
