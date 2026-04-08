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
