/* ================================================================
   MINIGAMES — generic, lightweight interactive games launched from
   each ability module. All games run inside the modal.
   ================================================================ */

function launchMinigame(ability, type){
  switch(type){
    case 'matching': return gameMatching(ability);
    case 'drag-drop': return gameDragDrop(ability);
    case 'build-system': return gameBuildSystem(ability);
    case 'find-missing': return gameFindMissing(ability);
    case 'puzzle': return gamePuzzle(ability);
    case 'scenario': return gameScenario(ability);
    case 'challenge': return gameChallenge(ability);
    case 'simulation': return gameSimulation(ability);
    case 'guess-component': return gameGuessComponent(ability);
    default: return gameGuessComponent(ability);
  }
}

/* ---- 1. MATCHING: match human parts to machine parts ---- */
function gameMatching(ability){
  const pairs = ability.human.parts.slice(0,4).map((h,i) => ({
    human: h.split(' — ')[0],
    machine: (ability.machine.parts[i] || ability.machine.parts[0]).split(' — ')[0]
  }));
  const shuffledMachine = shuffle(pairs.map(p=>p.machine));

  const html = `
    <h2>🧩 Matching: ${ability.title}</h2>
    <p style="color:var(--text-2);margin-bottom:16px;">Click a human part, then click its matching machine part.</p>
    <div class="grid grid-2">
      <div id="mg-human-col"></div>
      <div id="mg-machine-col"></div>
    </div>
    <p id="mg-status" style="margin-top:16px;color:var(--accent-4);font-weight:600;"></p>
  `;
  openModal(html);

  const humanCol = $('#mg-human-col');
  const machineCol = $('#mg-machine-col');
  let selectedHuman = null;
  let matchedCount = 0;

  pairs.forEach((p, i) => {
    const btn = el('button','chip', p.human);
    btn.style.display='block'; btn.style.width='100%'; btn.style.marginBottom='8px'; btn.style.textAlign='left';
    btn.dataset.idx = i;
    btn.addEventListener('click', () => {
      $$('#mg-human-col .chip').forEach(b => b.style.borderColor = 'var(--glass-border)');
      selectedHuman = i;
      btn.style.borderColor = 'var(--accent-1)';
    });
    humanCol.appendChild(btn);
  });

  shuffledMachine.forEach(mLabel => {
    const btn = el('button','chip', mLabel);
    btn.style.display='block'; btn.style.width='100%'; btn.style.marginBottom='8px'; btn.style.textAlign='left';
    btn.addEventListener('click', () => {
      if(selectedHuman === null) return;
      const correct = pairs[selectedHuman].machine === mLabel;
      btn.style.background = correct ? 'rgba(0,255,163,0.2)' : 'rgba(255,45,149,0.2)';
      if(correct){
        matchedCount++;
        btn.disabled = true;
        $$('#mg-human-col .chip')[selectedHuman].disabled = true;
        SoundEngine.play('correct');
        $$('#mg-human-col .chip')[selectedHuman].style.opacity = 0.4;
        selectedHuman = null;
        $('#mg-status').textContent = `Matched ${matchedCount}/${pairs.length}!`;
        if(matchedCount === pairs.length) $('#mg-status').textContent = `🎉 All matched! Great observation skills.`; Effects.celebrate();
      } else {
        SoundEngine.play('wrong');
        setTimeout(() => { btn.style.background=''; }, 500);
      }
    });
    machineCol.appendChild(btn);
  });
}

/* ---- 2. DRAG & DROP: order the signal path ---- */
function gameDragDrop(ability){
  const steps = shuffle(ability.machine.parts.slice(0,5));
  const correctOrder = ability.machine.parts.slice(0,5);

  const html = `
    <h2>🧩 Build the order: ${ability.title}</h2>
    <p style="color:var(--text-2);margin-bottom:16px;">Drag items to arrange them in the correct signal order (top = first step).</p>
    <ul id="mg-list" style="list-style:none;padding:0;"></ul>
    <button class="btn" id="mg-check" style="margin-top:14px;">Check order</button>
    <p id="mg-status" style="margin-top:10px;font-weight:600;"></p>
  `;
  openModal(html);

  const list = $('#mg-list');
  steps.forEach(s => {
    const li = el('li','chip', s.split(' — ')[0]);
    li.style.display='block'; li.style.padding='10px 14px'; li.style.marginBottom='8px'; li.draggable = true;
    list.appendChild(li);
  });

  let dragged = null;
  list.addEventListener('dragstart', e => { dragged = e.target; });
  list.addEventListener('dragover', e => {
    e.preventDefault();
    const target = e.target.closest('li');
    if(target && target !== dragged){
      const rect = target.getBoundingClientRect();
      const before = (e.clientY - rect.top) < rect.height/2;
      list.insertBefore(dragged, before ? target : target.nextSibling);
    }
  });

  $('#mg-check').addEventListener('click', () => {
    const current = $$('li', list).map(li => li.textContent);
    const target = correctOrder.map(s => s.split(' — ')[0]);
    const correctCount = current.filter((c,i)=>c===target[i]).length;
    $('#mg-status').innerHTML = correctCount === target.length
      ? `<span style="color:var(--accent-4);">🎉 Perfect order! That's exactly how the signal flows.</span>`
      : `<span style="color:var(--accent-3);">${correctCount}/${target.length} correct. Try rearranging again.</span>`;
  });
}

/* ---- 3. BUILD THE SYSTEM: pick correct components from options ---- */
function gameBuildSystem(ability){
  const correctParts = ability.machine.parts.slice(0,4).map(p => p.split(' — ')[0]);
  const distractors = shuffle(ABILITIES.filter(a=>a.id!==ability.id).flatMap(a=>a.machine.parts.map(p=>p.split(' — ')[0]))).slice(0,4);
  const options = shuffle([...correctParts, ...distractors]);
  let selected = [];

  const html = `
    <h2>🛠 Build the system: ${ability.title}</h2>
    <p style="color:var(--text-2);margin-bottom:16px;">Select the ${correctParts.length} components that belong in this machine system.</p>
    <div class="chip-row" id="mg-options"></div>
    <button class="btn" id="mg-submit" style="margin-top:16px;">Submit</button>
    <p id="mg-status" style="margin-top:10px;font-weight:600;"></p>
  `;
  openModal(html);

  const optsRoot = $('#mg-options');
  options.forEach(opt => {
    const chip = el('button','chip', opt);
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected-chip');
      if(selected.includes(opt)) selected = selected.filter(x=>x!==opt);
      else selected.push(opt);
      chip.style.background = selected.includes(opt) ? 'rgba(0,229,255,0.25)' : '';
    });
    optsRoot.appendChild(chip);
  });

  $('#mg-submit').addEventListener('click', () => {
    const correctSelected = selected.filter(s => correctParts.includes(s)).length;
    const wrongSelected = selected.filter(s => !correctParts.includes(s)).length;
    $('#mg-status').innerHTML = (correctSelected === correctParts.length && wrongSelected === 0)
      ? `<span style="color:var(--accent-4);">🎉 You built it correctly!</span>`
      : `<span style="color:var(--accent-3);">Got ${correctSelected}/${correctParts.length} right, with ${wrongSelected} extra picks. Try again!</span>`;
  });
}

/* ---- 4. FIND MISSING: fill in a blank in the hierarchy ---- */
function gameFindMissing(ability){
  const parts = ability.machine.parts;
  const hideIdx = Math.floor(Math.random()*parts.length);
  const hiddenAnswer = parts[hideIdx].split(' — ')[0];
  const distractors = shuffle(ABILITIES.flatMap(a=>a.machine.parts.map(p=>p.split(' — ')[0]))).filter(d=>d!==hiddenAnswer).slice(0,3);
  const options = shuffle([hiddenAnswer, ...distractors]);

  const html = `
    <h2>🔎 Find the missing part: ${ability.title}</h2>
    <ul class="panel-list" style="margin-bottom:16px;">
      ${parts.map((p,i)=> i===hideIdx ? `<li style="color:var(--accent-5);">??? (missing)</li>` : `<li>${p}</li>`).join('')}
    </ul>
    <div class="chip-row" id="mg-options"></div>
    <p id="mg-status" style="margin-top:12px;font-weight:600;"></p>
  `;
  openModal(html);

  $('#mg-options').innerHTML = '';
  options.forEach(opt => {
    const chip = el('button','chip', opt);
    chip.addEventListener('click', () => {
      const correct = opt === hiddenAnswer;
      $('#mg-status').innerHTML = correct
        ? `<span style="color:var(--accent-4);">🎉 Correct! ${opt} completes the system.</span>`
        : `<span style="color:var(--accent-3);">Not quite. Try another option.</span>`;
    });
    $('#mg-options').appendChild(chip);
  });
}

/* ---- 5. PUZZLE: pick the aspect where machine/human/both wins ---- */
function gamePuzzle(ability){
  const q = shuffle(ability.compare)[0];
  const html = `
    <h2>🧠 Engineering puzzle: ${ability.title}</h2>
    <p style="margin-bottom:16px;font-size:15px;">Aspect: <strong>${q.aspect}</strong></p>
    <p style="color:var(--text-2);font-size:13px;">Human: ${q.human}</p>
    <p style="color:var(--text-2);font-size:13px;margin-bottom:16px;">Machine: ${q.machine}</p>
    <p style="margin-bottom:10px;">Who does it better?</p>
    <div class="chip-row">
      <button class="btn secondary" data-a="human">Human</button>
      <button class="btn secondary" data-a="machine">Machine</button>
      <button class="btn secondary" data-a="both">Both equally</button>
    </div>
    <p id="mg-status" style="margin-top:14px;font-weight:600;"></p>
  `;
  openModal(html);
  $$('button[data-a]').forEach(b => b.addEventListener('click', () => {
    const correct = b.dataset.a === q.winner;
    $('#mg-status').innerHTML = correct
      ? `<span style="color:var(--accent-4);">🎉 Correct!</span>`
      : `<span style="color:var(--accent-3);">Actually, it's "${q.winner}". Engineering always has trade-offs!</span>`;
  }));
}

/* ---- 6. SCENARIO: guess-the-decision style ---- */
function gameScenario(ability){
  gamePuzzle(ability);
}

/* ---- 7. CHALLENGE: simple reaction-time style game ---- */
function gameChallenge(ability){
  const html = `
    <h2>⚡ Reaction Challenge: ${ability.title}</h2>
    <p style="color:var(--text-2);margin-bottom:16px;">Click the button the instant it turns green — just like a machine's fast reaction sensor!</p>
    <button class="btn secondary" id="mg-target" style="width:100%;padding:40px;font-size:16px;">Wait for green...</button>
    <p id="mg-status" style="margin-top:14px;font-weight:600;"></p>
  `;
  openModal(html);
  const btn = $('#mg-target');
  let startTime;
  let ready = false;
  const delay = 1000 + Math.random()*2000;
  setTimeout(() => {
    btn.style.background = 'var(--grad-success)';
    btn.textContent = 'CLICK NOW!';
    ready = true;
    startTime = performance.now();
  }, delay);
  btn.addEventListener('click', () => {
    if(!ready){
      $('#mg-status').innerHTML = `<span style="color:var(--accent-3);">Too early! Machines don't jump the gun — wait for the real signal.</span>`;
      return;
    }
    const rt = Math.round(performance.now() - startTime);
    $('#mg-status').innerHTML = `<span style="color:var(--accent-4);">Your reaction time: ${rt}ms. A machine sensor reacts in under 1ms!</span>`;
    ready = false;
  });
}

/* ---- 8. SIMULATION: simple slider-based simulation ---- */
function gameSimulation(ability){
  const html = `
    <h2>🎛 Simulation: ${ability.title}</h2>
    <p style="color:var(--text-2);margin-bottom:16px;">Adjust the slider and observe how the system responds.</p>
    <input type="range" min="0" max="100" value="50" id="mg-slider" style="width:100%;">
    <p id="mg-status" style="margin-top:14px;font-weight:600;">Value: 50</p>
  `;
  openModal(html);
  $('#mg-slider').addEventListener('input', (e) => {
    const v = e.target.value;
    let msg = `Value: ${v}`;
    if(v < 30) msg += " — System is under-responding, like a weak signal.";
    else if(v > 70) msg += " — System is highly responsive, like a well-tuned sensor!";
    else msg += " — Balanced response.";
    $('#mg-status').textContent = msg;
  });
}

/* ---- 9. GUESS COMPONENT ---- */
function gameGuessComponent(ability){
  const correct = ability.machine.parts[0].split(' — ')[0];
  const desc = ability.machine.parts[0].split(' — ')[1] || '';
  const distractors = shuffle(ABILITIES.filter(a=>a.id!==ability.id).map(a=>a.machine.parts[0].split(' — ')[0])).slice(0,3);
  const options = shuffle([correct, ...distractors]);

  const html = `
    <h2>❓ Guess the component: ${ability.title}</h2>
    <p style="margin-bottom:16px;color:var(--text-2);">Clue: "${desc}"</p>
    <div class="chip-row" id="mg-options"></div>
    <p id="mg-status" style="margin-top:14px;font-weight:600;"></p>
  `;
  openModal(html);
  $('#mg-options').innerHTML = '';
  options.forEach(opt => {
    const chip = el('button','chip', opt);
    chip.addEventListener('click', () => {
      const isCorrect = opt === correct;
      $('#mg-status').innerHTML = isCorrect
        ? `<span style="color:var(--accent-4);">🎉 Correct! It's the ${correct}.</span>`
        : `<span style="color:var(--accent-3);">Not quite — try again.</span>`;
    });
    $('#mg-options').appendChild(chip);
  });
}
