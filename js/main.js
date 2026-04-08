// ─── MOBILE DRAWER ─────────────────────────────────
const hamburger = document.getElementById('dash-hamburger');
const drawer    = document.getElementById('dash-drawer');
const overlay   = document.getElementById('dash-drawer-overlay');
const drawerClose = document.getElementById('dash-drawer-close');

function openDrawer() {
  drawer.classList.add('is-open');
  overlay.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
}

function closeDrawer() {
  drawer.classList.remove('is-open');
  overlay.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
}

if (hamburger) hamburger.addEventListener('click', openDrawer);
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
if (overlay) overlay.addEventListener('click', closeDrawer);

// ─── NAV SCROLL STATE ──────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ─── FADE-UP ON SCROLL ─────────────────────────────
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

fadeEls.forEach(el => observer.observe(el));

// ─── NOTIFICATIONS PANEL ───────────────────────────
const notifBtn     = document.getElementById('notif-btn');
const notifPanel   = document.getElementById('notif-panel');
const notifBdrop   = document.getElementById('notif-backdrop');

function openNotifPanel() {
  if (!notifPanel) return;
  notifPanel.classList.add('is-open');
  notifPanel.setAttribute('aria-hidden', 'false');
  notifBdrop.classList.add('is-open');
}
function closeNotifPanel() {
  if (!notifPanel) return;
  notifPanel.classList.remove('is-open');
  notifPanel.setAttribute('aria-hidden', 'true');
  notifBdrop.classList.remove('is-open');
}

if (notifBtn) {
  notifBtn.addEventListener('click', e => {
    e.stopPropagation();
    notifPanel.classList.contains('is-open') ? closeNotifPanel() : openNotifPanel();
  });
}
if (notifBdrop) notifBdrop.addEventListener('click', closeNotifPanel);

const notifMarkAll = document.getElementById('notif-mark-all');
if (notifMarkAll) {
  notifMarkAll.addEventListener('click', () => {
    document.querySelectorAll('.notif-item').forEach(el => el.classList.remove('notif-item--unread'));
    document.querySelectorAll('.notif-dot').forEach(el => el.style.visibility = 'hidden');
    const badge = document.querySelector('.dash-badge');
    if (badge) badge.textContent = '0';
    closeNotifPanel();
  });
}

// ─── AUTH TABS ─────────────────────────────────────
const tabs = document.querySelectorAll('.auth-tab');
const panels = document.querySelectorAll('.auth-panel');

function switchTab(tabName) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
  panels.forEach(p => p.classList.toggle('active', p.id === `panel-${tabName}`));
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

// In-panel switch links
const gotoSignin = document.getElementById('goto-signin');
const gotoSignup = document.getElementById('goto-signup');

if (gotoSignin) gotoSignin.addEventListener('click', (e) => { e.preventDefault(); switchTab('signin'); });
if (gotoSignup) gotoSignup.addEventListener('click', (e) => { e.preventDefault(); switchTab('signup'); });

// ─── FORM SUBMIT (PLACEHOLDER) ─────────────────────
const formSignup = document.getElementById('form-signup');
const formSignin = document.getElementById('form-signin');

if (formSignup) {
  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = formSignup.querySelector('.btn-form');
    btn.textContent = 'Creating account…';
    btn.disabled = true;
    // TODO: wire to backend
    setTimeout(() => {
      btn.textContent = 'Create Account';
      btn.disabled = false;
    }, 2000);
  });
}

// ─── RECOGNITION APPROVAL ──────────────────────────
(function () {
  const MODAL_ID = 'recognition-approval-modal';

  // Mock data — replace with real data from backend
  const CHAPTERS = [
    { id: 'ch1', name: 'Junior Season 2024', sport: 'Basketball', athlete: 'Marcus Johnson',
      entries: [
        { id: 'g1', type: 'Game',  label: 'Season Opener',  date: 'Oct 5, 2024' },
        { id: 'e1', type: 'Event', label: 'Fall Showcase',  date: 'Nov 10, 2024' },
      ]
    },
    { id: 'ch2', name: 'Fall Classic 2023', sport: 'Soccer',      athlete: 'Emma Rodriguez', entries: [] },
    { id: 'ch3', name: 'Summer League',     sport: 'Baseball',    athlete: 'Tyler Chen',     entries: [] },
  ];

  let _selectedChapter = null;

  // ── Inject modal shell once ──────────────────────
  function injectModal() {
    if (document.getElementById(MODAL_ID)) return;
    const el = document.createElement('div');
    el.className = 'modal-overlay';
    el.id = MODAL_ID;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="modal recognition-approval-modal" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
        <div id="recog-step-1">
          <h2 class="modal-title">Approve Recognition</h2>
          <p class="recog-step-label">Select a chapter</p>
          <div class="recog-chapter-list" id="recog-chapter-list"></div>
          <div class="modal-actions">
            <button class="btn-modal-confirm" id="recog-next-btn" onclick="_recognitionNext()" disabled>Next</button>
            <button class="btn-modal-cancel" onclick="closeRecognitionApproval()">Cancel</button>
          </div>
        </div>
        <div id="recog-step-2" style="display:none;">
          <h2 class="modal-title">Approve Recognition</h2>
          <p class="recog-step-label">Attach to a specific game or event <span class="recog-optional">(optional)</span></p>
          <div class="recog-entry-list" id="recog-entry-list"></div>
          <div class="modal-actions">
            <button class="btn-modal-confirm" onclick="_recognitionConfirm()">Confirm</button>
            <button class="btn-modal-cancel" onclick="_recognitionBack()">Back</button>
          </div>
        </div>
      </div>`;
    el.addEventListener('click', function (e) {
      if (e.target === el) closeRecognitionApproval();
    });
    document.body.appendChild(el);
    _buildChapterList();
  }

  function _buildChapterList() {
    const list = document.getElementById('recog-chapter-list');
    list.innerHTML = CHAPTERS.map(ch => `
      <button class="recog-chapter-item" data-id="${ch.id}" onclick="_selectChapter('${ch.id}', this)">
        <span class="recog-chapter-sport">${ch.sport}</span>
        <span class="recog-chapter-name">${ch.name}</span>
        <span class="recog-chapter-athlete">${ch.athlete}</span>
      </button>`).join('');
  }

  window._selectChapter = function (id, el) {
    _selectedChapter = CHAPTERS.find(c => c.id === id);
    document.querySelectorAll('.recog-chapter-item').forEach(b => b.classList.remove('is-selected'));
    el.classList.add('is-selected');
    document.getElementById('recog-next-btn').disabled = false;
  };

  window._recognitionNext = function () {
    if (!_selectedChapter) return;
    document.getElementById('recog-step-1').style.display = 'none';
    const step2 = document.getElementById('recog-step-2');
    step2.style.display = '';
    const list = document.getElementById('recog-entry-list');
    if (_selectedChapter.entries.length === 0) {
      list.innerHTML = '<p class="recog-empty">No games or events in this chapter yet.</p>';
    } else {
      list.innerHTML = `
        <button class="recog-entry-item recog-entry-item--none is-selected" data-id="" onclick="_selectEntry('', this)">
          Attach to chapter only
        </button>` +
        _selectedChapter.entries.map(e => `
        <button class="recog-entry-item" data-id="${e.id}" onclick="_selectEntry('${e.id}', this)">
          <span class="recog-entry-type">${e.type}</span>
          <span class="recog-entry-label">${e.label}</span>
          <span class="recog-entry-date">${e.date}</span>
        </button>`).join('');
    }
  };

  window._selectEntry = function (id, el) {
    document.querySelectorAll('.recog-entry-item').forEach(b => b.classList.remove('is-selected'));
    el.classList.add('is-selected');
  };

  window._recognitionBack = function () {
    document.getElementById('recog-step-2').style.display = 'none';
    document.getElementById('recog-step-1').style.display = '';
  };

  window._recognitionConfirm = function () {
    closeRecognitionApproval();
    // TODO: wire to backend with _selectedChapter and selected entry
  };

  // ── Public API ───────────────────────────────────
  window.openRecognitionApproval = function () {
    injectModal();
    _selectedChapter = null;
    document.querySelectorAll('.recog-chapter-item').forEach(b => b.classList.remove('is-selected'));
    document.getElementById('recog-next-btn').disabled = true;
    document.getElementById('recog-step-1').style.display = '';
    document.getElementById('recog-step-2').style.display = 'none';
    const modal = document.getElementById(MODAL_ID);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeRecognitionApproval = function () {
    const modal = document.getElementById(MODAL_ID);
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  };

  window.declineRecognition = function (btn) {
    const item = btn.closest('.notif-item');
    if (item) {
      item.style.transition = 'opacity 0.2s ease';
      item.style.opacity = '0';
      setTimeout(() => item.remove(), 200);
    }
  };
})();

if (formSignin) {
  formSignin.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = formSignin.querySelector('.btn-form');
    btn.textContent = 'Signing in…';
    btn.disabled = true;
    // TODO: wire to backend
    setTimeout(() => {
      btn.textContent = 'Sign In';
      btn.disabled = false;
    }, 2000);
  });
}
