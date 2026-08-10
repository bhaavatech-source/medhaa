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
}
