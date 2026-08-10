/* ================================================================
   LEVEL 3 — Engineering Behind Every Ability
   Shows how each machine/component maps to engineering disciplines,
   and visualizes cross-discipline collaboration as a network.
   ================================================================ */

let level3Rendered = false;

function renderLevel3(){
  const root = $('#level3-root');
  if(!root || level3Rendered) return;
  level3Rendered = true;

  root.innerHTML = `
    <div class="hero-panel glass">
      <h2>Who created these amazing systems?</h2>
      <p>Every intelligent machine is a collaboration between many engineering disciplines. No single branch builds it alone.</p>
    </div>

    <div class="section-block">
      <h3 class="section-heading">Explore an engineering map</h3>
      <p class="section-sub">Pick a machine to see which engineering disciplines built it, and how they collaborate.</p>
      <div class="grid grid-auto" id="l3-machine-grid"></div>
    </div>

    <div class="section-block">
      <h3 class="section-heading">Interdisciplinary engineering</h3>
      <p class="section-sub">Great inventions happen where two engineering fields overlap.</p>
      <div class="grid grid-2" id="l3-interdisciplinary"></div>
    </div>
  `;

  const grid = $('#l3-machine-grid', root);
  ENGINEERING_MAPS.forEach(m => {
    const card = el('div','card glass ability-nav-item', `
      <span class="card-icon">${m.icon}</span>
      <h3>${m.name}</h3>
      <p style="font-size:12px;">${m.domains.length} engineering fields</p>
    `);
    card.addEventListener('click', () => openEngineeringMap(m));
    grid.appendChild(card);
  });

  const interRoot = $('#l3-interdisciplinary', root);
  INTERDISCIPLINARY_EXAMPLES.forEach(x => {
    const [d1,d2] = x.pair.map(k => ENGINEERING_DISCIPLINES[k]);
    const card = el('div','card glass', `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span class="card-icon" style="font-size:22px;margin:0;">${d1.icon}</span>
        <span style="color:var(--text-2);">+</span>
        <span class="card-icon" style="font-size:22px;margin:0;">${d2.icon}</span>
      </div>
      <h3 style="font-size:14px;">${d1.name} + ${d2.name}</h3>
      <p>${x.example}</p>
    `);
    interRoot.appendChild(card);
  });
}

function openEngineeringMap(machineMap){
  const domains = machineMap.domains.map(k => ENGINEERING_DISCIPLINES[k]);
  const nodesHtml = domains.map((d,i) => `
    <div class="domain-node" style="border-color:${d.color}40;">
      <div style="font-size:22px;">${d.icon}</div>
      ${d.name}
    </div>
  `).join('');

  const html = `
    <h2 style="margin-bottom:6px;">${machineMap.icon} ${machineMap.name}</h2>
    <p style="color:var(--text-2);margin-bottom:20px;font-size:13px;">Engineering disciplines that come together to build this:</p>
    <div class="grid grid-auto" style="margin-bottom:20px;">${nodesHtml}</div>
    <div class="engineer-tip">
      <strong>🤝 How they collaborate:</strong> ${machineMap.collaboration}
    </div>
    <div style="margin-top:16px;">
      ${domains.map(d => `<div class="fun-fact" style="margin-bottom:8px;"><strong>${d.icon} ${d.name}:</strong> ${d.desc}</div>`).join('')}
    </div>
  `;
  openModal(html);
}
