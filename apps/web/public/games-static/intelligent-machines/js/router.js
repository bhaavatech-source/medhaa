/* ================================================================
   ROUTER — handles switching between the 4 levels
   ================================================================ */

const LEVEL_RENDERERS = {
  1: renderLevel1,
  2: renderLevel2,
  3: renderLevel3,
  4: renderLevel4
};

function goToLevel(levelNum){
  $$('.level-section').forEach(s => s.classList.remove('active-level'));
  $('#level-' + levelNum).classList.add('active-level');

  $$('.nav-btn').forEach(b => b.classList.remove('active'));
  $(`.nav-btn[data-level="${levelNum}"]`).classList.add('active');

  const renderer = LEVEL_RENDERERS[levelNum];
  if(renderer) renderer();

  window.scrollTo({top:0, behavior:'smooth'});

  const nav = $('#level-nav');
  if(nav.classList.contains('mobile-open')) nav.classList.remove('mobile-open');

  updateGameNavNext(levelNum);
}

function currentLevelNum(){
  const active = $('.level-section.active-level');
  return active ? parseInt(active.id.replace('level-', ''), 10) : 1;
}

// Wires the shared nav bar's opt-in Next button to this game's own level
// order — levels here are freely browsable (no completion gating), so Next
// simply advances by one and hides itself on the last level.
function updateGameNavNext(levelNum){
  if(typeof window.BhavaNav === 'undefined') return;
  const n = parseInt(levelNum, 10);
  if(n < 4){
    window.BhavaNav.setNext(() => goToLevel(n + 1));
    window.BhavaNav.setNextEnabled(true);
  } else {
    window.BhavaNav.clearNext();
  }
}

function initRouter(){
  $$('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if(typeof SoundEngine !== 'undefined'){
        SoundEngine.play('nav');
      }

      goToLevel(btn.dataset.level);
    });

    btn.addEventListener('mouseenter', () => {
      if(typeof SoundEngine !== 'undefined'){
        SoundEngine.play('hover');
      }
    });
  });

  const menuToggle = $('#menu-toggle');

  if(menuToggle){
    menuToggle.addEventListener('click', () => {
      $('#level-nav').classList.toggle('mobile-open');
    });
  }

  // The shared nav bar's Back button restores a previous `.level-section`
  // by re-adding `active-level` directly — re-run that level's renderer and
  // resync the top tab/Next-button state so it's not left stale.
  document.addEventListener('bhava:screen-restored', (e) => {
    if(e.detail.selector !== '.level-section') return;
    const levelNum = currentLevelNum();

    $$('.nav-btn').forEach(b => b.classList.remove('active'));
    const tab = $(`.nav-btn[data-level="${levelNum}"]`);
    if(tab) tab.classList.add('active');

    const renderer = LEVEL_RENDERERS[levelNum];
    if(renderer) renderer();

    updateGameNavNext(levelNum);
  });

  updateGameNavNext(currentLevelNum());
}
