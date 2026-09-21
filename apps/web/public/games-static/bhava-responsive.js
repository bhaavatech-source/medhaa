// ─────────────────────────────────────────────────────────────────────────────
// bhava-responsive.js — Global Mobile/Tablet Toolkit for Medhā Games
// Include ONCE per game, before </body>, AFTER bhava-game-nav.js:
//   <script src="bhava-responsive.js"></script>
//
// HOW THE TOOL "KNOWS" WHAT TO DO — you tell it, per game, with ONE line:
//
//   <html data-bhava-mobile="nudge">     ← soft dismissible banner (default)
//   <html data-bhava-mobile="block">     ← hard rotate-block for unplayable UIs
//   <html data-bhava-mobile="off">       ← no rotate messaging at all
//
// If you don't add data-bhava-mobile at all, it defaults to "nudge" — the
// safest option (never hides your game, just suggests a bigger screen).
//
// You decide "block" only for the handful of games where portrait truly
// cannot work (e.g. the 20-slot motherboard build grid) — everything else
// should stay on "nudge" or "off".
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  const mode = document.documentElement.getAttribute('data-bhava-mobile') || 'nudge';
  const MOBILE_BREAKPOINT = 900; // matches the CSS @media rule

  function isSmallScreen() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }
  function isPortrait() {
    return window.innerHeight > window.innerWidth;
  }

  // ── Soft banner (mode: "nudge") ─────────────────────────────────────────
  function ensureBanner() {
    let banner = document.getElementById('bhava-rotate-banner');
    if (banner) return banner;
    banner = document.createElement('div');
    banner.id = 'bhava-rotate-banner';
    banner.innerHTML =
      '<span class="bhava-rb-icon">📱↻</span>' +
      '<span class="bhava-rb-text">This game feels better on a bigger screen or in landscape. You can still play here!</span>' +
      '<button class="bhava-rb-close" aria-label="Dismiss">✕</button>';
    document.body.insertBefore(banner, document.body.firstChild.nextSibling || null);
    banner.querySelector('.bhava-rb-close').addEventListener('click', function () {
      banner.classList.remove('bhava-show');
      try { sessionStorage.setItem('bhava_rotate_dismissed', '1'); } catch (e) {}
    });
    return banner;
  }

  function updateBanner() {
    const banner = ensureBanner();
    let dismissed = false;
    try { dismissed = sessionStorage.getItem('bhava_rotate_dismissed') === '1'; } catch (e) {}
    const shouldShow = isSmallScreen() && isPortrait() && !dismissed;
    banner.classList.toggle('bhava-show', shouldShow);
  }

  // ── Hard block (mode: "block") ──────────────────────────────────────────
  function ensureBlock() {
    let block = document.getElementById('bhava-rotate-block');
    if (block) return block;
    block = document.createElement('div');
    block.id = 'bhava-rotate-block';
    block.innerHTML =
      '<div class="bhava-rotate-icon">📱</div>' +
      '<h3>Please rotate your device</h3>' +
      '<p>This activity needs a wider screen to show everything clearly. ' +
      'Turn your phone or tablet sideways, or open this on a laptop for the best experience.</p>';
    document.body.appendChild(block);
    return block;
  }

  function updateBlock() {
    const block = ensureBlock();
    const shouldBlock = isSmallScreen() && isPortrait();
    block.classList.toggle('bhava-show', shouldBlock);
  }

  // ── Horizontal-scroll edge-fade helper (works with .bhava-hscroll-wrap) ─
  function initScrollFades() {
    document.querySelectorAll('.bhava-hscroll-wrap').forEach(function (wrap) {
      const scroller = wrap.querySelector('.bhava-hscroll, .bhava-hscroll-auto');
      if (!scroller) return;
      function check() {
        const atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 4;
        wrap.classList.toggle('bhava-scrolled-end', atEnd);
      }
      scroller.addEventListener('scroll', check, { passive: true });
      check();
    });
  }

  // ── Global layout controls ----------------------------------------------
  function initLayoutControls() {
    var root = document.querySelector('.build-layout');
    var palette = document.querySelector('.palette-panel');
    var diagnostics = document.querySelector('.diagnostics-panel');
    var hasPalette = !!(root && palette);
    var hasDiagnostics = !!(root && diagnostics);
    var hasWorkspace = !!root;
    if (document.getElementById('bhava-layout-controls')) return;

    var saved = {};
    try { saved = JSON.parse(localStorage.getItem('bhava-layout-settings') || '{}'); } catch (e) {}
    function bounded(value, fallback, min, max) {
      var number = Number(value);
      return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
    }
    var size = bounded(saved.scrollbar, 8, 3, 24);
    var paletteDefault = (root ? parseInt(getComputedStyle(root).gridTemplateColumns, 10) : 270) || 270;
    var paletteWidth = bounded(saved.palette, paletteDefault, 210, 420);
    var diagnosticsWidth = bounded(saved.diagnostics, 280, 190, 420);
    var workspaceHeight = bounded(saved.workspaceHeight, 540, 320, 720);
    document.documentElement.style.setProperty('--bhava-scrollbar-size', size + 'px');
    if (hasPalette) document.documentElement.style.setProperty('--bhava-palette-width', paletteWidth + 'px');
    if (hasDiagnostics) document.documentElement.style.setProperty('--bhava-diagnostics-width', diagnosticsWidth + 'px');
    if (hasWorkspace) document.documentElement.style.setProperty('--bhava-workspace-height', workspaceHeight + 'px');

    function save() {
      try { localStorage.setItem('bhava-layout-settings', JSON.stringify({ scrollbar: size, palette: paletteWidth, diagnostics: diagnosticsWidth, workspaceHeight: workspaceHeight })); } catch (e) {}
    }

    function addHandle(panel, side, key, min, max) {
      var handle = document.createElement('button');
      handle.type = 'button';
      handle.className = 'bhava-resize-handle';
      handle.setAttribute('aria-label', 'Resize ' + key + ' panel');
      panel.appendChild(handle);
      var startX = 0;
      var startWidth = 0;
      handle.addEventListener('pointerdown', function (event) {
        event.preventDefault();
        handle.setPointerCapture(event.pointerId);
        startX = event.clientX;
        startWidth = key === 'palette' ? paletteWidth : diagnosticsWidth;
        document.documentElement.classList.add('bhava-resizing');
      });
      handle.addEventListener('pointermove', function (event) {
        if (!document.documentElement.classList.contains('bhava-resizing')) return;
        var delta = side === 'right' ? event.clientX - startX : startX - event.clientX;
        var next = Math.max(min, Math.min(max, startWidth + delta));
        if (key === 'palette') paletteWidth = next;
        else diagnosticsWidth = next;
        document.documentElement.style.setProperty('--bhava-' + key + '-width', next + 'px');
      });
      handle.addEventListener('pointerup', function () {
        document.documentElement.classList.remove('bhava-resizing');
        save();
      });
    }

    if (hasPalette && hasDiagnostics) {
      addHandle(palette, 'right', 'palette', 210, 420);
      addHandle(diagnostics, 'left', 'diagnostics', 190, 420);
    }

    // Only show rows for controls that actually apply to this page — most
    // games have no palette/diagnostics/workspace panel, so those rows would
    // otherwise be dead/confusing UI. The scrollbar row always applies.
    var rows = '';
    if (hasPalette) rows += '<label>Parts tray width <output id="bhava-palette-value">' + paletteWidth + 'px</output><input id="bhava-palette-range" type="range" min="210" max="420" step="5" value="' + paletteWidth + '"></label>';
    if (hasDiagnostics) rows += '<label>Diagnostics width <output id="bhava-diagnostics-value">' + diagnosticsWidth + 'px</output><input id="bhava-diagnostics-range" type="range" min="190" max="420" step="5" value="' + diagnosticsWidth + '"></label>';
    if (hasWorkspace) rows += '<label>Workspace height <output id="bhava-workspace-value">' + workspaceHeight + 'px</output><input id="bhava-workspace-range" type="range" min="320" max="720" step="10" value="' + workspaceHeight + '"></label>';
    rows += '<label>Scrollbar thickness <output id="bhava-scrollbar-value">' + size + 'px</output><input id="bhava-scrollbar-range" type="range" min="3" max="24" step="1" value="' + size + '"></label>';

    var controls = document.createElement('div');
    controls.id = 'bhava-layout-controls';
    controls.hidden = true;
    controls.innerHTML =
      '<div class="bhava-layout-heading"><strong>' + (hasWorkspace ? 'Layout &amp; display settings' : 'Display settings') + '</strong><button id="bhava-layout-close" type="button" aria-label="Close layout settings">✕</button></div>' +
      rows +
      '<button id="bhava-layout-reset" type="button">Reset to defaults</button>';
    document.body.appendChild(controls);

    var toggle = document.createElement('button');
    toggle.id = 'bhava-layout-toggle';
    toggle.type = 'button';
    toggle.title = 'Display settings';
    toggle.setAttribute('aria-label', 'Open display settings');
    toggle.textContent = '⚙️';
    document.body.appendChild(toggle);
    toggle.addEventListener('click', function () { controls.hidden = !controls.hidden; });
    document.getElementById('bhava-layout-close').addEventListener('click', function () { controls.hidden = true; });

    function bindSizeRange(id, outputId, property, update) {
      var input = document.getElementById(id);
      var output = document.getElementById(outputId);
      if (!input) return;
      input.addEventListener('input', function () {
        update(Number(input.value));
        output.textContent = input.value + 'px';
        document.documentElement.style.setProperty(property, input.value + 'px');
        save();
      });
    }
    bindSizeRange('bhava-palette-range', 'bhava-palette-value', '--bhava-palette-width', function (value) { paletteWidth = value; });
    bindSizeRange('bhava-diagnostics-range', 'bhava-diagnostics-value', '--bhava-diagnostics-width', function (value) { diagnosticsWidth = value; });
    bindSizeRange('bhava-workspace-range', 'bhava-workspace-value', '--bhava-workspace-height', function (value) { workspaceHeight = value; });

    var range = document.getElementById('bhava-scrollbar-range');
    var output = document.getElementById('bhava-scrollbar-value');
    range.addEventListener('input', function () {
      size = Number(range.value);
      output.textContent = size + 'px';
      document.documentElement.style.setProperty('--bhava-scrollbar-size', size + 'px');
      save();
    });
    document.getElementById('bhava-layout-reset').addEventListener('click', function () {
      size = 8;
      document.documentElement.style.setProperty('--bhava-scrollbar-size', '8px');
      range.value = 8;
      output.textContent = '8px';
      if (hasPalette) {
        paletteWidth = paletteDefault;
        document.documentElement.style.setProperty('--bhava-palette-width', paletteDefault + 'px');
        document.getElementById('bhava-palette-range').value = paletteDefault;
        document.getElementById('bhava-palette-value').textContent = paletteDefault + 'px';
      }
      if (hasDiagnostics) {
        diagnosticsWidth = 280;
        document.documentElement.style.setProperty('--bhava-diagnostics-width', '280px');
        document.getElementById('bhava-diagnostics-range').value = 280;
        document.getElementById('bhava-diagnostics-value').textContent = '280px';
      }
      if (hasWorkspace) {
        workspaceHeight = 540;
        document.documentElement.style.setProperty('--bhava-workspace-height', '540px');
        document.getElementById('bhava-workspace-range').value = 540;
        document.getElementById('bhava-workspace-value').textContent = '540px';
      }
      save();
    });
  }

  // ── Wire it up ───────────────────────────────────────────────────────────
  function update() {
    if (mode === 'nudge') { updateBanner(); }
    else if (mode === 'block') { updateBlock(); }
    // mode === 'off' → do nothing
  }

  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', function () {
    setTimeout(update, 150); // slight delay lets innerWidth/Height settle
  });
  document.addEventListener('DOMContentLoaded', function () {
    update();
    initScrollFades();
    initLayoutControls();
  });
  // In case the script loads after DOMContentLoaded already fired
  if (document.readyState !== 'loading') {
    update();
    initScrollFades();
    initLayoutControls();
  }

  // ── Public API — for games that want manual control ────────────────────
  window.BhavaResponsive = {
    refresh: update,
    isSmallScreen: isSmallScreen,
    isPortrait: isPortrait,
  };

})();
