// ============================================================
// PATCH for bhava-session.js — Developer Bypass for Play-Limit Gate
// ============================================================
// Add this near the top of the `if (!isActive) { ... }` block,
// BEFORE the WEB_PLAY_LIMIT check. This lets developers bypass
// the 3-play gate locally without affecting real students.
//
// Two ways to enable dev mode (either works):
//   1. Add ?devmode=1 to the URL once -> it saves a flag permanently
//   2. Manually run in console: localStorage.setItem('bhava_dev_mode','true')
// ============================================================

if (!isActive) {
  var WEB_PLAYS_KEY  = 'bhava_web_plays';
  var WEB_USER_KEY   = 'bhava_web_user';
  var WEB_PLAY_LIMIT = 3;
  var DEV_MODE_KEY   = 'bhava_dev_mode';

  // --- NEW: Dev bypass detection ---
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('devmode') === '1') {
      localStorage.setItem(DEV_MODE_KEY, 'true');
    }
  } catch (e) {}

  var isDevMode = false;
  try { isDevMode = localStorage.getItem(DEV_MODE_KEY) === 'true'; } catch (e) {}

  // Optional: auto-enable dev mode on localhost / 127.0.0.1 automatically
  try {
    if (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1') {
      isDevMode = true;
    }
  } catch (e) {}

  function getWebPlayed() {
    try { return JSON.parse(localStorage.getItem(WEB_PLAYS_KEY)) || []; }
    catch (e) { return []; }
  }

  function isWebLoggedIn() {
    try { return localStorage.getItem(WEB_USER_KEY) === 'true'; }
    catch (e) { return false; }
  }

  var played   = getWebPlayed();
  var loggedIn = isWebLoggedIn();

  if (played.indexOf(GAME_NAME) === -1) {
    // --- CHANGED: skip the gate entirely if isDevMode ---
    if (!isDevMode && !loggedIn && played.length >= WEB_PLAY_LIMIT) {
      window.location.href = '/student?gate=1';
      return;
    }
    played.push(GAME_NAME);
    try { localStorage.setItem(WEB_PLAYS_KEY, JSON.stringify(played)); } catch (e) {}
  }

  window.BhavaSession = {
    end:        function () {},
    getStudent: function () { return null; },
    isLoggedIn: function () { return loggedIn; },
    showLogin:  function () {},
    logout:     function () { try { localStorage.removeItem(WEB_USER_KEY); } catch (e) {} },
    setStudent: function () {},
  };
  return;
}
