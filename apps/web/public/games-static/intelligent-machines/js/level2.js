/* ================================================================
   LEVEL 2 — HUMAN vs INTELLIGENT MACHINE
   ================================================================ */

let level2Rendered = false;
let currentAbilityTimer = null;
let currentAbilityId = null;

function renderLevel2(){
  const root = $('#level2-root');

  if(!root) return;
  if(level2Rendered) return;

  level2Rendered = true;

  root.innerHTML = `
    <div class="hero-panel glass">
      <h2>Human vs Intelligent Machine</h2>
      <p>
        For every human ability, engineers built a machine equivalent.
        Explore each one — and see what humans still do best, and where
        machines extend our reach.
      </p>
    </div>

    <div class="ability-nav-grid grid grid-auto" id="l2-nav"></div>
    <div id="l2-modules"></div>
  `;

  const nav = $('#l2-nav', root);

  ABILITIES.forEach(a => {
    const item = el(
      'div',
      'card glass ability-nav-item',
      `
        <span class="card-icon">${a.icon}</span>
        <h3>${a.title}</h3>
      `
    );

    item.addEventListener('click', () => {
      SoundEngine.play('click');

      document
        .getElementById('module-' + a.id)
        .scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
    });

    item.addEventListener('mouseenter', () => {
      SoundEngine.play('hover');
    });

    nav.appendChild(item);
  });

  const modulesRoot = $('#l2-modules', root);

  ABILITIES.forEach(a => {
    modulesRoot.appendChild(buildAbilityModule(a));
  });

  setupAbilityObserver();
}

function buildAbilityModule(a){
  const mod = el('div', 'ability-module glass');

  mod.id = 'module-' + a.id;
  mod.dataset.abilityId = a.id;

  mod.innerHTML = `
    <div class="ability-header">
      <span class="card-icon">${a.icon}</span>

      <div>
        <h2>${a.title}</h2>

        <p style="font-size:13px;color:var(--text-2);margin:0;">
          ${a.tagline}
        </p>
      </div>

      <span class="tag" style="margin-left:auto;">
        Human vs Machine
      </span>
    </div>

    <div class="vs-stage">
      <div class="vs-panel human glass">
        <div class="panel-visual">
          ${getVisual(a.id, 'human')}
        </div>

        <h3 style="color:#ff8fc2;">
          Human ${a.title}
        </h3>

        <ul class="panel-list">
          ${a.human.parts.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>

      <div class="vs-divider">
        <span class="vs-bolt">⚡</span>
        <span>VS</span>
      </div>

      <div class="vs-panel machine glass">
        <div class="panel-visual">
          ${getVisual(a.id, 'machine')}
        </div>

        <h3 style="color:#7fe9ff;">
          Machine ${a.title}
        </h3>

        <ul class="panel-list">
          ${a.machine.parts.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="grid grid-2" style="margin-bottom:8px;">
      <div class="card glass">
        <h3 style="color:#ff8fc2;font-size:14px;">
          Human limitations
        </h3>

        <ul class="panel-list">
          ${a.human.limitations.map(l => `<li>${l}</li>`).join('')}
        </ul>
      </div>

      <div class="card glass">
        <h3 style="color:#7fe9ff;font-size:14px;">
          Machine limitations
        </h3>

        <ul class="panel-list">
          ${a.machine.limitations.map(l => `<li>${l}</li>`).join('')}
        </ul>
      </div>
    </div>

    <h3 style="font-size:16px;margin:20px 0 10px;color:var(--text-0);">
      Functional comparison
    </h3>

    <table class="compare-table">
      <thead>
        <tr>
          <th>Aspect</th>
          <th>Human</th>
          <th>Machine</th>
          <th>Who does it better?</th>
        </tr>
      </thead>

      <tbody>
        ${a.compare.map(c => `
          <tr>
            <td>${c.aspect}</td>
            <td>${c.human}</td>
            <td>${c.machine}</td>
            <td>
              <span class="${badgeClass(c.winner)}">
                ${
                  c.winner === 'both'
                    ? 'Both'
                    : c.winner.charAt(0).toUpperCase() +
                      c.winner.slice(1)
                }
              </span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h3 style="font-size:16px;margin:20px 0 10px;color:var(--text-0);">
      Machines don't replace — they extend
    </h3>

    <div class="chip-row">
      ${a.extend.map(x => `<span class="chip">${x}</span>`).join('')}
    </div>

    <div class="engineer-tip">
      <strong>🛠 How engineers improved this:</strong>
      ${a.engineerImprovements.join(' · ')}

      <br>

      <span style="color:var(--text-2);font-size:12px;">
        ${a.engineerTip}
      </span>
    </div>

    <div class="fun-fact">
      <strong>💡 Fun fact:</strong>
      ${a.funFact}
    </div>

    <h3 style="font-size:16px;margin:20px 0 10px;color:var(--text-0);">
      Real-life examples
    </h3>

    <div class="chip-row">
      ${a.realWorld.map(x => `<span class="chip">${x}</span>`).join('')}
    </div>

    <div class="minigame-launch">
      <span>🎮 Mini game: ${a.minigame.label}</span>

      <button
        class="btn secondary l2-play-btn"
        data-ability="${a.id}"
        data-game="${a.minigame.type}"
      >
        Play
      </button>
    </div>

    <div class="minigame-launch" style="border-color:var(--accent-5);">
      <span>
        📝 Quick Quiz: Test what you learned about ${a.title}
      </span>

      <button
        class="btn warm l2-quiz-btn"
        data-ability="${a.id}"
      >
        Take Quiz
        <span class="quiz-score-tag" data-ability="${a.id}"></span>
      </button>
    </div>
  `;

  mod.querySelector('.l2-play-btn').addEventListener('click', e => {
    SoundEngine.play('click');
    launchMinigame(a, e.target.dataset.game);
  });

  mod.querySelector('.l2-quiz-btn').addEventListener('click', () => {
    SoundEngine.play('click');
    launchAbilityQuiz(a);
  });

  const scoreTag = mod.querySelector('.quiz-score-tag');
  const bestScore = QuizProgress.get(a.id);

  if(bestScore > 0){
    scoreTag.textContent = ` (Best: ${bestScore}%)`;
    scoreTag.style.opacity = '0.8';
  }

  return mod;
}

function setupAbilityObserver(){
  const modules = $$('.ability-module');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.dataset.abilityId;

      if(entry.isIntersecting){
        if(currentAbilityTimer){
          clearInterval(currentAbilityTimer);
        }

        currentAbilityId = id;

        currentAbilityTimer = setInterval(() => {
          EngagementTracker.record(id, 1);
        }, 1000);
      }
    });
  }, {
    threshold: 0.4
  });

  modules.forEach(m => observer.observe(m));
}