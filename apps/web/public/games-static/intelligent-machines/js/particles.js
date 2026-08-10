/* ================================================================
   PARTICLE BACKGROUND — lightweight canvas particle field
   ================================================================ */

(function(){
  const canvas = document.getElementById('particle-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const COUNT = window.innerWidth < 640 ? 35 : 70;
  const COLORS = ['#00e5ff','#7c3aed','#ff2d95','#00ffa3'];

  function makeParticle(){
    return {
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.8 + 0.6,
      vx: (Math.random()-0.5)*0.25,
      vy: (Math.random()-0.5)*0.25,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      alpha: Math.random()*0.5 + 0.15
    };
  }
  for(let i=0;i<COUNT;i++) particles.push(makeParticle());

  function step(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0) p.x = w; if(p.x > w) p.x = 0;
      if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(step);
  }
  step();
})();
