const ExplorerProgress = {
  storageKey: 'bhava_explorer_progress',

  state: {
    completedQuizzes: {},
    unlockedBadges: []
  },

  load(){
    try{
      const saved = JSON.parse(
        localStorage.getItem(this.storageKey)
      );

      if(saved){
        this.state = {
          completedQuizzes: saved.completedQuizzes || {},
          unlockedBadges: saved.unlockedBadges || []
        };
      }
    }catch(e){}

    return this.state;
  },

  save(){
    try{
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.state)
      );
    }catch(e){}
  },

  recordQuiz(abilityId, percent){
    const previous = this.state.completedQuizzes[abilityId] || 0;

    this.state.completedQuizzes[abilityId] = Math.max(
      previous,
      percent
    );

    const newBadges = this.checkBadges();

    this.save();

    return newBadges;
  },

  completedIds(){
    return Object.keys(this.state.completedQuizzes);
  },

  completedCount(){
    return this.completedIds().length;
  },

  totalAbilities(){
    return typeof ABILITIES === 'undefined'
      ? 26
      : ABILITIES.length;
  },

  percent(){
    return Math.round(
      (this.completedCount() / this.totalAbilities()) * 100
    );
  },

  checkBadges(){
    const ids = this.completedIds();
    const newlyUnlocked = [];

    BADGES.forEach(badge => {
      if(this.state.unlockedBadges.includes(badge.id)){
        return;
      }

      const rule = badge.rule;
      let unlocked = false;

      if(rule.type === 'quiz-count'){
        unlocked = ids.length >= rule.value;
      }

      if(rule.type === 'unique-abilities'){
        unlocked = ids.length >= rule.value;
      }

      if(rule.type === 'ability-set'){
        unlocked = rule.abilities.some(id => ids.includes(id));
      }

      if(unlocked){
        this.state.unlockedBadges.push(badge.id);
        newlyUnlocked.push(badge);
      }
    });

    return newlyUnlocked;
  },

  unlocked(){
    return BADGES.filter(badge => {
      return this.state.unlockedBadges.includes(badge.id);
    });
  },

  reset(){
    this.state = {
      completedQuizzes: {},
      unlockedBadges: []
    };

    this.save();
  }
};

ExplorerProgress.load();

function renderExplorerProgress(){
  const root = document.getElementById('explorer-progress');

  if(!root) return;

  const completed = ExplorerProgress.completedCount();
  const total = ExplorerProgress.totalAbilities();

  root.innerHTML = `
    <div class="explorer-progress-title">
      <span>🧭 Engineering Explorer</span>
      <span>${completed} / ${total} abilities explored</span>
    </div>

    <div class="explorer-progress-track">
      <div
        class="explorer-progress-fill"
        style="width:${ExplorerProgress.percent()}%"
      ></div>
    </div>
  `;
}

function showBadgeToast(badge){
  const toast = document.createElement('div');

  toast.className = 'badge-toast glass';

  toast.innerHTML = `
    <span class="badge-toast-icon">${badge.icon}</span>

    <div>
      <strong>Badge unlocked: ${badge.title}</strong>

      <br>

      <span>${badge.description}</span>
    </div>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');

    setTimeout(() => {
      toast.remove();
    }, 350);
  }, 3500);
}