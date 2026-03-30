class MafiosoGame {
  constructor() {
    this.state = {
      screen: 'landing',
      caseId: null,
      clueIndex: 0,
      activeSuspects: [],   // suspect IDs still in play
      eliminated: [],       // [{id, reason}]
      pickedId: null,       // current selection
      clueConfirmed: false, // after confirming pick on clue 1 or 2
      isCorrect: null       // true/false, set at verdict
    };
    this.el = document.getElementById('app');
    this.render();
  }

  /* ── Getters ── */
  get caseData() { return CASES.find(c => c.id === this.state.caseId); }
  get currentClue() { return this.caseData?.clues[this.state.clueIndex]; }
  get isFinalClue() { return this.state.clueIndex === 2; }
  get activeList() {
    return this.caseData?.suspects.filter(s => this.state.activeSuspects.includes(s.id));
  }

  /* ── State ── */
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.render();
  }

  fade(fn) {
    this.el.style.opacity = '0';
    this.el.style.transition = 'opacity 0.22s ease';
    setTimeout(() => {
      fn();
      window.scrollTo({ top: 0, behavior: 'instant' });
      this.el.style.opacity = '1';
    }, 230);
  }

  /* ── Actions ── */
  startGame() { this.fade(() => this.setState({ screen: 'case-select' })); }

  selectCase(id) {
    const c = CASES.find(c => c.id === id);
    this.fade(() => this.setState({
      screen: 'case-intro',
      caseId: id,
      clueIndex: 0,
      activeSuspects: c.suspects.map(s => s.id),
      eliminated: [],
      pickedId: null,
      clueConfirmed: false,
      isCorrect: null
    }));
  }

  beginCase() { this.fade(() => this.setState({ screen: 'clue' })); }

  pickSuspect(id) {
    if (this.state.clueConfirmed) return;
    this.setState({ pickedId: id });
  }

  confirmPick() {
    if (!this.state.pickedId) return;
    const isCulprit = this.state.pickedId === this.caseData.culprit;

    if (isCulprit) {
      // ✅ WIN — player found the criminal at any clue!
      this.fade(() => this.setState({ screen: 'verdict', isCorrect: true }));
      setTimeout(() => this.launchConfetti(), 400);
    } else {
      // ❌ Wrong pick — the player's chosen person reveals their alibi and leaves
      const wrongSuspect = this.caseData.suspects.find(s => s.id === this.state.pickedId);
      const newElim = [
        ...this.state.eliminated,
        { id: wrongSuspect.id, reason: wrongSuspect.alibi }
      ];
      const newActive = this.state.activeSuspects.filter(id => id !== wrongSuspect.id);

      if (this.isFinalClue) {
        // Last clue, still wrong → LOSE
        this.fade(() => this.setState({ screen: 'verdict', isCorrect: false, eliminated: newElim, activeSuspects: newActive }));
      } else {
        // Show alibi reveal, then move to next clue
        this.setState({ clueConfirmed: true, eliminated: newElim, activeSuspects: newActive });
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  }

  nextClue() {
    this.fade(() => this.setState({
      clueIndex: this.state.clueIndex + 1,
      pickedId: null,
      clueConfirmed: false
    }));
  }

  goBack() {
    const map = {
      'case-select': 'landing',
      'case-intro': 'case-select',
      'clue': 'case-intro',
      'verdict': 'case-select'
    };
    const next = map[this.state.screen];
    if (!next) return;
    if (next === 'case-intro') {
      this.fade(() => this.setState({ screen: 'case-intro', clueIndex: 0, clueConfirmed: false, pickedId: null }));
    } else {
      this.fade(() => this.setState({ screen: next }));
    }
  }

  restart() {
    this.fade(() => this.setState({
      screen: 'case-select', caseId: null, clueIndex: 0,
      activeSuspects: [], eliminated: [], pickedId: null,
      clueConfirmed: false, isCorrect: null
    }));
  }

  replayCase() { this.selectCase(this.state.caseId); }

  /* ── Confetti ── */
  launchConfetti() {
    const colors = ['#C9A84C', '#1B2A4A', '#E8C96A', '#5B8DEF', '#27AE60', '#F4D03F'];
    for (let i = 0; i < 90; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.width = (Math.random() * 8 + 6) + 'px';
      el.style.height = (Math.random() * 8 + 6) + 'px';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDelay = Math.random() * 2 + 's';
      el.style.animationDuration = (Math.random() * 2.5 + 2) + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }
  }

  /* ── Helpers ── */
  avatarStyle(suspect) {
    return `background: linear-gradient(135deg, ${suspect.color}, ${this.darken(suspect.color, 25)});`;
  }

  darken(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (n >> 16) - pct);
    const g = Math.max(0, ((n >> 8) & 0xff) - pct);
    const b = Math.max(0, (n & 0xff) - pct);
    return `rgb(${r},${g},${b})`;
  }

  suspectCardHtml(suspect, opts = {}) {
    const { clickable = false, selected = false, eliminated = false, number = '', gameplay = false } = opts;
    const classes = ['suspect-card', gameplay ? 'gameplay' : '', clickable ? 'clickable' : '', selected ? 'selected' : '', eliminated ? 'eliminated' : ''].filter(Boolean).join(' ');
    const onclick = clickable && !eliminated ? `onclick="game.pickSuspect('${suspect.id}')"` : '';
    const accusedBadge = selected && gameplay ? `<div class="accused-badge">⚠ ACCUSED</div>` : '';
    return `
      <div class="${classes}" id="suspect-${suspect.id}" ${onclick}>
        ${number ? `<div class="suspect-number">SUSPECT #${number}</div>` : ''}
        ${accusedBadge}
        <div class="suspect-avatar" style="${this.avatarStyle(suspect)}">
          ${suspect.icon ? `<span class="avatar-emoji">${suspect.icon}</span>` : suspect.initials}
          <div class="suspect-check">!</div>
        </div>
        <div class="suspect-name">${suspect.name}</div>
        <div class="suspect-role">${suspect.role}</div>
        <div class="suspect-alibi">${suspect.alibi}</div>
      </div>`;
  }

  /* ────────────────────────── */
  /* ── RENDER FUNCTIONS ────── */
  /* ────────────────────────── */

  render() {
    switch (this.state.screen) {
      case 'landing': this.renderLanding(); break;
      case 'case-select': this.renderCaseSelect(); break;
      case 'case-intro': this.renderCaseIntro(); break;
      case 'clue': this.renderClue(); break;
      case 'verdict': this.renderVerdict(); break;
    }
  }

  /* ── Landing ── */
  renderLanding() {
    this.el.innerHTML = `
      <div class="screen landing-screen">
        <div class="landing-bg">
          <div class="bg-orb bg-orb-1"></div>
          <div class="bg-orb bg-orb-2"></div>
          <div class="bg-orb bg-orb-3"></div>
        </div>
        <span class="landing-deco landing-deco-1">🔍</span>
        <span class="landing-deco landing-deco-2">⚖️</span>
        <span class="landing-deco landing-deco-3">🗂️</span>
        <span class="landing-deco landing-deco-4">🕵️</span>
        <div class="landing-tape"></div>
        <div class="landing-content">
          <div class="landing-badge"><div class="badge-dot"></div>&nbsp; CASES ARE OPEN</div>
          <span class="landing-icon">🔍</span>
          <h1 class="landing-title">MAFIOSO</h1>
          <div class="landing-title-underline"></div>
          <p class="landing-tagline">
            Someone committed a crime. Someone is lying.<br>
            Find the real criminal before they get away.
          </p>
          <button class="btn btn-danger btn-hero" id="start-btn" onclick="game.startGame()">
            Start Playing &nbsp;→
          </button>
          <p class="landing-meta">3 Open Cases &nbsp;·&nbsp; 3 Clues Each &nbsp;·&nbsp; You Have One Chance</p>
        </div>
      </div>`;
  }

  /* ── Case Select ── */
  renderCaseSelect() {
    const cards = CASES.map(c => `
      <div class="case-card" id="case-${c.id}" style="--card-accent:${c.accentColor}" onclick="game.selectCase('${c.id}')">
        <div class="case-stamp">OPEN CASE</div>
        <div class="case-num">Case #${c.number}</div>
        <span class="case-card-icon">${c.icon}</span>
        <h3>${c.title}</h3>
        <div class="case-subtitle">${c.subtitle}</div>
        <div class="case-setting">📍 ${c.setting}</div>
        <p class="case-desc">${c.description}</p>
        <div class="case-card-footer">
          <div class="case-tags">
            <span class="tag">4 Suspects</span>
            <span class="tag">3 Clues</span>
          </div>
          <span class="case-arrow">→</span>
        </div>
      </div>`).join('');

    this.el.innerHTML = `
      <div class="screen case-select-screen">
        <div class="page-header">
          <button class="btn-back" onclick="game.goBack()">← Back</button>
          <h2>Case Files</h2>
        </div>
        <div class="cases-container">
          <div class="cases-intro">
            <h2>Pick a Case</h2>
            <p>Three cases. Three criminals still out there. Pick one and start looking for clues.</p>
          </div>
          <div class="cases-grid">${cards}</div>
        </div>
      </div>`;
  }

  /* ── Case Intro ── */
  renderCaseIntro() {
    const c = this.caseData;
    const suspectCards = c.suspects.map((s, i) =>
      this.suspectCardHtml(s, { number: String(i + 1).padStart(2, '0') })
    ).join('');

    this.el.innerHTML = `
      <div class="screen" style="--case-accent:${c.accentColor}">
        <div class="page-header">
          <button class="btn-back" onclick="game.goBack()">← Cases</button>
          <span style="font-size:0.82rem; color:rgba(255,255,255,0.55)">Case #${c.number} of 3</span>
        </div>
        <div class="case-intro-screen">

          <!-- Dramatic hero banner -->
          <div class="case-intro-hero">
            <div class="case-hero-glow"></div>
            <div class="case-hero-num">${c.number}</div>
            <div class="case-status-badge"><div class="sdot"></div> CASE OPEN</div>
            <span class="case-hero-icon">${c.icon}</span>
            <h1 class="case-hero-title">${c.title}</h1>
            <div class="case-hero-sub">${c.subtitle}</div>
            <div class="case-hero-setting">📍 ${c.setting}</div>
            <div class="case-story-box">${c.description}</div>
          </div>

          <!-- Suspects -->
          <div class="suspects-block">
            <div class="section-label">The Suspects</div>
            <h2 class="section-title">Who was there?</h2>
            <div class="suspects-grid">${suspectCards}</div>
          </div>

          <!-- CTA -->
          <div class="case-intro-cta">
            <button class="btn btn-danger btn-hero" id="begin-btn" onclick="game.beginCase()">
              🔍 &nbsp; Start the Case
            </button>
          </div>
        </div>
      </div>`;
  }

  /* ── Clue Screen ── */
  renderClue() {
    const c = this.caseData;
    const clue = this.currentClue;
    const idx = this.state.clueIndex;
    const confirmed = this.state.clueConfirmed;

    // Timeline showing all 3 clue titles
    const timeline = c.clues.map((cl, i) => {
      const cls = i < idx ? 'tl-step done' : i === idx ? 'tl-step active' : 'tl-step';
      const connCls = i < idx ? 'tl-connector done' : 'tl-connector';
      const conn = i < 2 ? `<div class="${connCls}"></div>` : '';
      return `<div class="${cls}"><div class="tl-num">${i + 1}</div><div class="tl-label">${cl.title}</div></div>${conn}`;
    }).join('');

    // Suspect cards with gameplay style
    let suspNum = 0;
    const suspectCards = c.suspects.map(s => {
      const elim = this.state.eliminated.find(e => e.id === s.id);
      const active = this.state.activeSuspects.includes(s.id);
      const sel = this.state.pickedId === s.id;
      if (!elim) suspNum++;
      return this.suspectCardHtml(s, {
        clickable: active && !confirmed,
        selected: sel,
        eliminated: !!elim,
        gameplay: true,
        number: elim ? '' : String(suspNum).padStart(2, '0')
      });
    }).join('');

    // Wrong pick banner
    const latestElim = confirmed ? this.state.eliminated[this.state.eliminated.length - 1] : null;
    const wrongSuspect = latestElim ? c.suspects.find(s => s.id === latestElim.id) : null;
    const wrongBanner = wrongSuspect ? `
      <div class="wrong-banner">
        <div class="wrong-banner-icon">🙅</div>
        <div>
          <div class="wrong-banner-label">Wrong! — ${wrongSuspect.name} is Innocent</div>
          <div class="wrong-banner-name">${wrongSuspect.name} &nbsp;·&nbsp; ${wrongSuspect.role}</div>
          <div class="wrong-banner-reason">${latestElim.reason} — The real criminal is still in the room.</div>
        </div>
      </div>` : '';

    // Suspect grid header
    const activeCount = this.state.activeSuspects.length;
    const gridTitle = this.isFinalClue
      ? '⚖️ Last Chance — Who Is the Mafioso?'
      : '🎯 Who is the criminal?';

    // Hint
    const hintText = this.isFinalClue
      ? 'Only two left. One of them did it. There are no more clues.'
      : '🏆 Pick the real criminal and WIN instantly! Wrong pick? That suspect clears their name.';

    // Button
    const btnLabel = this.isFinalClue
      ? "That's the One — Final Answer!"
      : "That's the Criminal!";

    const actionsHtml = confirmed
      ? `<div class="clue-actions">
           <button class="btn btn-gold" id="next-clue-btn" onclick="game.nextClue()">
             ${idx === 1 ? '🔍 &nbsp; Go to Final Clue →' : 'Next Clue →'}
           </button>
         </div>`
      : `<div class="clue-actions">
           <button class="btn btn-danger" id="confirm-btn" onclick="game.confirmPick()" ${!this.state.pickedId ? 'disabled' : ''}>
             ${btnLabel}
           </button>
         </div>`;

    this.el.innerHTML = `
      <div class="screen" style="--case-accent:${c.accentColor}">
        <div class="page-header">
          <button class="btn-back" onclick="game.goBack()">← Case</button>
          <span style="font-size:0.82rem; color:rgba(255,255,255,0.55)">${c.icon} ${c.title}</span>
        </div>
        <div class="clue-screen">

          <!-- Timeline -->
          <div class="clue-timeline">${timeline}</div>

          <!-- HUD -->
          <div class="detective-hud">
            <div class="hud-dot"></div>
            ${this.isFinalClue ? '⚖️ FINAL ROUND — LAST CHANCE TO CATCH THE CRIMINAL' : '🔴 NEW EVIDENCE — PICK THE CRIMINAL AND WIN RIGHT NOW'}
          </div>

          <!-- Evidence Card v2 -->
          <div class="evidence-card-v2">
            <div class="evidence-top">
              <span class="evidence-top-label">🔴 Evidence Found</span>
              <span class="evidence-top-num">Clue #${clue.number} of 3</span>
            </div>
            <div class="evidence-body">
              <div class="evidence-title-row">
                <div class="evidence-icon-badge">${clue.icon}</div>
                <h2 class="evidence-title-v2">${clue.title}</h2>
              </div>
              <p class="evidence-text-v2">${clue.text}</p>
            </div>
          </div>

          ${confirmed ? wrongBanner : ''}

          <!-- Suspects -->
          <div class="suspect-grid-hdr">
            <div class="suspect-grid-title">${gridTitle}</div>
            <div class="suspect-count-pill">${activeCount} REMAINING</div>
          </div>
          <p class="pick-hint">${hintText}</p>
          <div class="clue-suspects-grid">${suspectCards}</div>

          ${actionsHtml}
        </div>
      </div>`;
  }

  /* ── Verdict Screen ── */
  renderVerdict() {
    const c = this.caseData;
    const correct = this.state.isCorrect;
    const culprit = c.suspects.find(s => s.id === c.culprit);
    const picked = c.suspects.find(s => s.id === this.state.pickedId);

    const bgClass = correct ? 'win-bg' : 'lose-bg';
    const statusClass = correct ? 'win' : 'lose';
    const resultIcon = correct ? '🏆' : '😤';
    const headline = correct
      ? `You got them! ${culprit.name} is under arrest.`
      : `Wrong call. The criminal got away.`;
    const statusLabel = correct ? '✅ Case Solved!' : '❌ Wrong Accusation';
    const sub = correct
      ? 'Great work, detective. You read every clue and made the right call.'
      : `You pointed at ${picked.name}, but they were innocent. The real criminal is still out there.`;

    const culpritCard = `
      <div class="culprit-reveal-card">
        <div class="culprit-avatar" style="${this.avatarStyle(culprit)}">${culprit.initials}</div>
        <div class="culprit-info">
          <strong>${culprit.name}</strong>
          <span>${culprit.role}</span>
        </div>
        <div class="culprit-label-badge">THE MAFIOSO</div>
      </div>
      <p class="reveal-text">${c.culpritReveal}</p>`;

    const innocentSection = !correct ? `
      <div class="reveal-section" style="margin-top:24px;">
        <div class="reveal-label">The Truth About ${picked.name}</div>
        <p class="reveal-text innocent">${c.innocentReveal}</p>
      </div>` : '';

    const cardAnimation = !correct ? 'shake' : '';
    this.el.innerHTML = `
      <div class="screen verdict-screen">
        <div class="verdict-card ${cardAnimation}">
          <div class="verdict-hero ${bgClass}">
            <span class="verdict-result-icon">${resultIcon}</span>
            <div class="verdict-status ${statusClass}">${statusLabel}</div>
            <h1 class="verdict-headline">${headline}</h1>
            <p class="verdict-sub">${sub}</p>
          </div>
          <div class="verdict-body">
            <div class="reveal-section">
              <div class="reveal-label">Here's What Really Happened</div>
              ${culpritCard}
            </div>
            ${innocentSection}
            <div class="verdict-actions">
              <button class="btn btn-primary" id="other-case-btn" onclick="game.restart()">
                🗂️ &nbsp; Try Another Case
              </button>
              <button class="btn btn-outline" id="replay-btn" onclick="game.replayCase()">
                ↺ &nbsp; Play Again
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }
}

// Init
const game = new MafiosoGame();
