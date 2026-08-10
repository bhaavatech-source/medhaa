// games-static/_shared/medhaa-bridge.js
// Drop this single file into every existing game folder and include it
// via <script src="../_shared/medhaa-bridge.js"></script> in each game's
// index.html. It gives the game three simple global functions to call —
// no other changes to your existing game code are required.

(function () {
  function postToHost(type, payload) {
    window.parent.postMessage({ type, payload }, '*');
  }

  // Call this once when your game actually starts (e.g. after "Play" tap).
  window.medhaaSessionStart = function () {
    postToHost('MEDHAA_SESSION_START', {});
  };

  // Call this once when the game ends, win/lose/quit — pass real metrics.
  // Example: medhaaSessionEnd({ durationMs: 42000, score: 87, accuracy: 0.91,
  //   hintsUsed: 2, completionStatus: "completed" });
  window.medhaaSessionEnd = function (metrics) {
    postToHost('MEDHAA_SESSION_END', metrics);
  };

  // Call this every time your game reveals a hint to the player.
  window.medhaaHintUsed = function () {
    postToHost('MEDHAA_HINT_USED', {});
  };
})();
