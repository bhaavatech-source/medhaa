/* ================================================================
   QUIZ ENGINE
   ================================================================ */

function launchAbilityQuiz(ability){
  const questions = QUIZ_BANK[ability.id];

  if(!questions || !questions.length){
    openModal(`<h2>Quiz coming soon for ${ability.title}!</h2>`);
    return;
  }

  runQuizFlow(questions, `📝 Quiz: ${ability.title}`, ability.id);
}

function launchFinalChallenge(){
  const questions = getFinalChallengeQuestions(10);

  runQuizFlow(
    questions,
    `🏆 Final Challenge — Mixed Quiz`,
    'final-challenge'
  );
}

function runQuizFlow(questions, title, contextId){
  let idx = 0;
  let score = 0;
  const total = questions.length;

  function renderQuestion(){
    const q = questions[idx];

    const optionButtons = q.options.map((opt, i) => `
      <button
        class="btn secondary quiz-opt"
        data-i="${i}"
        style="display:block;width:100%;text-align:left;margin-bottom:10px;"
      >
        ${opt}
      </button>
    `).join('');

    const html = `
      <h2>${title}</h2>

      <div class="curiosity-bar" style="margin:10px 0 18px;">
        <div
          class="curiosity-fill"
          style="width:${Math.round((idx / total) * 100)}%"
        ></div>
      </div>

      <p style="font-size:11px;color:var(--text-2);margin-bottom:6px;">
        Question ${idx + 1} of ${total}
      </p>

      <p style="font-size:16px;margin-bottom:16px;font-weight:600;">
        ${q.q}
      </p>

      <div id="quiz-opts">${optionButtons}</div>

      <p
        id="quiz-feedback"
        style="margin-top:12px;font-weight:600;min-height:20px;"
      ></p>
    `;

    openModal(html);

    $$('.quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.quiz-opt').forEach(b => b.disabled = true);

        const chosen = parseInt(btn.dataset.i);
        const correct = chosen === q.answer;
        const feedback = $('#quiz-feedback');

        if(correct){
          score++;

          btn.style.background = 'rgba(0,255,163,0.25)';
          btn.style.borderColor = 'var(--accent-4)';

          feedback.innerHTML = `
            <span style="color:var(--accent-4);">
              ✅ Correct!
            </span>
          `;

          SoundEngine.play('correct');
        } else {
          btn.style.background = 'rgba(255,45,149,0.25)';
          btn.style.borderColor = 'var(--accent-3)';

          const correctBtn = $$('.quiz-opt')[q.answer];

          if(correctBtn){
            correctBtn.style.background = 'rgba(0,255,163,0.18)';
          }

          feedback.innerHTML = `
            <span style="color:var(--accent-3);">
              ❌ Not quite. Correct answer: ${q.options[q.answer]}
            </span>
          `;

          SoundEngine.play('wrong');
        }

        setTimeout(() => {
          idx++;

          if(idx < total){
            renderQuestion();
          } else {
            renderResults();
          }
        }, 1100);
      });
    });
  }

  function renderResults(){
    const pct = Math.round((score / total) * 100);

    let verdict = "Keep exploring — you'll get sharper with practice!";

    if(pct >= 80){
      verdict = "🌟 Outstanding! You really understand this ability.";
    } else if(pct >= 50){
      verdict = "👍 Good job! A little more exploring will help.";
    }

    const html = `
      <h2>Quiz complete!</h2>

      <p
        style="
          font-size:32px;
          font-weight:800;
          margin:16px 0;
          background:var(--grad-primary);
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        "
      >
        ${score} / ${total}
      </p>

      <p style="margin-bottom:18px;">${verdict}</p>

      <button class="btn" id="quiz-close-btn">
        Continue exploring
      </button>
    `;

    openModal(html);

    if(pct >= 80){
      Effects.celebrate(
        window.innerWidth / 2,
        window.innerHeight / 2
      );
    } else {
      SoundEngine.play('complete');
    }

    if(contextId && contextId !== 'final-challenge'){
  QuizProgress.record(contextId, pct);

  const newBadges = ExplorerProgress.recordQuiz(contextId, pct);

  renderExplorerProgress();

  newBadges.forEach((badge, index) => {
    setTimeout(() => {
      showBadgeToast(badge);
      SoundEngine.play('complete');
    }, 500 + index * 700);
  });
}

    $('#quiz-close-btn').addEventListener('click', closeModal);
  }

  renderQuestion();
}

const QuizProgress = {
  data: {},

  load(){
    try{
      const raw = localStorage.getItem('bhava_quiz_scores');

      if(raw){
        this.data = JSON.parse(raw);
      }
    }catch(e){}
  },

  record(abilityId, pct){
    const previous = this.data[abilityId] || 0;

    this.data[abilityId] = Math.max(previous, pct);

    try{
      localStorage.setItem(
        'bhava_quiz_scores',
        JSON.stringify(this.data)
      );
    }catch(e){}
  },

  get(abilityId){
    return this.data[abilityId] || 0;
  }
};

QuizProgress.load();