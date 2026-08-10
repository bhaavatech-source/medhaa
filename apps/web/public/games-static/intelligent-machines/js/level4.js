/* ================================================================
   LEVEL 4 — Curiosity Explorer
   ================================================================ */

let level4Rendered = false;

function renderLevel4(){
  const root = $('#level4-root');

  if(!root) return;

  level4Rendered = true;

  root.innerHTML = `
    <div class="hero-panel glass">
      <h2>🔭 Curiosity Explorer</h2>

      <p>
        This isn't a career test. It simply notices what you've been
        curious about while exploring, and shows you where that curiosity
        could lead.
      </p>

      <div class="chip-row" style="justify-content:center;">
        <button class="btn" id="l4-refresh">
          Analyze my curiosity
        </button>

        <button class="btn warm" id="l4-final-challenge">
          🏆 Take the Final Challenge Quiz
        </button>
      </div>
    </div>

    <div id="l4-results" class="section-block"></div>

    <div id="l4-badges" class="section-block"></div>
  `;

  $('#l4-refresh', root).addEventListener('click', () => {
    SoundEngine.play('click');
    analyzeCuriosity();
  });

  $('#l4-final-challenge', root).addEventListener('click', () => {
    SoundEngine.play('click');
    launchFinalChallenge();
  });

  analyzeCuriosity();
  renderBadgeGallery();
}

function analyzeCuriosity(){
  const resultsRoot = $('#l4-results');
  const topAbilities = EngagementTracker.top(5);

  if(!resultsRoot) return;

  if(topAbilities.length === 0){
    resultsRoot.innerHTML = `
      <div class="card glass" style="text-align:center;padding:40px;">
        <p style="font-size:15px;">
          You have not explored Level 2 yet. Spend some time comparing
          human and machine abilities, then come back here.
        </p>

        <button
          class="btn secondary"
          onclick="document.querySelector('.nav-btn[data-level=&quot;2&quot;]').click()"
        >
          Go explore Level 2 →
        </button>
      </div>
    `;

    return;
  }

  const scored = CURIOSITY_MAP
    .map(entry => {
      const overlap = entry.abilities.filter(abilityId => {
        return topAbilities.includes(abilityId);
      });

      return {
        entry,
        score: overlap.length
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if(scored.length === 0){
    resultsRoot.innerHTML = `
      <div class="card glass">
        <p>
          Keep exploring — your curiosity pattern is still forming!
        </p>
      </div>
    `;

    return;
  }

  const maxScore = Math.max(
    ...scored.map(item => item.score),
    1
  );

  resultsRoot.innerHTML = `
    <h3 class="section-heading">Your curiosity signals</h3>

    <p class="section-sub">
      Based on where you spent the most time in Level 2.
    </p>

    <div class="grid grid-2" id="l4-cards"></div>
  `;

  const cardsRoot = $('#l4-cards');

  scored.forEach(item => {
    const pct = Math.round((item.score / maxScore) * 100);

    const domainChips = item.entry.suggest.map(key => {
      const domain = ENGINEERING_DISCIPLINES[key];

      return `<span class="chip">${domain.icon} ${domain.name}</span>`;
    }).join('');

    const card = el(
      'div',
      'card glass',
      `
        <h3>${item.entry.message}</h3>

        <div class="curiosity-bar">
          <div
            class="curiosity-fill"
            style="width:${pct}%"
          ></div>
        </div>

        <p
          style="
            margin:12px 0 8px;
            font-size:12px;
            color:var(--text-2);
          "
        >
          Engineering fields that connect to this curiosity:
        </p>

        <div class="chip-row">
          ${domainChips}
        </div>

        <button
          class="btn secondary"
          style="margin-top:14px;"
          data-key="${item.entry.keyword}"
        >
          Explore More
        </button>
      `
    );

    card.querySelector('button').addEventListener('click', () => {
      SoundEngine.play('click');

      openModal(`
        <h2>${item.entry.message}</h2>

        <p style="color:var(--text-2);margin:10px 0 16px;">
          Here is how these engineering fields connect to what you enjoyed:
        </p>

        ${item.entry.suggest.map(key => {
          const domain = ENGINEERING_DISCIPLINES[key];

          return `
            <div class="fun-fact" style="margin-bottom:8px;">
              <strong>${domain.icon} ${domain.name}:</strong>
              ${domain.desc}
            </div>
          `;
        }).join('')}

        <div class="engineer-tip" style="margin-top:14px;">
          This curiosity map can connect with Medhā's Career
          Guidance module for a deeper journey — whenever you are ready.
        </div>
      `);
    });

    cardsRoot.appendChild(card);
  });

  resultsRoot.insertAdjacentHTML(
    'beforeend',
    `
      <div
        class="card glass"
        style="margin-top:24px;text-align:center;"
      >
        <button class="btn warm" id="l4-reset">
          Reset my curiosity data
        </button>
      </div>
    `
  );

  $('#l4-reset').addEventListener('click', () => {
    SoundEngine.play('click');
    EngagementTracker.reset();
    analyzeCuriosity();
  });
}

function renderBadgeGallery(){
  const root = $('#l4-badges');

  if(!root) return;

  const unlocked = ExplorerProgress.unlocked();

  root.innerHTML = `
    <h3 class="section-heading">Your engineering badges</h3>

    <p class="section-sub">
      Complete quizzes in Level 2 to unlock exploration badges.
      You have unlocked ${unlocked.length} of ${BADGES.length}.
    </p>

    <div class="badge-grid">
      ${BADGES.map(badge => {
        const isUnlocked = unlocked.some(item => {
          return item.id === badge.id;
        });

        return `
          <div class="badge-card ${isUnlocked ? '' : 'locked'}">
            <span class="badge-card-icon">
              ${isUnlocked ? badge.icon : '🔒'}
            </span>

            <h4>${badge.title}</h4>

            <p>${badge.description}</p>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
