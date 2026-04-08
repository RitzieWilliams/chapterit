// ─── CUSTOMIZE FRAME ─────────────────────────────────────────────────────────

(function () {

  const FRAME_DATA = {
    marcus: {
      initials: 'MJ', firstname: 'Marcus', lastname: 'Johnson',
      season: '2024 \u2013 2025', level: 'Varsity',
      school: 'Lincoln High School', sport: 'Basketball',
      record: { w: 3, l: 1 },
      chapter: 'Junior Season 2024',
      allStats: [
        { label: 'PPG', value: '34.7' },
        { label: 'RPG', value: '8.9' },
        { label: 'APG', value: '4.7' },
        { label: 'SPG', value: '2.8' },
        { label: 'FG%', value: '52.1' },
        { label: '3PT', value: '2.3' },
      ],
      defaultStats: ['PPG', 'RPG', 'APG', 'SPG'],
      milestones: ['Season MVP', '30+ PPG Game', 'Triple-Double', 'Team Captain', 'All-District'],
      defaultMilestones: ['Season MVP'],
    },
    emma: {
      initials: 'ER', firstname: 'Emma', lastname: 'Rodriguez',
      season: '2023 \u2013 2024', level: 'U17 Elite',
      school: 'Metro FC Academy', sport: 'Soccer',
      record: { w: 11, l: 3 },
      chapter: 'Fall Classic 2023',
      allStats: [
        { label: 'Goals', value: '18' },
        { label: 'Assists', value: '11' },
        { label: 'CS', value: '7' },
        { label: 'Shots', value: '62' },
        { label: 'Mins', value: '740' },
        { label: 'YC', value: '1' },
      ],
      defaultStats: ['Goals', 'Assists', 'CS', 'Shots'],
      milestones: ['Top Scorer', 'Hat Trick', 'Player of the Week', 'All-Conference'],
      defaultMilestones: ['Top Scorer'],
    },
    tyler: {
      initials: 'TC', firstname: 'Tyler', lastname: 'Chen',
      season: 'Summer 2023', level: 'JV',
      school: 'Roosevelt Middle School', sport: 'Baseball',
      record: { w: 14, l: 6 },
      chapter: 'Summer League',
      allStats: [
        { label: 'AVG', value: '.342' },
        { label: 'HR', value: '9' },
        { label: 'RBI', value: '38' },
        { label: 'SB', value: '21' },
        { label: 'OBP', value: '.421' },
        { label: 'SLG', value: '.598' },
      ],
      defaultStats: ['AVG', 'HR', 'RBI', 'SB'],
      milestones: ['All-Star', 'Walk-off Hit', 'Most RBIs', 'Perfect Attendance'],
      defaultMilestones: ['All-Star'],
    },
  };

  const TEMPLATES = {
    gold:    { bar: 'linear-gradient(90deg, #c9a84c, #e8c96d, #c9a84c)', accent: '#c9a84c' },
    crimson: { bar: 'linear-gradient(90deg, #8B1F1F, #c94444, #8B1F1F)', accent: '#e05555' },
    navy:    { bar: 'linear-gradient(90deg, #1A366B, #2d5ba8, #1A366B)', accent: '#5B9BD5' },
    forest:  { bar: 'linear-gradient(90deg, #1A4D2E, #2e7a4f, #1A4D2E)', accent: '#5BAD72' },
    classic: { bar: 'linear-gradient(90deg, #444, #888, #444)',           accent: '#ccc' },
    violet:  { bar: 'linear-gradient(90deg, #5B2D8E, #8B5BC8, #5B2D8E)', accent: '#A07DD6' },
  };

  const OVERLAY_ID = 'customize-overlay';

  let _cid    = null;
  let _cstate = {};

  // ── Inject overlay HTML once ──────────────────────────────

  function _injectOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;
    const el = document.createElement('div');
    el.className = 'customize-overlay';
    el.id = OVERLAY_ID;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="customize-header">
        <button class="customize-close-btn" onclick="closeCustomize()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Close
        </button>
        <h2 class="customize-heading">Customize Frame</h2>
        <button class="customize-apply-btn" onclick="applyCustomize()">Apply Changes</button>
      </div>
      <div class="customize-body">

        <div class="customize-preview-pane">
          <p class="customize-pane-label">Preview</p>
          <div id="customize-preview-card"></div>
        </div>

        <div class="customize-options-pane">

          <div class="customize-section">
            <h3 class="customize-section-title">Photo</h3>
            <div class="customize-drop-zone" id="customize-drop-zone">
              <svg class="customize-drop-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <span class="customize-drop-label">Drop your photo here</span>
              <span class="customize-drop-hint">or</span>
              <button class="customize-browse-btn" type="button" onclick="document.getElementById('customize-file-input').click()">Browse Files</button>
              <input type="file" id="customize-file-input" accept="image/*" hidden>
            </div>
            <div class="customize-photo-preview" id="customize-photo-preview" style="display:none">
              <img class="customize-photo-thumb" id="customize-photo-img" src="" alt="Uploaded photo">
              <span class="customize-photo-name" id="customize-photo-name"></span>
              <button class="customize-photo-remove" type="button" onclick="removeCustomPhoto()">Remove</button>
            </div>
          </div>

          <div class="customize-section">
            <h3 class="customize-section-title">Template</h3>
            <div class="customize-templates" id="customize-templates">
              <button class="customize-tpl is-active" data-tpl="gold" type="button" onclick="selectTemplate('gold', this)">
                <span class="customize-tpl-swatch" style="background:linear-gradient(135deg,#c9a84c 0%,#e8c96d 50%,#c9a84c 100%)"></span>
                <span class="customize-tpl-name">Gold</span>
              </button>
              <button class="customize-tpl" data-tpl="crimson" type="button" onclick="selectTemplate('crimson', this)">
                <span class="customize-tpl-swatch" style="background:linear-gradient(135deg,#8B1F1F,#c94444)"></span>
                <span class="customize-tpl-name">Crimson</span>
              </button>
              <button class="customize-tpl" data-tpl="navy" type="button" onclick="selectTemplate('navy', this)">
                <span class="customize-tpl-swatch" style="background:linear-gradient(135deg,#1A366B,#2d5ba8)"></span>
                <span class="customize-tpl-name">Navy</span>
              </button>
              <button class="customize-tpl" data-tpl="forest" type="button" onclick="selectTemplate('forest', this)">
                <span class="customize-tpl-swatch" style="background:linear-gradient(135deg,#1A4D2E,#2e7a4f)"></span>
                <span class="customize-tpl-name">Forest</span>
              </button>
              <button class="customize-tpl" data-tpl="classic" type="button" onclick="selectTemplate('classic', this)">
                <span class="customize-tpl-swatch" style="background:linear-gradient(135deg,#222,#555)"></span>
                <span class="customize-tpl-name">Classic</span>
              </button>
              <button class="customize-tpl" data-tpl="violet" type="button" onclick="selectTemplate('violet', this)">
                <span class="customize-tpl-swatch" style="background:linear-gradient(135deg,#5B2D8E,#8B5BC8)"></span>
                <span class="customize-tpl-name">Violet</span>
              </button>
            </div>
          </div>

          <div class="customize-section">
            <h3 class="customize-section-title">
              Stats
              <span class="customize-section-limit">Select up to 4</span>
            </h3>
            <div class="customize-pills" id="customize-stats-pills"></div>
          </div>

          <div class="customize-section">
            <h3 class="customize-section-title">Milestones</h3>
            <div class="customize-pills" id="customize-milestones-pills"></div>
          </div>

        </div>
      </div>`;
    document.body.appendChild(el);

    // File input listener (attached once after injection)
    document.getElementById('customize-file-input').addEventListener('change', e => {
      _loadPhoto(e.target.files[0]);
    });

    // Drag and drop
    const dropZone = document.getElementById('customize-drop-zone');
    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.classList.add('is-dragging');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('is-dragging'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('is-dragging');
      _loadPhoto(e.dataTransfer.files[0]);
    });
  }

  // ── Open / Close ──────────────────────────────────────────

  window.openCustomize = function (id) {
    _injectOverlay();

    _cid = id;
    const data = FRAME_DATA[id];
    _cstate = {
      tpl: 'gold',
      photo: null,
      activeStats: [...data.defaultStats],
      activeMilestones: [...data.defaultMilestones],
    };

    _renderPreview();
    _renderStatsPills(data);
    _renderMilestonePills(data);

    // Reset template to gold
    document.querySelectorAll('.customize-tpl').forEach(b => b.classList.remove('is-active'));
    document.querySelector('.customize-tpl[data-tpl="gold"]').classList.add('is-active');

    // Reset photo UI
    document.getElementById('customize-photo-preview').style.display = 'none';
    document.getElementById('customize-drop-zone').style.display = '';
    document.getElementById('customize-file-input').value = '';

    const overlay = document.getElementById(OVERLAY_ID);
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeCustomize = function () {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  window.applyCustomize = function () {
    // TODO: persist selection to backend / update live frame card
    closeCustomize();
  };

  // ── Render preview card ───────────────────────────────────

  function _renderPreview() {
    const data = FRAME_DATA[_cid];
    const tpl  = TEMPLATES[_cstate.tpl];

    const statsHtml = data.allStats
      .filter(s => _cstate.activeStats.includes(s.label))
      .map(s => `
        <div class="frame-stat">
          <span class="frame-stat-value" style="color:${tpl.accent}">${s.value}</span>
          <span class="frame-stat-label">${s.label}</span>
        </div>`).join('');

    const milestonesHtml = data.milestones
      .filter(m => _cstate.activeMilestones.includes(m))
      .map(m => `<span class="frame-milestone-tag">${m}</span>`).join('');

    const photoStyle = _cstate.photo
      ? `background-image:url('${_cstate.photo}');background-size:cover;background-position:center top;`
      : '';

    const statCols = Math.min(_cstate.activeStats.length || 1, 4);

    document.getElementById('customize-preview-card').innerHTML = `
      <div class="frame-card-accent-bar" style="background:${tpl.bar}"></div>
      <div class="frame-card-top">
        <span class="frame-card-season">${data.season}</span>
        <span class="frame-card-level" style="color:${tpl.accent}">${data.level}</span>
      </div>
      <div class="frame-card-name-block" style="${photoStyle}">
        ${photoStyle ? '<div class="frame-card-photo-overlay"></div>' : ''}
        <div class="frame-card-initials">${data.initials}</div>
        <p class="frame-card-firstname">${data.firstname}</p>
        <p class="frame-card-lastname">${data.lastname}</p>
      </div>
      <div class="frame-card-team-block">
        <span class="frame-card-school">${data.school}</span>
        <span class="frame-card-sport">${data.sport}</span>
      </div>
      <div class="frame-card-divider"></div>
      <div class="frame-card-record">
        <div class="frame-record-col">
          <span class="frame-record-num">${data.record.w}</span>
          <span class="frame-record-label">W</span>
        </div>
        <span class="frame-record-dash">&mdash;</span>
        <div class="frame-record-col">
          <span class="frame-record-num">${data.record.l}</span>
          <span class="frame-record-label">L</span>
        </div>
        <span class="frame-record-tag">Season Record</span>
      </div>
      <div class="frame-card-divider"></div>
      <div class="frame-card-stats" style="grid-template-columns:repeat(${statCols},1fr)">
        ${statsHtml || '<div class="frame-stat"><span class="frame-stat-label" style="color:rgba(255,255,255,0.2)">No stats selected</span></div>'}
      </div>
      ${milestonesHtml ? `<div class="frame-card-milestones">${milestonesHtml}</div>` : ''}
      <div class="frame-card-footer">
        <span class="frame-card-chapter-name">${data.chapter}</span>
        <span class="frame-card-brand">ChapterIt</span>
      </div>`;
  }

  // ── Pill builders ─────────────────────────────────────────

  function _renderStatsPills(data) {
    document.getElementById('customize-stats-pills').innerHTML =
      data.allStats.map(s => `
        <button class="customize-pill${_cstate.activeStats.includes(s.label) ? ' is-active' : ''}"
          data-stat="${s.label}" type="button" onclick="toggleStat('${s.label}', this)">
          ${s.label}
        </button>`).join('');
  }

  function _renderMilestonePills(data) {
    document.getElementById('customize-milestones-pills').innerHTML =
      data.milestones.map(m => `
        <button class="customize-pill${_cstate.activeMilestones.includes(m) ? ' is-active' : ''}"
          type="button" onclick="toggleMilestone(${JSON.stringify(m)}, this)">
          ${m}
        </button>`).join('');
  }

  // ── Interactions ──────────────────────────────────────────

  window.selectTemplate = function (tpl, btn) {
    _cstate.tpl = tpl;
    document.querySelectorAll('.customize-tpl').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    _renderPreview();
  };

  window.toggleStat = function (label, btn) {
    const idx = _cstate.activeStats.indexOf(label);
    if (idx === -1) {
      if (_cstate.activeStats.length >= 4) {
        btn.classList.add('is-disabled');
        setTimeout(() => btn.classList.remove('is-disabled'), 600);
        return;
      }
      _cstate.activeStats.push(label);
      btn.classList.add('is-active');
    } else {
      _cstate.activeStats.splice(idx, 1);
      btn.classList.remove('is-active');
    }
    _renderPreview();
  };

  window.toggleMilestone = function (name, btn) {
    const idx = _cstate.activeMilestones.indexOf(name);
    if (idx === -1) {
      _cstate.activeMilestones.push(name);
      btn.classList.add('is-active');
    } else {
      _cstate.activeMilestones.splice(idx, 1);
      btn.classList.remove('is-active');
    }
    _renderPreview();
  };

  // ── Photo upload ──────────────────────────────────────────

  function _loadPhoto(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => {
      _cstate.photo = ev.target.result;
      document.getElementById('customize-photo-img').src = ev.target.result;
      document.getElementById('customize-photo-name').textContent = file.name;
      document.getElementById('customize-photo-preview').style.display = 'flex';
      document.getElementById('customize-drop-zone').style.display = 'none';
      _renderPreview();
    };
    reader.readAsDataURL(file);
  }

  window.removeCustomPhoto = function () {
    _cstate.photo = null;
    document.getElementById('customize-photo-preview').style.display = 'none';
    document.getElementById('customize-drop-zone').style.display = '';
    document.getElementById('customize-file-input').value = '';
    _renderPreview();
  };

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById(OVERLAY_ID);
      if (overlay && overlay.classList.contains('is-open')) closeCustomize();
    }
  });

})();
