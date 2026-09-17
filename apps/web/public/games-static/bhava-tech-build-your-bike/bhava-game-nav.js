// ─────────────────────────────────────────────────────────────────────────────
// bhava-game-nav.js  — Universal Game Navigation Bar for Medhā
// Drop ONE <script src="bhava-game-nav.js"></script> before </body> in any game
// Provides: ← Back, 🏠 Home, 📊 My Report (IPC-aware with live score modal)
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = [
    '#bhava-game-nav{position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;',
    'align-items:center;gap:8px;padding:6px 14px;height:44px;',
    'background:rgba(10,8,20,0.85);backdrop-filter:blur(14px);',
    '-webkit-backdrop-filter:blur(14px);',
    'border-bottom:1px solid rgba(255,255,255,0.08);',
    "font-family:'Poppins','Inter',sans-serif;}",

    '#bhava-game-nav .bgnav-btn{display:inline-flex;align-items:center;gap:5px;',
    'padding:5px 13px;border-radius:999px;font-size:12px;font-weight:700;',
    'letter-spacing:.04em;border:1px solid transparent;cursor:pointer;',
    'transition:background .18s,border-color .18s,transform .15s;',
    'white-space:nowrap;font-family:inherit;background:none;}',
    '#bhava-game-nav .bgnav-btn:active{transform:scale(.95);}',

    '#bhava-game-nav .bgnav-back{background:rgba(255,255,255,.05);',
    'border-color:rgba(255,255,255,.12);color:#94a3b8;}',
    '#bhava-game-nav .bgnav-back:hover{background:rgba(255,255,255,.12);',
    'border-color:rgba(255,255,255,.28);color:#e2e8f0;}',

    '#bhava-game-nav .bgnav-home{background:rgba(109,40,217,.18);',
    'border-color:rgba(167,139,250,.35);color:#c4b5fd;}',
    '#bhava-game-nav .bgnav-home:hover{background:rgba(109,40,217,.35);',
    'border-color:rgba(167,139,250,.65);color:#e9d5ff;}',

    '#bhava-game-nav .bgnav-next{background:rgba(16,185,129,.15);',
    'border-color:rgba(52,211,153,.4);color:#6ee7b7;}',
    '#bhava-game-nav .bgnav-next:hover{background:rgba(16,185,129,.3);',
    'border-color:rgba(52,211,153,.7);color:#a7f3d0;}',
    '#bhava-game-nav .bgnav-next.bgnav-disabled{opacity:.35;cursor:not-allowed;',
    'pointer-events:none;}',

    '#bhava-game-nav .bgnav-title{font-size:11px;font-weight:600;',
    'color:rgba(255,255,255,.28);letter-spacing:.08em;text-transform:uppercase;',
    'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
    'text-align:center;}',

    '#bhava-game-nav .bgnav-report{background:rgba(1,105,111,.18);',
    'border-color:rgba(79,152,163,.4);color:#67e8f9;margin-left:auto;}',
    '#bhava-game-nav .bgnav-report:hover{background:rgba(1,105,111,.35);',
    'border-color:rgba(79,152,163,.7);color:#a5f3fc;}',
    '#bhava-game-nav .bgnav-report.bgnav-hidden{display:none;}',
    '#bhava-game-nav .bgnav-next.bgnav-hidden{display:none;}',

    // ── No spacer div — use body padding instead to avoid breaking game layouts
    // '#bhava-game-nav-spacer' intentionally removed

    '#bgnav-modal{display:none;position:fixed;inset:0;z-index:10000;',
    'background:rgba(5,5,15,.9);backdrop-filter:blur(18px);',
    '-webkit-backdrop-filter:blur(18px);align-items:center;justify-content:center;',
    "padding:20px;font-family:'Poppins','Inter',sans-serif;}",
    '#bgnav-modal.bgnav-open{display:flex;}',

    '#bgnav-modal-inner{background:linear-gradient(145deg,#0f0e1a,#1a1630);',
    'border:1px solid rgba(167,139,250,.25);border-radius:20px;',
    'padding:28px 24px;width:100%;max-width:460px;',
    'box-shadow:0 24px 64px rgba(0,0,0,.5);}',

    '#bgnav-modal-inner h3{font-size:18px;font-weight:800;color:#e2e8f0;',
    'margin:0 0 4px;display:flex;align-items:center;gap:8px;}',
    '.bgnav-msub{font-size:12px;color:#64748b;margin-bottom:20px;}',

    '.bgnav-srow{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:18px;}',
    '.bgnav-sc{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);',
    'border-radius:14px;padding:14px 10px;text-align:center;}',
    '.bgnav-sc .sl{font-size:10px;font-weight:700;letter-spacing:.1em;',
    'text-transform:uppercase;color:#64748b;margin-bottom:6px;}',
    '.bgnav-sc .sv{font-size:24px;font-weight:800;font-variant-numeric:tabular-nums;',
    'line-height:1;}',
    '.bgnav-sc.iq .sv{color:#818cf8;}.bgnav-sc.eq .sv{color:#f472b6;}',
    '.bgnav-sc.sq .sv{color:#34d399;}',

    '.bgnav-slbl{font-size:10px;font-weight:700;letter-spacing:.08em;',
    'text-transform:uppercase;color:#475569;margin-bottom:8px;}',
    '.bgnav-si{display:flex;align-items:center;justify-content:space-between;',
    'padding:8px 12px;background:rgba(255,255,255,.03);border-radius:10px;',
    'margin-bottom:6px;font-size:12px;color:#94a3b8;',
    'border:1px solid rgba(255,255,255,.05);}',
    '.bgnav-si .sg{font-weight:600;color:#c4b5fd;}',
    '.bgnav-si .ss{color:#fde68a;font-weight:700;}',

    '.bgnav-actions{display:flex;gap:10px;margin-top:18px;}',
    '.bgnav-actions button{flex:1;padding:10px;border-radius:10px;font-size:13px;',
    'font-weight:700;cursor:pointer;font-family:inherit;border:none;',
    'transition:opacity .2s;}',
    '.bgnav-actions button:hover{opacity:.85;}',
    '.bgnav-btn-close{background:rgba(255,255,255,.08)!important;',
    'color:#94a3b8!important;border:1px solid rgba(255,255,255,.1)!important;}',
    '.bgnav-btn-home-m{background:linear-gradient(135deg,#6d28d9,#06b6d4);color:#fff;}',

    '.bgnav-info{text-align:center;color:#475569;font-size:13px;',
    'padding:18px;border:1px dashed rgba(255,255,255,.08);border-radius:12px;}',
    '.bgnav-loading{text-align:center;color:#475569;font-size:13px;padding:18px 0;}',
  ].join('');
  document.head.appendChild(style);

  // ── Nav bar ────────────────────────────────────────────────────────────────
  const gameTitle = (document.title || 'Game').replace(/bhava|tech/gi, '').trim().slice(0, 32);
  const nav = document.createElement('div');
  nav.id = 'bhava-game-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Game navigation');
  nav.innerHTML =
    '<button class="bgnav-btn bgnav-back" id="bgnav-back" aria-label="Go back">&#8592; Back</button>' +
    '<button class="bgnav-btn bgnav-home" id="bgnav-home" aria-label="Go home">&#127968; Home</button>' +
    '<button class="bgnav-btn bgnav-next bgnav-hidden" id="bgnav-next" aria-label="Next">Next &#8594;</button>' +
    '<span class="bgnav-title">' + gameTitle + '</span>' +
    '<button class="bgnav-btn bgnav-report bgnav-hidden" id="bgnav-report" aria-label="My report">&#128202; My Report</button>';

  // Insert nav at top — use body padding instead of a spacer div so game
  // layouts using position:fixed / height:100vh are not broken
  document.body.insertBefore(nav, document.body.firstChild);
  var existingPadding = parseFloat(document.body.style.paddingTop) || 0;
  document.body.style.paddingTop = (existingPadding + 44) + 'px';

  // ── Report modal ───────────────────────────────────────────────────────────
  const modal = document.createElement('div');
  modal.id = 'bgnav-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML =
    '<div id="bgnav-modal-inner">' +
      '<h3>&#128202; My Report</h3>' +
      '<div class="bgnav-msub" id="bgnav-msub">Your cognitive scores</div>' +
      '<div id="bgnav-mbody"><div class="bgnav-loading">Fetching scores…</div></div>' +
      '<div class="bgnav-actions">' +
        '<button class="bgnav-btn-close" id="bgnav-mclose">&#10005; Close</button>' +
        '<button class="bgnav-btn-home-m" id="bgnav-mhome">&#127968; Go Home</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);

  // ── In-game screen history ──────────────────────────────────────────────────
  // Many games swap full-screen "pages" in place (e.g. `.screen.active`,
  // `.level-section.active-level`) without ever touching browser history, so a
  // real `history.back()` skips straight past all of them to the previous SITE
  // page. We watch for these class-toggle conventions and let Back step
  // through them one at a time first, only leaving the game once there are no
  // more internal screens left to go back to.
  var _screenStack = [];
  var _trackedGroups = [];
  var _restoring = false;

  function trackScreens(selector, activeClass) {
    _trackedGroups.push({ selector: selector, activeClass: activeClass, lastEl: document.querySelector(selector + '.' + activeClass) });
  }

  function syncScreenGroups() {
    if (_restoring) return;
    _trackedGroups.forEach(function (g) {
      var current = document.querySelector(g.selector + '.' + g.activeClass);
      if (current !== g.lastEl) {
        if (g.lastEl) _screenStack.push({ selector: g.selector, activeClass: g.activeClass, el: g.lastEl });
        g.lastEl = current;
      }
    });
  }

  // Built-in conventions used across most Medhā/Bhava games — opt-in extra
  // conventions via `window.BhavaNav.trackScreens(selector, activeClass)`.
  trackScreens('.screen', 'active');
  trackScreens('.level-section', 'active-level');

  new MutationObserver(syncScreenGroups).observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });

  function internalBack() {
    syncScreenGroups();
    if (_screenStack.length === 0) return false;
    var entry = _screenStack.pop();
    _restoring = true;
    document.querySelectorAll(entry.selector + '.' + entry.activeClass).forEach(function (el) { el.classList.remove(entry.activeClass); });
    entry.el.classList.add(entry.activeClass);
    _trackedGroups.forEach(function (g) { if (g.selector === entry.selector && g.activeClass === entry.activeClass) g.lastEl = entry.el; });
    entry.el.dispatchEvent(new CustomEvent('bhava:screen-restored', { bubbles: true, detail: { selector: entry.selector, activeClass: entry.activeClass } }));
    setTimeout(function () { _restoring = false; }, 0);
    return true;
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  function goHome() { window.location.href = '/student'; }
  function goBack() { if (internalBack()) return; window.history.length > 1 ? window.history.back() : goHome(); }

  // ── Opt-in Next button (hidden until a game wires it up) ────────────────────
  // Deliberately does nothing on its own: a game must call `BhavaNav.setNext(fn)`
  // to show it, and `BhavaNav.setNextEnabled(bool)` to gate it — so any existing
  // in-game "Next Level"/completion logic is never bypassed or duplicated.
  var nextHandler = null;
  document.getElementById('bgnav-next').addEventListener('click', function () { if (nextHandler) nextHandler(); });

  document.getElementById('bgnav-back').addEventListener('click', goBack);
  document.getElementById('bgnav-home').addEventListener('click', goHome);
  document.getElementById('bgnav-mclose').addEventListener('click', function () { modal.classList.remove('bgnav-open'); });
  document.getElementById('bgnav-mhome').addEventListener('click', goHome);
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('bgnav-open'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.remove('bgnav-open'); });

  // ── Student ID resolution (checks all possible sources) ───────────────────
  function resolveStudentId() {
    // 1. Direct window variable (set by BhavaNav.setStudent or bhava-session bridge)
    if (window._bhavaStudentId) return String(window._bhavaStudentId);

    // 2. sessionStorage key written by bhava-session.js bridge
    try {
      var ss = sessionStorage.getItem('bhavaStudentId');
      if (ss) return ss;
    } catch (e) {}

    // 3. BhavaSession public API (most reliable — reads currentStudent directly)
    if (window.BhavaSession && typeof window.BhavaSession.getStudent === 'function') {
      var st = window.BhavaSession.getStudent();
      if (st && st.id) return String(st.id);
    }

    return null;
  }

  // ── Report fetch ───────────────────────────────────────────────────────────
  var MEDHAA_API_URL = 'https://medhaa-tni1.onrender.com/api';

  function medhaaToken() {
    try { return localStorage.getItem('accessToken'); } catch (e) { return null; }
  }

  async function openReportFromMedhaa(body, sub) {
    sub.textContent = 'Your Medhā activity';
    try {
      var res = await fetch(MEDHAA_API_URL + '/games/history?limit=5', {
        headers: { 'Authorization': 'Bearer ' + medhaaToken() }
      });
      if (!res.ok) throw new Error('Request failed (' + res.status + ')');
      var data = await res.json();
      var s = data.summary || {};

      var sessH = !data.sessions || data.sessions.length === 0
        ? '<div class="bgnav-info">No sessions yet. Start playing!</div>'
        : data.sessions.map(function (sess) {
            var d = sess.startedAt
              ? new Date(sess.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
              : '';
            return '<div class="bgnav-si">'
              + '<span class="sg">' + (sess.gameName || 'Game') + '</span>'
              + '<span class="ss">' + (sess.score ?? '—') + ' pts</span>'
              + '<span>' + d + '</span>'
              + '</div>';
          }).join('');

      body.innerHTML =
        '<div class="bgnav-srow">'
          + '<div class="bgnav-sc iq"><div class="sl">Played</div><div class="sv">' + (s.gamesCompleted ?? 0) + '</div></div>'
          + '<div class="bgnav-sc eq"><div class="sl">Avg Score</div><div class="sv">' + (s.averageScore ?? '—') + '</div></div>'
          + '<div class="bgnav-sc sq"><div class="sl">Best Score</div><div class="sv">' + (s.bestScore ?? '—') + '</div></div>'
        + '</div>'
        + '<div class="bgnav-slbl">Recent Sessions</div>'
        + sessH;
    } catch (err) {
      body.innerHTML = '<div class="bgnav-info">Error: ' + err.message + '</div>';
    }
  }

  async function openReport() {
    modal.classList.add('bgnav-open');
    var body = document.getElementById('bgnav-mbody');
    var sub  = document.getElementById('bgnav-msub');
    body.innerHTML = '<div class="bgnav-loading">Fetching scores from Medhā…</div>';

    // Prefer the current Medhā login (web + Android) over the legacy Electron IPC path.
    if (medhaaToken()) {
      await openReportFromMedhaa(body, sub);
      return;
    }

    if (!window.bhava) {
      body.innerHTML = '<div class="bgnav-info">Not logged in.<br>Please log in from Home first.</div>';
      return;
    }

    var sid = resolveStudentId();
    if (!sid) {
      body.innerHTML = '<div class="bgnav-info">Not logged in.<br>Please log in from Home first.</div>';
      return;
    }

    sub.textContent = 'Student ID: ' + sid;
    try {
      var res = await Promise.allSettled([
        window.bhava.getIQScores(sid),
        window.bhava.getEQScores(sid),
        window.bhava.getSQScores(sid),
        window.bhava.getGameSessions(sid)
      ]);

      function fmtScore(r) {
        if (r.status !== 'fulfilled' || !r.value) return '—';
        var v = r.value;
        var s = v.iq_score ?? v.eq_score ?? v.sq_score ?? v.score ?? v;
        return typeof s === 'number' ? Math.round(s) : '—';
      }

      var list = res[3].status === 'fulfilled' && Array.isArray(res[3].value)
        ? res[3].value.slice(0, 5) : [];

      var sessH = list.length === 0
        ? '<div class="bgnav-info">No sessions yet. Start playing!</div>'
        : list.map(function (s) {
            var d = s.played_at
              ? new Date(s.played_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
              : '';
            return '<div class="bgnav-si">'
              + '<span class="sg">' + (s.game_name || s.gameName || 'Game') + '</span>'
              + '<span class="ss">' + (s.raw_score ?? s.score ?? '—') + ' pts</span>'
              + '<span>' + d + '</span>'
              + '</div>';
          }).join('');

      body.innerHTML =
        '<div class="bgnav-srow">'
          + '<div class="bgnav-sc iq"><div class="sl">IQ</div><div class="sv">' + fmtScore(res[0]) + '</div></div>'
          + '<div class="bgnav-sc eq"><div class="sl">EQ</div><div class="sv">' + fmtScore(res[1]) + '</div></div>'
          + '<div class="bgnav-sc sq"><div class="sl">SQ</div><div class="sv">' + fmtScore(res[2]) + '</div></div>'
        + '</div>'
        + '<div class="bgnav-slbl">Recent Sessions</div>'
        + sessH;
    } catch (err) {
      body.innerHTML = '<div class="bgnav-info">Error: ' + err.message + '</div>';
    }
  }

  document.getElementById('bgnav-report').addEventListener('click', openReport);

  // ── Show Report button once logged in (Medhā web/Android, or Electron IPC) ──
  function checkReady() {
    if (medhaaToken()) {
      document.getElementById('bgnav-report').classList.remove('bgnav-hidden');
      return true;
    }
    if (!window.bhava) return false;
    var sid = resolveStudentId();
    if (sid) {
      document.getElementById('bgnav-report').classList.remove('bgnav-hidden');
      return true;
    }
    return false;
  }

  var checks = 0;
  var poll = setInterval(function () {
    if (checkReady() || ++checks > 40) clearInterval(poll);
  }, 250);

  // ── Public API ─────────────────────────────────────────────────────────────
  window.BhavaNav = {
    setStudent: function (id) {
      window._bhavaStudentId = String(id);
      try { sessionStorage.setItem('bhavaStudentId', String(id)); } catch (e) {}
      document.getElementById('bgnav-report').classList.remove('bgnav-hidden');
    },
    openReport: openReport,
    goHome:     goHome,
    goBack:     goBack,
    // Register an extra screen-toggle convention for the in-game Back stack
    // (built-in: '.screen'/'active' and '.level-section'/'active-level').
    trackScreens: trackScreens,
    // Opt-in Next button — games own the handler AND the enabled/disabled state,
    // so their existing next-level/completion gating logic stays in full control.
    setNext: function (handler) {
      nextHandler = typeof handler === 'function' ? handler : null;
      document.getElementById('bgnav-next').classList.toggle('bgnav-hidden', !nextHandler);
    },
    setNextEnabled: function (enabled) {
      document.getElementById('bgnav-next').classList.toggle('bgnav-disabled', !enabled);
    },
    clearNext: function () {
      nextHandler = null;
      document.getElementById('bgnav-next').classList.add('bgnav-hidden');
    },
  };

})();
