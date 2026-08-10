/* ================================================================
   EFFECTS — confetti and celebration visual effects.
   ================================================================ */

const Effects = {
  bursts: [],

  confettiBurst(x, y, count=26){
    const colors = [
      '#00e5ff',
      '#7c3aed',
      '#ff2d95',
      '#00ffa3',
      '#ffb800'
    ];

    for(let i = 0; i < count; i++){
      this.bursts.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 1.2) * 6,
        r: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.3
      });
    }
  },

  screenFlash(color='rgba(0,255,163,0.12)'){
    const flash = document.createElement('div');

    flash.style.position = 'fixed';
    flash.style.inset = '0';
    flash.style.background = color;
    flash.style.zIndex = '4999';
    flash.style.pointerEvents = 'none';
    flash.style.transition = 'opacity .5s ease';

    document.body.appendChild(flash);

    requestAnimationFrame(() => {
      flash.style.opacity = '0';
    });

    setTimeout(() => flash.remove(), 550);
  },

  celebrate(centerX, centerY){
    this.confettiBurst(
      centerX || window.innerWidth / 2,
      centerY || window.innerHeight / 2,
      34
    );

    this.screenFlash('rgba(0,255,163,0.10)');
    SoundEngine.play('complete');
  }
};

(function(){
  function step(){
    if(Effects.bursts.length){
      const canvas = document.getElementById('particle-canvas');
      const ctx = canvas.getContext('2d');

      Effects.bursts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life -= 0.018;
        p.rot += p.vrot;

        if(p.life > 0){
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
          ctx.restore();
        }
      });

      Effects.bursts = Effects.bursts.filter(p => p.life > 0);
    }

    requestAnimationFrame(step);
  }

  step();
})();