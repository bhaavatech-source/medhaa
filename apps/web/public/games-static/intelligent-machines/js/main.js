/* ================================================================
   MAIN — bootstraps the application
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  renderLevel1();
  initSoundToggle();
  renderExplorerProgress();

  setTimeout(() => {
    const loader = $('#loader-screen');

    if(loader){
      loader.classList.add('loaded');
    }

    SoundEngine.init();
    SoundEngine.play('boot');
  }, 900);
});

function initSoundToggle(){
  const btn = $('#sound-toggle');

  if(!btn) return;

  SoundEngine.init();

  if(SoundEngine.muted){
    btn.textContent = '🔇';
    btn.classList.add('muted');
  }

  btn.addEventListener('click', () => {
    const muted = SoundEngine.toggleMute();

    btn.textContent = muted ? '🔇' : '🔊';
    btn.classList.toggle('muted', muted);

    if(!muted){
      SoundEngine.play('click');
    }
  });
}