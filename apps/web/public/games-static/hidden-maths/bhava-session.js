// ── Medhā — Session Tracker + Game Nav v3 ───────────────────────────────
// Single unified file. Drop ONE tag before </body> in any game HTML:
//   <script src="bhava-session.js"></script>
//
// Behaviour:
//   Web / Android (Capacitor)  → uses the existing Medhā login (JWT in
//                                 localStorage); scores are saved to the
//                                 Medhā API (https://medhaa-tni1.onrender.com)
//                                 when logged in, otherwise fully anonymous
//   Electron + native login    → legacy roll-number/IPC path (unchanged)
//
// Call from game score logic:
//   BhavaSession.end(myScore);   // score: 0–100
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  var SCHOOL_ID  = 'BHAVA-SVN-001';
  var CLOUD_URL  = 'https://bhava-cloud.onrender.com';
  var CLOUD_KEY  = '0042bfd36ef4a5a219e0bbb206e58ec7b84c7d9334b75c7e';
  var GAME_NAME  = document.title || 'Unknown Game';
  var REPORT_URL = 'bhava-student-report.html';   // all files are inside docs/

  var currentStudent   = null;
  var currentSessionId = null;
  var completionShownAt = 0;
  var musicSystemStarted = false;

  var RECOMMENDATION_GAMES = [
    { slug: 'bhava-build-device-engineer', title: 'Device Engineer', domain: 'stem-engineering', path: 'bhava-build-device-engineer/index.html', emoji: 'Phone' },
    { slug: 'bhava-smriti', title: 'Bhava Smriti', domain: 'cognitive-memory', path: 'bhava-smriti/index.html', emoji: 'Cards' },
    { slug: 'build-your-car', title: 'Car Designer', domain: 'stem-engineering', path: 'build-your-car/index.html', emoji: 'Car' },
    { slug: 'focus-flash', title: 'Focus Flash', domain: 'cognitive-focus', path: 'focus-flash/index.html', emoji: 'Bolt' },
    { slug: 'life-strategist-starter', title: 'Life Strategist', domain: 'life-skills', path: 'life-strategist-starter/index.html', emoji: 'Choice' },
    { slug: 'dharana-arena', title: 'Dharana Arena', domain: 'cognitive-focus', path: 'dharana-arena.html', emoji: 'Calm' },
    { slug: 'nagarikx-enhanced', title: 'Future Citizen', domain: 'civics', path: 'nagarikx-enhanced.html', emoji: 'Civic' },
    { slug: 'planet-guardians', title: 'Planet Guardians', domain: 'environment', path: 'planet-guardians.html', emoji: 'Earth' },
    { slug: 'soccomm-enhanced', title: 'Me & Society', domain: 'emotional-intel', path: 'soccomm-enhanced.html', emoji: 'Talk' },
    { slug: 'neuroflash-memory', title: 'Flash Memory', domain: 'cognitive-memory', path: 'neuroflash-memory.html', emoji: 'Flash' },
    { slug: 'calm-zone', title: 'Calm Zone', domain: 'emotional-intel', path: 'calm-zone.html', emoji: 'Calm' },
    { slug: 'bhava-tech-likhwell', title: 'Likhwell', domain: 'language-hindi', path: 'bhava_Tech_Likhwell.html', emoji: 'Write' },
    { slug: 'brain-garden', title: 'Brain Garden', domain: 'cognitive-memory', path: 'brain-garden.html', emoji: 'Memory' },
    { slug: 'brain-quest', title: 'Brain Quest', domain: 'cognitive-logic', path: 'brain-quest.html', emoji: 'Quest' },
    { slug: 'day-hero-game', title: 'Day Hero', domain: 'life-skills', path: 'day-hero-game.html', emoji: 'Day' },
    { slug: 'day-super-hero', title: 'Day Super Hero', domain: 'life-skills', path: 'day-super-hero.html', emoji: 'Hero' },
    { slug: 'iq-test-level-3', title: 'IQ Test', domain: 'cognitive-assessment', path: 'iq-test-level-3.html', emoji: 'IQ' },
    { slug: 'logic-game', title: 'Logic Game', domain: 'cognitive-logic', path: 'logic-game.html', emoji: 'Logic' },
    { slug: 'math-blitz', title: 'Math Blitz', domain: 'cognitive-math', path: 'math-blitz.html', emoji: 'Math' },
    { slug: 'memory-match-puzzle', title: 'Memory Match Puzzle', domain: 'cognitive-memory', path: 'memory-match-puzzle.html', emoji: 'Match' },
    { slug: 'memory-match-ultimate', title: 'Memory Match Ultimate', domain: 'cognitive-memory', path: 'memory-match-ultimate.html', emoji: 'Memory' },
    { slug: 'memory-zoo-puzzle', title: 'Memory Zoo Puzzle', domain: 'cognitive-memory', path: 'memory-zoo-puzzle.html', emoji: 'Zoo' },
    { slug: 'mindscape-pro', title: 'Mindscape Pro', domain: 'cognitive-logic', path: 'mindscape-pro.html', emoji: 'Mind' },
    { slug: 'mindspark-iq', title: 'Mindspark IQ', domain: 'cognitive-assessment', path: 'mindspark-iq.html', emoji: 'IQ' },
    { slug: 'neurospark', title: 'Neurospark', domain: 'cognitive-logic', path: 'neurospark.html', emoji: 'Spark' },
    { slug: 'percentile-game', title: 'Percentile Game', domain: 'cognitive-math', path: 'percentile-game.html', emoji: 'Score' },
    { slug: 'nadopaasana', title: 'Nadopaasana', domain: 'music', path: 'nadopaasana/index.html', emoji: 'Music' },
    { slug: 'career-adventure', title: 'Career Adventure', domain: 'career', path: 'career-adventure.html', emoji: 'Career' },
    { slug: 'finlife-india-quest-enhanced', title: 'Fin Smart', domain: 'finance', path: 'finlife-india-quest-enhanced.html', emoji: 'Money' },
    { slug: 'focus-under-distraction', title: 'Focus Master', domain: 'cognitive-focus', path: 'focus-under-distraction.html', emoji: 'Focus' },
    { slug: 'motorcycle-one-workshop', title: 'Bike Builder', domain: 'stem-engineering', path: 'motorcycle-one-workshop.html', emoji: 'Bike' },
    { slug: 'neuro-ascend-iq', title: 'Neuro Ascend IQ', domain: 'cognitive-assessment', path: 'neuro-ascend-iq.html', emoji: 'IQ' },
    { slug: 'number-garden-quest', title: 'Number Garden Quest', domain: 'cognitive-math', path: 'number-garden-quest.html', emoji: 'Number' },
    { slug: 'telugu-script-game', title: 'Telugu Script Game', domain: 'language-telugu', path: 'telugu-script-game.html', emoji: 'Telugu' },
    { slug: 'bhava-math-grid', title: 'Apt Number', domain: 'cognitive-math', path: 'bhava-math-grid.html', emoji: 'Grid' },
    { slug: 'bhava-space-academy', title: 'Space Academy', domain: 'stem-engineering', path: 'bhava-space-academy/index.html', emoji: 'Space' },
    { slug: 'drone-build-engineer', title: 'Drone Engineer', domain: 'stem-engineering', path: 'drone-build-engineer/index.html', emoji: 'Drone' },
    { slug: 'hidden-maths', title: 'Hidden Maths', domain: 'cognitive-math', path: 'hidden-maths/index.html', emoji: 'Math' },
    { slug: 'intelligent-machines', title: 'Intelligent Machines', domain: 'stem-engineering', path: 'intelligent-machines/index.html', emoji: 'Machine' },
    { slug: 'rocket-build-engineer', title: 'Rocket Engineer', domain: 'stem-engineering', path: 'rocket-build-engineer/index.html', emoji: 'Rocket' },
    { slug: 'plane-builder', title: 'Plane Builder', domain: 'stem-engineering', path: 'plane-builder/index.html', emoji: 'Plane' },
    { slug: 'secret-of-silicon-game', title: 'Chip Detective', domain: 'stem-engineering', path: 'secret-of-silicon-game/index.html', emoji: 'Chip' },
    { slug: 'devanagari-game', title: 'Devanagari Game', domain: 'language-hindi', path: 'devanagari-game/index.html', emoji: 'Hindi' },
    { slug: 'ready-for-the-world', title: 'Ready For The World', domain: 'life-skills', path: 'ready-for-the-world.html', emoji: 'Ready' },
    { slug: 'grammar-galaxy', title: 'Grammar Galaxy', domain: 'language-english', path: 'grammar-galaxy.html', emoji: 'Words' },
    { slug: 'grammar-pro', title: 'Grammar Pro', domain: 'language-english', path: 'Grammar-Pro.html', emoji: 'Grammar' },
    { slug: 'heart-heroes', title: 'Heart Heroes', domain: 'emotional-intel', path: 'heart-heroes.html', emoji: 'Heart' },
    { slug: 'imaginia-quest', title: 'Imaginia Quest', domain: 'creativity', path: 'imaginia-quest.html', emoji: 'Create' },
    { slug: 'mental-rotation-game', title: 'Mind Rotation', domain: 'cognitive-logic', path: 'mental-rotation-game.html', emoji: 'Rotate' },
    { slug: 'visual-difference-detector', title: 'Focus Flow', domain: 'cognitive-focus', path: 'visual-difference-detector.html', emoji: 'Spot' },
    { slug: 'good-habits', title: 'Good Habits', domain: 'life-skills', path: 'good-habits.html', emoji: 'Habit' },
    { slug: 'empathy-quest', title: 'Empathy Quest', domain: 'emotional-intel', path: 'empathy-quest.html', emoji: 'Empathy' },
    { slug: 'empathy-conversation', title: 'Empathy Conversation', domain: 'emotional-intel', path: 'empathy-conversation.html', emoji: 'Chat' },
    { slug: 'know-maths', title: 'Know Maths', domain: 'cognitive-math', path: 'know-maths/index.html', emoji: 'Math' },
    { slug: 'logic-grid-puzzle', title: 'Logic Grid Puzzle', domain: 'cognitive-logic', path: 'logic-grid-puzzle.html', emoji: 'Grid' },
    { slug: 'bcs-lite-v3', title: 'My Medhaa', domain: 'cognitive-assessment', path: 'bcs-lite-v3.html', emoji: 'Report' },
    { slug: 'medha-read-anybook-in-3hrs', title: 'Read Any Book in 3 Hours', domain: 'reading', path: 'medha_read_anybook_in-3hrs.html', emoji: 'Read' }
  ];

  var ROTATING_GAME_SLUGS = {
    'bhava-tech-likhwell': true,
    'brain-garden': true,
    'brain-quest': true,
    'day-hero-game': true,
    'day-super-hero': true,
    'iq-test-level-3': true,
    'logic-game': true,
    'math-blitz-example': true,
    'math-blitz': true,
    'memory-match-puzzle': true,
    'memory-match-ultimate': true,
    'memory-zoo-puzzle': true,
    'mindscape-pro': true,
    'mindspark-iq': true,
    'neurospark': true,
    'percentile-game': true
  };

  function _escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function _readJsonList(key) {
    try {
      var list = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function _writeJsonList(key, list) {
    try { localStorage.setItem(key, JSON.stringify(list)); } catch (e) {}
  }

  function _readMusicEnabled() {
    try { return localStorage.getItem('medhaa_global_music_enabled') !== 'false'; }
    catch (e) { return true; }
  }

  function _readMusicVolume() {
    try {
      var value = parseFloat(localStorage.getItem('medhaa_global_music_volume') || '0.28');
      return isNaN(value) ? 0.28 : Math.max(0, Math.min(1, value));
    } catch (e) {
      return 0.28;
    }
  }

  function _initGlobalMusic() {
    if (musicSystemStarted || window.MedhaaMusic) return;
    musicSystemStarted = true;

    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    var state = {
      ctx: null,
      master: null,
      filter: null,
      compressor: null,
      reverb: null,
      reverbGain: null,
      trackAudio: null,
      usingTrack: false,
      trackFailed: false,
      enabled: _readMusicEnabled(),
      volume: _readMusicVolume(),
      running: false,
      unavailable: false,
      panelOpen: false,
      scheduler: null,
      nextNoteAt: 0,
      step: 0
    };
    var scale = [0, 2, 4, 7, 9, 12, 14, 16, 19];
    var root = 146.83;
    var phrase = [0, 4, 7, 4, 2, 5, 9, 5, 0, 4, 7, 11, 9, 7, 4, 2];
    var progression = [[0, 4, 7], [5, 9, 12], [2, 5, 9], [7, 11, 14]];
    var tracks = [
      '/audio/background/audio1.mpeg',
      '/audio/background/audio2.mpeg',
      '/audio/background/audio3.mpeg',
      '/audio/background/audio4.mpeg'
    ];

    function save() {
      try {
        localStorage.setItem('medhaa_global_music_enabled', state.enabled ? 'true' : 'false');
        localStorage.setItem('medhaa_global_music_volume', String(state.volume));
      } catch (e) {}
    }

    function note(semitone, octave) {
      return root * Math.pow(2, (semitone + (octave || 0) * 12) / 12);
    }

    function startTrack() {
      if (state.trackFailed) return Promise.reject(new Error('Background tracks unavailable'));
      if (!state.trackAudio) {
        state.trackAudio = document.createElement('audio');
        state.trackAudio.preload = 'none';
        state.trackAudio.loop = true;
        state.trackAudio.setAttribute('aria-hidden', 'true');
        state.trackAudio.style.display = 'none';
        state.trackAudio.src = tracks[Math.floor(Math.random() * tracks.length)];
        document.body.appendChild(state.trackAudio);
        state.trackAudio.addEventListener('error', function () {
          state.trackFailed = true;
          state.usingTrack = false;
        });
      }
      state.trackAudio.volume = Math.min(1, state.volume * 0.72);
      return state.trackAudio.play().then(function () {
        state.usingTrack = true;
      });
    }

    function ensureAudio() {
      if (!state.ctx) {
        state.ctx = new AudioCtx();
        state.filter = state.ctx.createBiquadFilter();
        state.filter.type = 'lowpass';
        state.filter.frequency.value = 4200;
        state.filter.Q.value = 0.6;
        state.compressor = state.ctx.createDynamicsCompressor();
        state.compressor.threshold.value = -24;
        state.compressor.knee.value = 18;
        state.compressor.ratio.value = 4;
        state.compressor.attack.value = 0.02;
        state.compressor.release.value = 0.35;
        state.reverb = state.ctx.createConvolver();
        state.reverb.buffer = createReverbImpulse(2.4, 2.2);
        state.reverbGain = state.ctx.createGain();
        state.reverbGain.gain.value = 0.18;
        state.master = state.ctx.createGain();
        state.master.gain.value = 0;
        state.filter.connect(state.compressor);
        state.filter.connect(state.reverb);
        state.reverb.connect(state.reverbGain);
        state.reverbGain.connect(state.compressor);
        state.compressor.connect(state.master);
        state.master.connect(state.ctx.destination);
      }
      if (state.ctx.state === 'suspended') return state.ctx.resume();
      return Promise.resolve();
    }

    function createReverbImpulse(seconds, decay) {
      var length = Math.floor(state.ctx.sampleRate * seconds);
      var impulse = state.ctx.createBuffer(2, length, state.ctx.sampleRate);
      for (var channel = 0; channel < impulse.numberOfChannels; channel++) {
        var data = impulse.getChannelData(channel);
        for (var index = 0; index < length; index++) {
          data[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / length, decay);
        }
      }
      return impulse;
    }

    function setMasterGain(target) {
      if (!state.master || !state.ctx) return;
      var gain = state.enabled ? target * state.volume : 0;
      state.master.gain.cancelScheduledValues(state.ctx.currentTime);
      state.master.gain.linearRampToValueAtTime(gain, state.ctx.currentTime + 0.35);
    }

    function envelope(gain, when, attack, hold, release, peak) {
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(peak, when + attack);
      gain.gain.setValueAtTime(peak, when + attack + hold);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + attack + hold + release);
    }

    function connectInstrument(gain) {
      gain.connect(state.filter);
    }

    function playDrone(when) {
      var gain = state.ctx.createGain();
      connectInstrument(gain);
      envelope(gain, when, 0.9, 3.6, 1.4, 0.08);
      [root, root * 1.5].forEach(function (freq, index) {
        var osc = state.ctx.createOscillator();
        osc.type = index === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, when);
        osc.connect(gain);
        osc.start(when);
        osc.stop(when + 6.1);
      });
    }

    function playPad(when, chord) {
      var gain = state.ctx.createGain();
      connectInstrument(gain);
      envelope(gain, when, 0.8, 5.4, 1.3, 0.042);
      chord.forEach(function (degree, index) {
        var osc = state.ctx.createOscillator();
        osc.type = index === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(note(degree, 0), when);
        osc.detune.value = index === 0 ? -5 : (index === 2 ? 5 : 0);
        osc.connect(gain);
        osc.start(when);
        osc.stop(when + 7.7);
      });
    }

    function playBass(when, freq) {
      var gain = state.ctx.createGain();
      var osc = state.ctx.createOscillator();
      var overtone = state.ctx.createOscillator();
      var overtoneGain = state.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, when);
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, when);
      overtoneGain.gain.value = 0.13;
      osc.connect(gain);
      overtone.connect(overtoneGain);
      overtoneGain.connect(gain);
      connectInstrument(gain);
      envelope(gain, when, 0.025, 0.14, 0.32, 0.075);
      osc.start(when);
      overtone.start(when);
      osc.stop(when + 0.52);
      overtone.stop(when + 0.52);
    }

    function playFlute(when, freq) {
      var gain = state.ctx.createGain();
      var vibrato = state.ctx.createOscillator();
      var vibratoGain = state.ctx.createGain();
      vibrato.type = 'sine';
      vibrato.frequency.value = 4.5;
      vibratoGain.gain.value = 3;
      vibrato.connect(vibratoGain);
      [
        { multiple: 1, type: 'sine', level: 1 },
        { multiple: 2, type: 'sine', level: 0.14 },
        { multiple: 3, type: 'sine', level: 0.06 }
      ].forEach(function (partial) {
        var osc = state.ctx.createOscillator();
        var partialGain = state.ctx.createGain();
        osc.type = partial.type;
        osc.frequency.setValueAtTime(freq * partial.multiple, when);
        partialGain.gain.value = partial.level;
        vibratoGain.connect(osc.frequency);
        osc.connect(partialGain);
        partialGain.connect(gain);
        osc.start(when);
        osc.stop(when + 1.55);
      });
      connectInstrument(gain);
      envelope(gain, when, 0.18, 0.55, 0.7, 0.06);
      vibrato.start(when);
      vibrato.stop(when + 1.55);
    }

    function playMarimba(when, freq) {
      var gain = state.ctx.createGain();
      connectInstrument(gain);
      [
        { multiple: 1, level: 1, decay: 0.52 },
        { multiple: 3.02, level: 0.34, decay: 0.22 },
        { multiple: 6.08, level: 0.12, decay: 0.12 }
      ].forEach(function (partial) {
        var osc = state.ctx.createOscillator();
        var partialGain = state.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * partial.multiple, when);
        osc.connect(partialGain);
        partialGain.connect(gain);
        envelope(partialGain, when, 0.006, 0.012, partial.decay, 0.055 * partial.level);
        osc.start(when);
        osc.stop(when + partial.decay + 0.12);
      });
    }

    function playKalimba(when, freq) {
      var gain = state.ctx.createGain();
      connectInstrument(gain);
      [
        { multiple: 1, type: 'triangle', level: 1, decay: 0.42 },
        { multiple: 2.76, type: 'sine', level: 0.23, decay: 0.18 }
      ].forEach(function (partial) {
        var osc = state.ctx.createOscillator();
        var partialGain = state.ctx.createGain();
        osc.type = partial.type;
        osc.frequency.setValueAtTime(freq * partial.multiple, when);
        osc.connect(partialGain);
        partialGain.connect(gain);
        envelope(partialGain, when, 0.004, 0.012, partial.decay, 0.052 * partial.level);
        osc.start(when);
        osc.stop(when + partial.decay + 0.1);
      });
    }

    function playSoftBell(when, freq) {
      var gain = state.ctx.createGain();
      [
        { multiple: 1, level: 1, decay: 1.7 },
        { multiple: 2.01, level: 0.4, decay: 1.25 },
        { multiple: 2.68, level: 0.2, decay: 0.9 },
        { multiple: 4.07, level: 0.1, decay: 0.55 }
      ].forEach(function (partial) {
        var osc = state.ctx.createOscillator();
        var partialGain = state.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * partial.multiple, when);
        osc.connect(partialGain);
        partialGain.connect(gain);
        envelope(partialGain, when, 0.012, 0.03, partial.decay, 0.045 * partial.level);
        osc.start(when);
        osc.stop(when + partial.decay + 0.08);
      });
      connectInstrument(gain);
    }

    function schedule() {
      if (!state.running || !state.enabled || !state.ctx) return;
      var now = state.ctx.currentTime;
      while (state.nextNoteAt < now + 1.2) {
        var beat = state.step % phrase.length;
        var degree = phrase[beat];
        var chord = progression[Math.floor(state.step / phrase.length) % progression.length];
        if (beat === 0) {
          playDrone(state.nextNoteAt);
          playPad(state.nextNoteAt, chord);
        }
        if (beat === 0 || beat === 4 || beat === 8 || beat === 12) playBass(state.nextNoteAt, note(chord[0], -1));
        if (beat === 0 || beat === 4 || beat === 8 || beat === 12) playMarimba(state.nextNoteAt, note(degree, 1));
        if (beat === 2 || beat === 6 || beat === 10 || beat === 14) playKalimba(state.nextNoteAt, note(degree + 7, 1));
        if (beat === 7 || beat === 15) playFlute(state.nextNoteAt, note(degree, 2));
        if (beat === 12) playSoftBell(state.nextNoteAt, note(degree + 12, 1));
        state.nextNoteAt += 0.48;
        state.step += 1;
      }
    }

    function start() {
      if (!state.enabled) return;
      startTrack().then(function () {
        state.unavailable = false;
        state.running = true;
        updateControl();
      }).catch(function () {
        state.usingTrack = false;
        startSynth();
      });
    }

    function startSynth() {
      ensureAudio().then(function () {
        if (!state.enabled || !state.ctx || state.ctx.state !== 'running') return;
        state.unavailable = false;
        state.running = true;
        state.nextNoteAt = state.ctx.currentTime + 0.12;
        setMasterGain(0.42);
        schedule();
        if (!state.scheduler) state.scheduler = window.setInterval(schedule, 220);
        updateControl();
      }).catch(function () {
        state.running = false;
        state.unavailable = true;
        updateControl();
      });
    }

    function stop() {
      state.running = false;
      state.usingTrack = false;
      if (state.trackAudio) {
        state.trackAudio.pause();
        state.trackAudio.currentTime = 0;
      }
      if (state.master && state.ctx) {
        state.master.gain.cancelScheduledValues(state.ctx.currentTime);
        state.master.gain.setValueAtTime(0, state.ctx.currentTime);
      }
      state.nextNoteAt = 0;
      if (state.scheduler) {
        window.clearInterval(state.scheduler);
        state.scheduler = null;
      }
      updateControl();
    }

    function setEnabled(enabled) {
      state.enabled = !!enabled;
      save();
      state.enabled ? start() : stop();
      updateControl();
    }

    function setVolume(volume) {
      state.volume = Math.max(0, Math.min(1, parseFloat(volume) || 0));
      save();
      if (state.trackAudio) state.trackAudio.volume = Math.min(1, state.volume * 0.72);
      setMasterGain(0.42);
      updateControl();
    }

    function mountControls() {
      if (document.getElementById('medhaa-music-control')) return;
      var style = document.createElement('style');
      style.id = 'medhaa-music-style';
      style.textContent = '#medhaa-music-control{position:fixed;right:14px;bottom:14px;z-index:10001}#medhaa-music-toggle{display:grid;place-items:center;width:44px;height:44px;border:1px solid rgba(15,118,110,.28);background:rgba(255,255,255,.94);backdrop-filter:blur(12px);box-shadow:0 12px 30px rgba(2,8,23,.18);border-radius:50%;padding:0;font-size:20px;line-height:1;color:#0f766e;cursor:pointer}#medhaa-music-toggle.off{color:#64748b;border-color:rgba(100,116,139,.24)}@media(max-width:720px){#medhaa-music-control{right:10px;bottom:10px}}';
      document.head.appendChild(style);

      var control = document.createElement('div');
      control.id = 'medhaa-music-control';
      control.innerHTML = '<button id="medhaa-music-toggle" type="button" aria-label="Turn music off" title="Turn music off">&#9835;</button>';
      document.body.appendChild(control);

      document.getElementById('medhaa-music-toggle').addEventListener('click', function () {
        setEnabled(!state.enabled);
      });
      updateControl();
    }

    function updateControl() {
      var toggle = document.getElementById('medhaa-music-toggle');
      if (toggle) {
        var label = state.unavailable ? 'Music unavailable' : (state.enabled ? 'Turn music off' : 'Turn music on');
        toggle.innerHTML = state.enabled ? '&#9835;' : '&#9836;';
        toggle.setAttribute('aria-label', label);
        toggle.title = label;
        toggle.classList.toggle('off', !state.enabled);
      }
    }

    function startAfterGesture() {
      if (state.enabled) start();
    }

    window.MedhaaMusic = {
      start: start,
      stop: stop,
      setEnabled: setEnabled,
      setVolume: setVolume,
      getState: function () { return { enabled: state.enabled, volume: state.volume, running: state.running, source: state.usingTrack ? 'track' : 'synth' }; }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountControls);
    } else {
      mountControls();
    }
    window.addEventListener('pointerdown', startAfterGesture, { once: true });
    window.addEventListener('touchstart', startAfterGesture, { once: true, passive: true });
    window.addEventListener('keydown', startAfterGesture, { once: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (state.enabled) startAfterGesture();
    });
  }

  function _inferCurrentGame() {
    var path = (window.location.pathname || '').toLowerCase();
    var title = (document.title || '').toLowerCase();
    var best = null;
    for (var i = 0; i < RECOMMENDATION_GAMES.length; i++) {
      var game = RECOMMENDATION_GAMES[i];
      if (path.indexOf('/' + game.slug.toLowerCase() + '/') !== -1 || path.indexOf('/' + game.slug.toLowerCase() + '.html') !== -1) return game;
      if (path.indexOf('/' + game.path.toLowerCase()) !== -1) return game;
      if (!best && title && title.indexOf(game.title.toLowerCase()) !== -1) best = game;
    }
    return best;
  }

  function _pickRecommendations(currentGame, limit) {
    var played = _readJsonList('medhaa-played-games');
    var playedMap = {};
    played.forEach(function (slug) { playedMap[slug] = true; });
    var suggestableGames = RECOMMENDATION_GAMES.filter(function (game) {
      return !ROTATING_GAME_SLUGS[game.slug];
    });
    var sameDomain = RECOMMENDATION_GAMES.filter(function (game) {
      return currentGame && game.domain === currentGame.domain && game.slug !== currentGame.slug && !playedMap[game.slug] && !ROTATING_GAME_SLUGS[game.slug];
    });
    var sameDomainFallback = suggestableGames.filter(function (game) {
      return currentGame && game.domain === currentGame.domain && game.slug !== currentGame.slug;
    });
    var anyUnplayed = suggestableGames.filter(function (game) {
      return (!currentGame || game.slug !== currentGame.slug) && !playedMap[game.slug];
    });
    var pool = sameDomain.concat(anyUnplayed, sameDomainFallback);
    var seen = {};
    return pool.filter(function (game) {
      if (seen[game.slug]) return false;
      seen[game.slug] = true;
      return true;
    }).slice(0, limit || 3);
  }

  function _absoluteGameUrl(path) {
    return '/games-static/' + path.replace(/^\/+/, '');
  }

  function _showGameRecommendations(rawScore) {
    var now = Date.now();
    if (now - completionShownAt < 1200) return;
    completionShownAt = now;

    var currentGame = _inferCurrentGame();
    if (currentGame) {
      var played = _readJsonList('medhaa-played-games');
      if (played.indexOf(currentGame.slug) === -1) {
        played.push(currentGame.slug);
        _writeJsonList('medhaa-played-games', played);
      }
      try { localStorage.setItem('medhaa-last-played-game', currentGame.slug); } catch (e) {}
    }

    var suggestions = _pickRecommendations(currentGame, 3);
    if (!suggestions.length) return;

    var existing = document.getElementById('medhaa-game-recommendations');
    if (existing) existing.remove();

    var style = document.getElementById('medhaa-game-recommendations-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'medhaa-game-recommendations-style';
      style.textContent = '#medhaa-game-recommendations{position:fixed;inset:0;z-index:1000000;display:flex;align-items:flex-end;justify-content:center;padding:18px;background:linear-gradient(180deg,rgba(6,10,18,.18),rgba(6,10,18,.76));font-family:Inter,system-ui,sans-serif;color:#172033}#medhaa-game-recommendations .mgr-panel{width:min(940px,100%);background:rgba(255,255,255,.96);border:1px solid rgba(15,23,42,.12);border-radius:22px;box-shadow:0 24px 80px rgba(2,8,23,.28);padding:18px}#medhaa-game-recommendations .mgr-head{display:flex;gap:14px;align-items:flex-start;justify-content:space-between;margin-bottom:14px}#medhaa-game-recommendations .mgr-kicker{margin:0 0 4px;font-size:11px;font-weight:900;letter-spacing:.11em;text-transform:uppercase;color:#0f766e}#medhaa-game-recommendations h2{margin:0;color:#172033;font-size:clamp(21px,3vw,31px);line-height:1.1}#medhaa-game-recommendations .mgr-sub{margin:6px 0 0;color:#607089;font-size:14px;line-height:1.45}#medhaa-game-recommendations .mgr-close{border:0;background:#eef2f7;color:#314054;border-radius:999px;width:36px;height:36px;font-size:22px;line-height:1;cursor:pointer}#medhaa-game-recommendations .mgr-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}#medhaa-game-recommendations .mgr-card{display:grid;grid-template-columns:auto 1fr;gap:11px;align-items:center;text-decoration:none;color:inherit;background:#f8fafc;border:1px solid rgba(15,23,42,.1);border-radius:16px;padding:13px;min-height:88px}#medhaa-game-recommendations .mgr-card:hover{border-color:#0f766e;box-shadow:0 10px 26px rgba(15,118,110,.14)}#medhaa-game-recommendations .mgr-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:14px;background:#e0f2f1;color:#0f766e;font-size:12px;font-weight:900;text-align:center}#medhaa-game-recommendations .mgr-title{display:block;font-size:15px;font-weight:900;color:#172033}#medhaa-game-recommendations .mgr-domain{display:block;margin-top:3px;font-size:12px;color:#64748b;text-transform:capitalize}#medhaa-game-recommendations .mgr-actions{display:flex;justify-content:space-between;gap:10px;margin-top:14px;align-items:center}#medhaa-game-recommendations .mgr-home{color:#0f766e;font-weight:800;text-decoration:none;font-size:14px}#medhaa-game-recommendations .mgr-muted{font-size:12px;color:#7b8797}@media(max-width:720px){#medhaa-game-recommendations{align-items:stretch;padding:10px}#medhaa-game-recommendations .mgr-panel{margin-top:auto;border-radius:18px;padding:15px}#medhaa-game-recommendations .mgr-grid{grid-template-columns:1fr}#medhaa-game-recommendations .mgr-actions{align-items:flex-start;flex-direction:column}}';
      document.head.appendChild(style);
    }

    var scoreLine = typeof rawScore === 'number' ? ' Score saved: ' + Math.round(rawScore) + '.' : '';
    var cards = suggestions.map(function (game) {
      return '<a class="mgr-card" href="' + _absoluteGameUrl(game.path) + '">' +
        '<span class="mgr-icon">' + _escapeHtml(game.emoji) + '</span>' +
        '<span><strong class="mgr-title">' + _escapeHtml(game.title) + '</strong>' +
        '<span class="mgr-domain">' + _escapeHtml(game.domain.replace(/-/g, ' ')) + '</span></span>' +
      '</a>';
    }).join('');

    var overlay = document.createElement('div');
    overlay.id = 'medhaa-game-recommendations';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = '<div class="mgr-panel">' +
      '<div class="mgr-head"><div><p class="mgr-kicker">Up next</p>' +
      '<h2>' + (currentGame ? 'More like ' + _escapeHtml(currentGame.title) : 'Recommended games') + '</h2>' +
      '<p class="mgr-sub">Try another Medhaa activity that builds a connected skill.' + _escapeHtml(scoreLine) + '</p></div>' +
      '<button class="mgr-close" type="button" aria-label="Close recommendations">&times;</button></div>' +
      '<div class="mgr-grid">' + cards + '</div>' +
      '<div class="mgr-actions"><a class="mgr-home" href="/student">Back to all games</a><span class="mgr-muted">Suggestions avoid games already played on this device when possible.</span></div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('.mgr-close').addEventListener('click', function () { overlay.remove(); });
    overlay.addEventListener('click', function (event) { if (event.target === overlay) overlay.remove(); });
    document.addEventListener('keydown', function onKey(event) {
      if (event.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', onKey);
      }
    });
  }

  function _notifyGameComplete(rawScore) {
    try {
      window.dispatchEvent(new CustomEvent('medhaa:game-complete', { detail: { score: rawScore, game: _inferCurrentGame() } }));
    } catch (e) {}
    setTimeout(function () { _showGameRecommendations(rawScore); }, 250);
  }

  window.MedhaaGameRecommendations = {
    show: _showGameRecommendations,
    getCurrentGame: _inferCurrentGame,
    getSuggestions: function () { return _pickRecommendations(_inferCurrentGame(), 3); }
  };

  // ── Environment detection ──────────────────────────────────────────────────
  // Only the real Electron desktop app (window.bhava set by preload.js) uses
  // the legacy roll-number/native-IPC path below. Web AND the Android/Capacitor
  // app both share the same Medhā login (JWT in localStorage) and go through
  // the simplified branch above instead — no roll-number login modal for either.
  var isElectron  = (typeof window !== 'undefined') &&
                  (typeof window.bhava !== 'undefined') &&
                  (window.bhava._isElectron !== false);
  var isActive = isElectron;

  if (!isActive) {
    var WEB_PLAYS_KEY  = 'bhava_web_plays';
    var WEB_USER_KEY   = 'bhava_web_user';
    var WEB_PLAY_LIMIT = 3;
    var DEV_MODE_KEY   = 'bhava_dev_mode';

    try {
      var params = new URLSearchParams(window.location.search);
      if (params.get('devmode') === '1') {
        localStorage.setItem(DEV_MODE_KEY, 'true');
      }
    } catch (e) {}

    var isDevMode = false;
    try { isDevMode = localStorage.getItem(DEV_MODE_KEY) === 'true'; } catch (e) {}

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
      try { return !!localStorage.getItem('accessToken'); }
      catch (e) { return false; }
    }

    var played   = getWebPlayed();
    var loggedIn = isWebLoggedIn();

    if (played.indexOf(GAME_NAME) === -1) {
      if (!isDevMode && !loggedIn && played.length >= WEB_PLAY_LIMIT) {
        window.location.href = '/student?gate=1';
        return;
      }
      played.push(GAME_NAME);
      try { localStorage.setItem(WEB_PLAYS_KEY, JSON.stringify(played)); } catch (e) {}
    }

    // Score/session tracking now talks directly to the current Medhā backend
    // (the old bhava-cloud roll-number system is fully bypassed here).
    var MEDHAA_API_URL = 'https://medhaa-tni1.onrender.com/api';
    var sessionStartedAt = Date.now();

    function _medhaaToken() {
      try { return localStorage.getItem('accessToken'); } catch (e) { return null; }
    }

    function _medhaaStudentId() {
      var token = _medhaaToken();
      if (!token) return null;
      try {
        var payload = JSON.parse(atob(token.split('.')[1]));
        return payload && payload.id ? payload.id : null;
      } catch (e) { return null; }
    }

    // Bridge the logged-in Medhā student id to bhava-game-nav.js's "My Report".
    var medhaaStudentId = _medhaaStudentId();
    if (medhaaStudentId) {
      window._bhavaStudentId = medhaaStudentId;
      try { sessionStorage.setItem('bhavaStudentId', medhaaStudentId); } catch (e) {}
    }

    function _saveScoreToMedhaa(rawScore) {
      var token = _medhaaToken();
      var game = _inferCurrentGame();
      if (!token || !game) return;
      var durationMs = Math.max(1000, Date.now() - sessionStartedAt);
      var accuracy = Math.max(0, Math.min(1, (Number(rawScore) || 0) / 100));
      fetch(MEDHAA_API_URL + '/games/' + game.slug + '/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({
          endTime: new Date().toISOString(),
          durationMs: durationMs,
          score: Number(rawScore) || 0,
          accuracy: accuracy,
          hintsUsed: 0,
          completionStatus: 'completed',
        }),
      }).catch(function (e) { console.warn('[BhavaSession] Could not save score to Medh\u0101:', e); });
    }

    window.BhavaSession = {
      end:        function (rawScore) { if (loggedIn) _saveScoreToMedhaa(rawScore); _notifyGameComplete(rawScore); },
      getStudent: function () { return medhaaStudentId ? { id: medhaaStudentId } : null; },
      isLoggedIn: function () { return loggedIn; },
      showLogin:  function () {},
      logout:     function () { try { localStorage.removeItem(WEB_USER_KEY); } catch (e) {} },
      setStudent: function () {},
    };
    _initGlobalMusic();
    return;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 1 — Student Storage
  // ─────────────────────────────────────────────────────────────────────────

  function persistStudent(student) {
    if (!student) return;
    currentStudent = student;
    window._bhavaStudentId = student.id;
    try {
      sessionStorage.setItem('bhava_student',    JSON.stringify(student));
      sessionStorage.setItem('bhavaStudentId',   String(student.id));
      sessionStorage.setItem('bhava_student_id', String(student.id));
      sessionStorage.setItem('studentId',        String(student.id));
    } catch (e) {}
    try {
      localStorage.setItem('bhava_current_student', JSON.stringify(student));
    } catch (e) {}
  }

  function restoreStudent() {
    try {
      var saved = sessionStorage.getItem('bhava_student');
      if (saved) {
        var obj = JSON.parse(saved);
        if (obj && obj.id != null) {
          currentStudent = obj;
          window._bhavaStudentId = obj.id;
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function clearStudent() {
    currentStudent   = null;
    currentSessionId = null;
    window._bhavaStudentId = null;
    try {
      sessionStorage.removeItem('bhava_student');
      sessionStorage.removeItem('bhavaStudentId');
      sessionStorage.removeItem('bhava_student_id');
      sessionStorage.removeItem('studentId');
    } catch (e) {}
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 2 — Login Modal
  // ─────────────────────────────────────────────────────────────────────────

  function showLoginModal() {
    if (document.getElementById('bhava-login-modal')) return;

    var classes = [1,2,3,4,5,6,7,8,9,10,11,12].map(function (c) {
      return '<option value="' + c + '">Class ' + c + '</option>';
    }).join('');

    var modal = document.createElement('div');
    modal.id = 'bhava-login-modal';
    modal.innerHTML = '<div style="'
      + 'position:fixed;inset:0;background:rgba(0,0,0,0.80);z-index:999999;'
      + 'display:flex;align-items:center;justify-content:center;'
      + 'font-family:system-ui,sans-serif;">'
      + '<div style="'
      + 'background:#fff;border-radius:16px;padding:2.5rem 2rem;width:340px;'
      + 'box-shadow:0 8px 40px rgba(1,105,111,0.25);text-align:center;">'
      + '<svg width="44" height="44" viewBox="0 0 48 48" style="margin-bottom:8px;display:inline-block">'
      + '<circle cx="24" cy="24" r="22" fill="#01696f"/>'
      + '<text x="24" y="30" text-anchor="middle" fill="white"'
      + ' font-size="18" font-weight="bold" font-family="sans-serif">\u092D</text>'
      + '</svg>'
      + '<h2 style="margin:0 0 2px;color:#01696f;font-size:1.35rem">Bh\u0101va Tech</h2>'
      + '<p style="color:#888;font-size:0.82rem;margin:0 0 18px">'
      + 'Login to save progress &amp; earn reports</p>'
      + '<label style="display:block;text-align:left;font-size:0.8rem;font-weight:600;'
      + 'color:#333;margin-bottom:3px">Roll Number</label>'
      + '<input id="bt-roll" type="number" placeholder="e.g. 1001"'
      + ' style="width:100%;padding:9px 12px;border:1.5px solid #ddd;border-radius:8px;'
      + 'font-size:1rem;margin-bottom:10px;box-sizing:border-box;outline:none"/>'
      + '<label style="display:block;text-align:left;font-size:0.8rem;font-weight:600;'
      + 'color:#333;margin-bottom:3px">Class</label>'
      + '<select id="bt-class"'
      + ' style="width:100%;padding:9px 12px;border:1.5px solid #ddd;border-radius:8px;'
      + 'font-size:0.92rem;margin-bottom:14px;box-sizing:border-box;background:#fff;outline:none">'
      + '<option value="">Select class</option>'
      + classes
      + '</select>'
      + '<div id="bt-err" style="color:#a12c7b;font-size:0.8rem;min-height:16px;margin-bottom:8px"></div>'
      + '<button id="bt-login-btn"'
      + ' style="width:100%;padding:11px;background:#01696f;color:#fff;border:none;'
      + 'border-radius:8px;font-size:0.95rem;font-weight:700;cursor:pointer;margin-bottom:8px">'
      + '&#9654; Login &amp; Play</button>'
      + '<button id="bt-guest-btn"'
      + ' style="width:100%;padding:9px;background:#f3f3f3;color:#555;border:none;'
      + 'border-radius:8px;font-size:0.85rem;cursor:pointer">'
      + 'Continue as Guest</button>'
      + '<p style="font-size:0.7rem;color:#ccc;margin:10px 0 0">'
      + 'Ask your teacher for your Roll No</p>'
      + '</div></div>';

    document.body.appendChild(modal);

    modal.querySelector('div').addEventListener('click', function (e) {
      e.stopPropagation();
    });

    document.getElementById('bt-guest-btn').addEventListener('click', function () {
      modal.remove();
    });

    document.getElementById('bt-login-btn').addEventListener('click', async function () {
      var rollNo = parseInt(document.getElementById('bt-roll').value, 10);
      var cls    = document.getElementById('bt-class').value;
      var errEl  = document.getElementById('bt-err');

      if (!rollNo || !cls) { errEl.textContent = 'Enter Roll No and Class.'; return; }
      errEl.textContent = '';

      var btn = document.getElementById('bt-login-btn');
      btn.textContent = 'Checking…';
      btn.disabled = true;

      try {
        var student;

        if (window.bhava && window.bhava._isElectron !== false) {
          student = await window.bhava.login(rollNo, cls);
        } else {
          var res = await fetch(
            CLOUD_URL + '/sync/student-lookup?roll=' + encodeURIComponent(rollNo) +
            '&class=' + encodeURIComponent(cls),
            { headers: { 'x-bhava-sync-key': CLOUD_KEY } }
          );
          student = res.ok ? await res.json() : null;
          if (student && student.roll_number && !student.roll_no) {
            student.roll_no = student.roll_number;
          }
        }

        if (!student || !student.id) {
          errEl.textContent = 'Not found. Check Roll No and Class.';
          btn.textContent = '\u25B6 Login & Play';
          btn.disabled = false;
          return;
        }

        persistStudent(student);
        _syncToNav();
        modal.remove();
        startSession();

      } catch (err) {
        errEl.textContent = 'Login error: ' + (err.message || err);
        btn.textContent = '\u25B6 Login & Play';
        btn.disabled = false;
      }
    });

    document.getElementById('bt-roll').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') document.getElementById('bt-login-btn').click();
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 3 — Session Management
  // ─────────────────────────────────────────────────────────────────────────

  async function startSession() {
    if (!currentStudent) return;
    try {
      if (window.bhava && window.bhava._isElectron !== false) {
        currentSessionId = await window.bhava.startSession(
          currentStudent.id,
          currentStudent.school_id || SCHOOL_ID,
          GAME_NAME
        );
        console.log('[BhavaSession] started:', currentSessionId, '| game:', GAME_NAME);
      } else {
        currentSessionId = 'and-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
        console.log('[BhavaSession] Android session ID generated:', currentSessionId, '| game:', GAME_NAME);
      }
    } catch (e) {
      console.error('[BhavaSession] startSession failed:', e);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 4 — Score helpers
  // ─────────────────────────────────────────────────────────────────────────

  function extractTotal(v) {
    if (v == null) return null;
    if (typeof v.total           === 'number') return Math.round(v.total);
    if (typeof v.iq_score        === 'number') return Math.round(v.iq_score);
    if (typeof v.eq_score        === 'number') return Math.round(v.eq_score);
    if (typeof v.sq_score        === 'number') return Math.round(v.sq_score);
    if (typeof v.score           === 'number') return Math.round(v.score);
    if (typeof v.composite       === 'number') return Math.round(v.composite);
    var keys = Object.keys(v);
    for (var i = 0; i < keys.length; i++) {
      if (typeof v[keys[i]] === 'number' && v[keys[i]] > 0) return Math.round(v[keys[i]]);
    }
    return null;
  }

  function fmtScore(promiseResult) {
    if (!promiseResult || promiseResult.status !== 'fulfilled' || !promiseResult.value) return '—';
    var n = extractTotal(promiseResult.value);
    return n != null ? n : '—';
  }
  
    // ─────────────────────────────────────────────────────────────────────────
  // SECTION 5 — Nav Bar (injected into every game page)
  // ─────────────────────────────────────────────────────────────────────────

  function injectNavBar() {
    if (document.getElementById('bhava-game-nav')) return;

    var style = document.createElement('style');
    style.textContent =
      '#bhava-game-nav{position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;' +
      'align-items:center;gap:8px;padding:6px 14px;height:44px;' +
      'background:rgba(10,8,20,0.88);backdrop-filter:blur(14px);' +
      '-webkit-backdrop-filter:blur(14px);' +
      'border-bottom:1px solid rgba(255,255,255,0.08);' +
      "font-family:'Poppins','Inter',sans-serif;}" +
      '#bhava-game-nav-spacer{height:44px;display:block;}' +
      '#bhava-game-nav .bgnav-btn{display:inline-flex;align-items:center;gap:5px;' +
      'padding:5px 13px;border-radius:999px;font-size:12px;font-weight:700;' +
      'letter-spacing:.04em;border:1px solid transparent;cursor:pointer;' +
      'transition:background .18s,border-color .18s,transform .15s;' +
      'white-space:nowrap;font-family:inherit;background:none;}' +
      '#bhava-game-nav .bgnav-btn:active{transform:scale(.95);}' +
      '#bhava-game-nav .bgnav-back{background:rgba(255,255,255,.05);' +
      'border-color:rgba(255,255,255,.12);color:#94a3b8;}' +
      '#bhava-game-nav .bgnav-back:hover{background:rgba(255,255,255,.12);' +
      'border-color:rgba(255,255,255,.28);color:#e2e8f0;}' +
      '#bhava-game-nav .bgnav-home{background:rgba(109,40,217,.18);' +
      'border-color:rgba(167,139,250,.35);color:#c4b5fd;}' +
      '#bhava-game-nav .bgnav-home:hover{background:rgba(109,40,217,.35);' +
      'border-color:rgba(167,139,250,.65);color:#e9d5ff;}' +
      '#bhava-game-nav .bgnav-title{font-size:11px;font-weight:600;' +
      'color:rgba(255,255,255,.28);letter-spacing:.08em;text-transform:uppercase;' +
      'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;}' +
      '#bhava-game-nav .bgnav-report{background:rgba(1,105,111,.18);' +
      'border-color:rgba(79,152,163,.4);color:#67e8f9;margin-left:auto;}' +
      '#bhava-game-nav .bgnav-report:hover{background:rgba(1,105,111,.35);' +
      'border-color:rgba(79,152,163,.7);color:#a5f3fc;}' +
      '#bhava-game-nav .bgnav-report.bgnav-hidden{display:none;}' +
      '#bgnav-modal{display:none;position:fixed;inset:0;z-index:10000;' +
      'background:rgba(5,5,15,.92);backdrop-filter:blur(18px);' +
      '-webkit-backdrop-filter:blur(18px);align-items:center;justify-content:center;' +
      "padding:20px;font-family:'Poppins','Inter',sans-serif;}" +
      '#bgnav-modal.bgnav-open{display:flex;}' +
      '#bgnav-modal-inner{background:linear-gradient(145deg,#0f0e1a,#1a1630);' +
      'border:1px solid rgba(167,139,250,.25);border-radius:20px;' +
      'padding:28px 24px;width:100%;max-width:460px;' +
      'box-shadow:0 24px 64px rgba(0,0,0,.5);}' +
      '#bgnav-modal-inner h3{font-size:18px;font-weight:800;color:#e2e8f0;' +
      'margin:0 0 4px;display:flex;align-items:center;gap:8px;}' +
      '.bgnav-msub{font-size:12px;color:#64748b;margin-bottom:20px;}' +
      '.bgnav-srow{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:18px;}' +
      '.bgnav-sc{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);' +
      'border-radius:14px;padding:14px 10px;text-align:center;}' +
      '.bgnav-sc .sl{font-size:10px;font-weight:700;letter-spacing:.1em;' +
      'text-transform:uppercase;color:#64748b;margin-bottom:6px;}' +
      '.bgnav-sc .sv{font-size:26px;font-weight:800;font-variant-numeric:tabular-nums;line-height:1;}' +
      '.bgnav-sc.iq .sv{color:#818cf8;}.bgnav-sc.eq .sv{color:#f472b6;}.bgnav-sc.sq .sv{color:#34d399;}' +
      '.bgnav-slbl{font-size:10px;font-weight:700;letter-spacing:.08em;' +
      'text-transform:uppercase;color:#475569;margin-bottom:8px;}' +
      '.bgnav-si{display:flex;align-items:center;justify-content:space-between;' +
      'padding:8px 12px;background:rgba(255,255,255,.03);border-radius:10px;' +
      'margin-bottom:6px;font-size:12px;color:#94a3b8;' +
      'border:1px solid rgba(255,255,255,.05);}' +
      '.bgnav-si .sg{font-weight:600;color:#c4b5fd;flex:1;' +
      'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}' +
      '.bgnav-si .ss{color:#fde68a;font-weight:700;margin:0 8px;white-space:nowrap;}' +
      '.bgnav-tag{display:inline-block;font-size:10px;font-weight:700;padding:2px 7px;' +
      'border-radius:999px;margin-left:4px;}' +
      '.bgnav-tag.done{background:rgba(52,211,153,.12);color:#34d399;}' +
      '.bgnav-tag.playing{background:rgba(251,191,36,.1);color:#fbbf24;}' +
      '.bgnav-actions{display:flex;gap:10px;margin-top:18px;}' +
      '.bgnav-actions button{flex:1;padding:10px;border-radius:10px;font-size:13px;' +
      'font-weight:700;cursor:pointer;font-family:inherit;border:none;' +
      'transition:opacity .2s;}' +
      '.bgnav-actions button:hover{opacity:.85;}' +
      '.bgnav-btn-close{background:rgba(255,255,255,.08)!important;' +
      'color:#94a3b8!important;border:1px solid rgba(255,255,255,.1)!important;}' +
      '.bgnav-btn-report-full{background:linear-gradient(135deg,#01696f,#06b6d4);color:#fff;}' +
      '.bgnav-info{text-align:center;color:#475569;font-size:13px;' +
      'padding:18px;border:1px dashed rgba(255,255,255,.08);border-radius:12px;}' +
      '.bgnav-loading{text-align:center;color:#475569;font-size:13px;padding:18px 0;}';
    document.head.appendChild(style);

    var gameTitle = (document.title || 'Game')
      .replace(/bh[aā]va|tech/gi, '').trim().slice(0, 32) || 'Medhā Game';

    var nav = document.createElement('div');
    nav.id = 'bhava-game-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Game navigation');
    nav.innerHTML =
      '<button class="bgnav-btn bgnav-back"   id="bgnav-back"   aria-label="Go back">&#8592; Back</button>' +
      '<button class="bgnav-btn bgnav-home"   id="bgnav-home"   aria-label="Go home">&#127968; Home</button>' +
      '<span  class="bgnav-title">' + gameTitle + '</span>' +
      '<button class="bgnav-btn bgnav-report bgnav-hidden" id="bgnav-report" aria-label="My report">&#128202; My Report</button>';

    var spacer = document.createElement('div');
    spacer.id = 'bhava-game-nav-spacer';

    document.body.insertBefore(spacer, document.body.firstChild);
    document.body.insertBefore(nav,    document.body.firstChild);

    var modal = document.createElement('div');
    modal.id = 'bgnav-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML =
      '<div id="bgnav-modal-inner">' +
        '<h3>&#128202; My Report</h3>' +
        '<div class="bgnav-msub" id="bgnav-msub">Your cognitive scores</div>' +
        '<div id="bgnav-mbody"><div class="bgnav-loading">Fetching scores from Bh\u0101va DB\u2026</div></div>' +
        '<div class="bgnav-actions">' +
          '<button class="bgnav-btn-close"       id="bgnav-mclose">&#10005; Close</button>' +
          '<button class="bgnav-btn-report-full" id="bgnav-mfull">&#128196; Full Report</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    document.getElementById('bgnav-back').addEventListener('click', _goBack);
    document.getElementById('bgnav-home').addEventListener('click', _goHome);
    document.getElementById('bgnav-mclose').addEventListener('click', function () {
      modal.classList.remove('bgnav-open');
    });
    document.getElementById('bgnav-mfull').addEventListener('click', function () {
      _openReportPage();
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.remove('bgnav-open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') modal.classList.remove('bgnav-open');
    });

    document.getElementById('bgnav-report').addEventListener('click', _openReportModal);

    var checks = 0;
    var poll = setInterval(function () {
      if (currentStudent || window.bhava) {
        document.getElementById('bgnav-report').classList.remove('bgnav-hidden');
        clearInterval(poll);
      }
      if (++checks > 30) clearInterval(poll);
    }, 200);
  }

  function _goHome() {
    var here = window.location.pathname;
    if (here.indexOf('/docs/') !== -1) {
      window.location.href = 'index.html';
    } else {
      window.location.href = 'docs/index.html';
    }
  }
  function _goBack() {
    window.history.length > 1 ? window.history.back() : _goHome();
  }

  function _openReportPage() {
    var sid = _resolveStudentId();
    var base = 'bhava-student-report.html';
    window.location.href = base + (sid ? '?sid=' + encodeURIComponent(sid) : '');
  }

  function _resolveStudentId() {
    if (currentStudent && currentStudent.id != null) return String(currentStudent.id);
    if (window._bhavaStudentId) return String(window._bhavaStudentId);
    var keys = ['bhava_student', 'bhavaStudentId', 'bhava_student_id', 'studentId'];
    try {
      var json = sessionStorage.getItem('bhava_student');
      if (json) { var obj = JSON.parse(json); if (obj && obj.id) return String(obj.id); }
    } catch (e) {}
    for (var i = 1; i < keys.length; i++) {
      try { var v = sessionStorage.getItem(keys[i]); if (v) return v; } catch (e) {}
    }
    try {
      var p = new URLSearchParams(window.location.search);
      return p.get('sid') || p.get('studentId') || null;
    } catch (e) {}
    return null;
  }

  function _syncToNav() {
    var sid = _resolveStudentId();
    if (!sid) return;
    window._bhavaStudentId = sid;
    var btn = document.getElementById('bgnav-report');
    if (btn) btn.classList.remove('bgnav-hidden');
    if (window.BhavaNav && typeof window.BhavaNav.setStudent === 'function') {
      window.BhavaNav.setStudent(sid);
    }
  }

  async function _openReportModal() {
    var modal = document.getElementById('bgnav-modal');
    if (!modal) return;
    modal.classList.add('bgnav-open');

    var body = document.getElementById('bgnav-mbody');
    var sub  = document.getElementById('bgnav-msub');
    body.innerHTML = '<div class="bgnav-loading">Fetching scores from Bh\u0101va DB\u2026</div>';

    var sid = _resolveStudentId();
    if (!sid) {
      body.innerHTML = '<div class="bgnav-info">Not logged in.<br>Please log in from Home first.</div>';
      return;
    }

    if (currentStudent && currentStudent.name) {
      sub.textContent = currentStudent.name + (currentStudent.class ? ' \u00B7 Class ' + currentStudent.class : '');
    } else {
      sub.textContent = 'Student ID: ' + sid;
    }

    try {
      var iq = '—', eq = '—', sq = '—', sessions = [];

      if (window.bhava && window.bhava._isElectron !== false) {
        var results = await Promise.allSettled([
          window.bhava.getIQScores(sid),
          window.bhava.getEQScores(sid),
          window.bhava.getSQScores(sid),
          window.bhava.getGameSessions(sid)
        ]);
        iq = fmtScore(results[0]);
        eq = fmtScore(results[1]);
        sq = fmtScore(results[2]);
        sessions = (results[3].status === 'fulfilled' && Array.isArray(results[3].value))
          ? results[3].value.filter(function (s) { return s.game_name !== 'TestGame'; }).slice(0, 5)
          : [];
      } else {
        var qRes = await fetch(
          CLOUD_URL + '/sync/student-quotients?student_id=' + encodeURIComponent(sid),
          { headers: { 'x-bhava-sync-key': CLOUD_KEY } }
        );
        if (qRes.ok) {
          var qData = await qRes.json();
          iq = qData.iq_total != null ? Math.round(qData.iq_total) : '—';
          eq = qData.eq_total != null ? Math.round(qData.eq_total) : '—';
          sq = qData.sq_total != null ? Math.round(qData.sq_total) : '—';
        }
        var sRes = await fetch(
          CLOUD_URL + '/sync/student-sessions?student_id=' + encodeURIComponent(sid) + '&limit=5',
          { headers: { 'x-bhava-sync-key': CLOUD_KEY } }
        );
        if (sRes.ok) {
          var sData = await sRes.json();
          sessions = Array.isArray(sData) ? sData : [];
        }
      }

      var sessHtml = sessions.length === 0
        ? '<div class="bgnav-info">No sessions yet. Start playing!</div>'
        : sessions.map(function (s) {
            var done  = s.completed === 1 || s.completed === true;
            var score = s.raw_score != null ? s.raw_score + ' pts' : '\u2014';
            var date  = s.started_at
              ? new Date(s.started_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
              : '';
            return '<div class="bgnav-si">'
              + '<span class="sg">' + (s.game_name || 'Game') + '</span>'
              + '<span class="ss">' + score + '</span>'
              + '<span>' + date + '<span class="bgnav-tag ' + (done ? 'done' : 'playing') + '">'
              + (done ? 'done' : 'live') + '</span></span>'
              + '</div>';
          }).join('');

      body.innerHTML =
        '<div class="bgnav-srow">' +
          '<div class="bgnav-sc iq"><div class="sl">IQ</div><div class="sv">' + iq + '</div></div>' +
          '<div class="bgnav-sc eq"><div class="sl">EQ</div><div class="sv">' + eq + '</div></div>' +
          '<div class="bgnav-sc sq"><div class="sl">SQ</div><div class="sv">' + sq + '</div></div>' +
        '</div>' +
        '<div class="bgnav-slbl">Recent Sessions</div>' +
        sessHtml;

    } catch (err) {
      body.innerHTML = '<div class="bgnav-info">Error: ' + err.message + '</div>';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 6 — Public API
  // ─────────────────────────────────────────────────────────────────────────

  window.BhavaSession = {
    end: async function (rawScore) {
      if (!currentStudent || !currentSessionId) {
        console.log('[BhavaSession] Guest mode — score not saved:', rawScore);
        _notifyGameComplete(rawScore);
        return;
      }
      try {
        if (window.bhava && window.bhava._isElectron !== false) {
          var result = await window.bhava.endSession(currentSessionId, rawScore);
          console.log('[BhavaSession] Score saved. Scaled:', result && result.scaled);
        } else {
          var now = new Date().toISOString();
          await fetch(CLOUD_URL + '/sync/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-bhava-sync-key': CLOUD_KEY
            },
            body: JSON.stringify({
              id:               currentSessionId,
              student_id:       currentStudent.id,
              school_id:        currentStudent.school_id || SCHOOL_ID,
              game_name:        GAME_NAME,
              raw_score:        rawScore,
              completed:        true,
              started_at:       now,
              ended_at:         now,
              duration_minutes: 0
            })
          });
          console.log('[BhavaSession] Score posted to cloud (Android).');
        }
        currentSessionId = null;
      } catch (e) {
        console.error('[BhavaSession] endSession failed:', e);
      }
      _notifyGameComplete(rawScore);
    },

    getStudent:  function () { return currentStudent; },
    isLoggedIn:  function () { return currentStudent !== null; },
    showLogin:   showLoginModal,
    logout:      clearStudent,

    setStudent:  function (student) {
      persistStudent(student);
      _syncToNav();
    },

    openReport:     _openReportModal,
    openReportPage: _openReportPage,
    goHome:         _goHome,
    goBack:         _goBack,
  };

  window.BhavaNav = {
    setStudent:     function (id) {
      window._bhavaStudentId = String(id);
      try { sessionStorage.setItem('bhavaStudentId', String(id)); } catch (e) {}
      var btn = document.getElementById('bgnav-report');
      if (btn) btn.classList.remove('bgnav-hidden');
    },
    openReport:     _openReportModal,
    openReportPage: _openReportPage,
    goHome:         _goHome,
    goBack:         _goBack,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 7 — Auto-init
  // ─────────────────────────────────────────────────────────────────────────

  function init() {
    injectNavBar();
    _initGlobalMusic();

    var alreadyLoggedIn = restoreStudent();
    if (alreadyLoggedIn) {
      _syncToNav();
      startSession();
    } else { /* login modal disabled — legacy system retired */ }

    setTimeout(function () { if (currentStudent) _syncToNav(); }, 300);
    setTimeout(function () { if (currentStudent) _syncToNav(); }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
