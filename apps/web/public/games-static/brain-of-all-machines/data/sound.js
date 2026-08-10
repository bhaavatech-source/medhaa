/* ================================================================
   SOUND ENGINE — synthesized UI sounds using Web Audio API.
   No external audio files needed.
   ================================================================ */

const SoundEngine = {
  ctx: null,
  muted: false,
  unlocked: false,

  init(){
    if(this.ctx) return;

    try{
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }catch(e){
      this.ctx = null;
    }

    try{
      const saved = localStorage.getItem('bhava_muted');
      this.muted = saved === '1';
    }catch(e){}
  },

  unlock(){
    if(!this.ctx) this.init();

    if(this.ctx && this.ctx.state === 'suspended'){
      this.ctx.resume();
    }

    this.unlocked = true;
  },

  toggleMute(){
    this.muted = !this.muted;

    try{
      localStorage.setItem('bhava_muted', this.muted ? '1' : '0');
    }catch(e){}

    return this.muted;
  },

  _tone(freq, duration, type='sine', volume=0.18, delay=0){
    if(!this.ctx || this.muted) return;

    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);

    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(volume, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  },

  _sweep(f1, f2, duration, type='sine', volume=0.16){
    if(!this.ctx || this.muted) return;

    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(f1, t0);
    osc.frequency.exponentialRampToValueAtTime(f2, t0 + duration);

    gain.gain.setValueAtTime(volume, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  },

  play(name){
    if(!this.ctx || this.muted) return;

    switch(name){
      case 'click':
        this._tone(720, 0.08, 'triangle', 0.12);
        break;

      case 'hover':
        this._tone(920, 0.05, 'sine', 0.05);
        break;

      case 'nav':
        this._sweep(400, 900, 0.25, 'sine', 0.14);
        break;

      case 'correct':
        this._tone(660, 0.12, 'triangle', 0.18);
        this._tone(990, 0.18, 'triangle', 0.16, 0.1);
        break;

      case 'wrong':
        this._tone(220, 0.22, 'sawtooth', 0.14);
        break;

      case 'open':
        this._sweep(300, 700, 0.2, 'sine', 0.12);
        break;

      case 'close':
        this._sweep(700, 300, 0.15, 'sine', 0.1);
        break;

      case 'match':
        this._tone(880, 0.15, 'sine', 0.15);
        break;

      case 'complete':
        [523, 659, 784, 1046].forEach((f, i) => {
          this._tone(f, 0.2, 'triangle', 0.16, i * 0.12);
        });
        break;

      case 'boot':
        this._sweep(120, 600, 0.6, 'sine', 0.1);
        break;

      default:
        this._tone(500, 0.1, 'sine', 0.1);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const unlockOnce = () => {
    SoundEngine.unlock();
    document.removeEventListener('pointerdown', unlockOnce);
  };

  document.addEventListener('pointerdown', unlockOnce);
});