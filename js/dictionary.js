/**
 * SIGNIFY - Interactive Sign Dictionary Module
 * Search, filter, inspect, and practice verified ISL signs and phrases.
 */

class SignDictionaryModule {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('dictionary-grid');
    this.searchInput = options.searchInput || document.getElementById('dict-search-input');
    this.categoryPills = options.categoryPills || document.getElementById('dict-category-pills');
    this.countEl = options.countEl || document.getElementById('dict-results-count');
    this.modalEl = options.modalEl || document.getElementById('sign-detail-modal');

    this.activeCategory = 'all';
    this.searchQuery = '';
    this.signsList = Object.values(window.ISL_LEXICON || {});

    this.init();
  }

  init() {
    this.renderCategoryPills();
    this.renderGrid();
    this.setupListeners();
  }

  setupListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderGrid();
      });
    }

    // Modal Close handlers
    if (this.modalEl) {
      const closeBtn = this.modalEl.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal());
      }
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) {
          this.closeModal();
        }
      });
    }
  }

  renderCategoryPills() {
    if (!this.categoryPills) return;
    this.categoryPills.innerHTML = '';

    const categories = [
      { id: 'all', name: 'All Categories' },
      { id: 'greetings', name: 'Greetings & Social' },
      { id: 'conversation', name: 'Daily Conversation' },
      { id: 'emergency', name: 'Health & Emergency' },
      { id: 'education', name: 'Education & Work' },
      { id: 'family', name: 'Family & Relations' },
      { id: 'alphabet', name: 'Two-Handed Alphabet' },
      { id: 'numbers', name: 'Numbers 0-9' }
    ];

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `dict-filter-pill ${cat.id === this.activeCategory ? 'active' : ''}`;
      btn.textContent = cat.name;
      btn.addEventListener('click', () => {
        this.activeCategory = cat.id;
        this.categoryPills.querySelectorAll('.dict-filter-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        this.renderGrid();
        if (window.playSfx) window.playSfx('click');
      });
      this.categoryPills.appendChild(btn);
    });
  }

  getFilteredSigns() {
    return this.signsList.filter(sign => {
      // Category filter
      if (this.activeCategory !== 'all' && sign.category !== this.activeCategory) {
        return false;
      }
      // Search query filter
      if (this.searchQuery) {
        const matchLabel = sign.label.toLowerCase().includes(this.searchQuery);
        const matchHindi = sign.hindi && sign.hindi.some(h => h.toLowerCase().includes(this.searchQuery));
        const matchDesc = sign.description.toLowerCase().includes(this.searchQuery);
        const matchId = sign.id.toLowerCase().includes(this.searchQuery);
        return matchLabel || matchHindi || matchDesc || matchId;
      }
      return true;
    });
  }

  renderGrid() {
    if (!this.container) return;
    const filtered = this.getFilteredSigns();

    if (this.countEl) {
      this.countEl.textContent = `Showing ${filtered.length} verified sign${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      this.container.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="inline-flex p-4 rounded-full bg-slate-800/60 border border-slate-700/60 mb-4 text-sky-400">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">No verified signs found</h3>
          <p class="text-sm text-slate-400 max-w-md mx-auto">Try searching for words like "Namaste", "Hospital", "Help", "Water", or click one of the category filters.</p>
        </div>
      `;
      return;
    }

    this.container.innerHTML = filtered.map(sign => {
      const hindiBadge = sign.hindi && sign.hindi[0] ? `<span class="dict-hindi-badge">${sign.hindi[0]}</span>` : '';
      const typeBadge = sign.type === 'phrase' ? 'Phrase' : (sign.type === 'letter' ? 'Alphabet' : 'Vocab');
      const handBadge = sign.twoHanded ? '2-Handed' : '1-Handed';

      return `
        <div class="dict-card glass-panel group" data-sign-id="${sign.id}">
          <div class="dict-card-thumb-wrap">
            <img src="${sign.assetUrl}" alt="${sign.label} ISL gesture demonstration" class="dict-card-thumb" loading="lazy" />
            <div class="dict-card-badges">
              <span class="badge-tag">${typeBadge}</span>
              <span class="badge-tag ${sign.twoHanded ? 'badge-primary' : ''}">${handBadge}</span>
              <span class="badge-tag bg-emerald-500/20 text-emerald-300 border-emerald-500/40">3D Hand</span>
            </div>
          </div>
          <div class="dict-card-body">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h4 class="dict-card-title">${sign.label}</h4>
              ${hindiBadge}
            </div>
            <p class="dict-card-desc line-clamp-2">${sign.description}</p>
            <div class="dict-card-footer mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button type="button" class="btn-inspect-sign text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1">
                <span>View Details</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
              <button type="button" class="btn-demo-sign px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 transition-all flex items-center gap-1.5" title="Demonstrate in 3D Hand Player">
                <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                <span>3D Demo</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach card click handlers
    this.container.querySelectorAll('.dict-card').forEach(card => {
      const signId = card.getAttribute('data-sign-id');
      const sign = window.ISL_LEXICON[signId];
      if (!sign) return;

      const viewBtn = card.querySelector('.btn-inspect-sign');
      const demoBtn = card.querySelector('.btn-demo-sign');

      if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openModal(sign);
        });
      }

      if (demoBtn) {
        demoBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.demonstrateInTranslator(sign);
        });
      }

      card.addEventListener('click', () => {
        this.openModal(sign);
      });
    });
  }

  openModal(sign) {
    if (!this.modalEl) return;
    const modalImage = this.modalEl.querySelector('.modal-sign-image');
    const modalTitle = this.modalEl.querySelector('.modal-sign-title');
    const modalHindi = this.modalEl.querySelector('.modal-sign-hindi');
    const modalCategory = this.modalEl.querySelector('.modal-sign-category');
    const modalDesc = this.modalEl.querySelector('.modal-sign-desc');
    const modalGrammar = this.modalEl.querySelector('.modal-sign-grammar');
    const modalDemoBtn = this.modalEl.querySelector('.modal-btn-demo');

    if (modalImage) modalImage.src = sign.assetUrl;
    if (modalTitle) modalTitle.textContent = sign.label;
    if (modalHindi) modalHindi.textContent = sign.hindi ? sign.hindi.join(' • ') : '';
    if (modalCategory) {
      modalCategory.textContent = `${sign.category.toUpperCase()} • ${sign.twoHanded ? 'Two-Handed Demonstration' : 'One-Handed Demonstration'}`;
    }
    if (modalDesc) modalDesc.textContent = sign.description;
    if (modalGrammar) modalGrammar.textContent = sign.grammarNotes || 'Authentic Indian Sign Language (ISL) movement guideline.';

    if (modalDemoBtn) {
      modalDemoBtn.onclick = () => {
        this.closeModal();
        this.demonstrateInTranslator(sign);
      };
    }

    this.modalEl.classList.remove('hidden');
    this.modalEl.classList.add('flex');
    document.body.style.overflow = 'hidden';
    if (window.playSfx) window.playSfx('modal');
  }

  closeModal() {
    if (!this.modalEl) return;
    this.modalEl.classList.add('hidden');
    this.modalEl.classList.remove('flex');
    document.body.style.overflow = '';
  }

  demonstrateInTranslator(sign) {
    if (window.appCoordinator) {
      window.appCoordinator.loadSingleSignToTranslator(sign);
    }
  }
}

window.SignDictionaryModule = SignDictionaryModule;
