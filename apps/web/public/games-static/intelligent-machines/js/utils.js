/* ================================================================
   UTILS — small reusable helpers used across the app
   ================================================================ */

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function el(tag, cls, html){
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(html !== undefined) e.innerHTML = html;
  return e;
}

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function openModal(html){
  const overlay = $('#modal-overlay');
  const content = $('#modal-content');

  content.innerHTML =
    '<button class="modal-close" aria-label="Close">&times;</button>' +
    html;

  overlay.classList.add('active');

  $('.modal-close', content).addEventListener('click', closeModal);

  if(typeof SoundEngine !== 'undefined'){
    SoundEngine.play('open');
  }
}

function closeModal(){
  $('#modal-overlay').classList.remove('active');

  if(typeof SoundEngine !== 'undefined'){
    SoundEngine.play('close');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const overlay = $('#modal-overlay');
  if(overlay){
    overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });
  }
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });
});

/* Simple engagement tracker used by Level 4 Curiosity Explorer.
   Persists in-memory only (no backend, no external storage dependency beyond localStorage which is optional). */
const EngagementTracker = {
  data: {},
  record(abilityId, seconds=1){
    this.data[abilityId] = (this.data[abilityId] || 0) + seconds;
    try{ localStorage.setItem('bhava_engagement', JSON.stringify(this.data)); }catch(e){}
  },
  load(){
    try{
      const raw = localStorage.getItem('bhava_engagement');
      if(raw) this.data = JSON.parse(raw);
    }catch(e){}
  },
  top(n=3){
    return Object.entries(this.data).sort((a,b)=>b[1]-a[1]).slice(0,n).map(x=>x[0]);
  },
  reset(){
    this.data = {};
    try{ localStorage.removeItem('bhava_engagement'); }catch(e){}
  }
};
EngagementTracker.load();

function badgeClass(winner){
  if(winner === 'human') return 'badge human';
  if(winner === 'machine') return 'badge machine';
  return 'badge both';
}
