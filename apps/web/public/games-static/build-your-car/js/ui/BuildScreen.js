const SYSTEMS = [
  { id: 'structure', title: 'Chassis & Structure', icon: '🧱' },
  { id: 'powertrain', title: 'Powertrain', icon: '⚙️' },
  { id: 'electrical', title: 'Electrical · Battery Versions', icon: '🔋' },
  { id: 'fuel', title: 'Fuel System', icon: '⛽' },
  { id: 'cooling', title: 'Cooling', icon: '❄️' },
  { id: 'wheels', title: 'Wheels & Tyres', icon: '🛞' },
  { id: 'steering', title: 'Steering', icon: '↔️' },
  { id: 'brakes', title: 'Braking & ABS', icon: '🛑' },
  { id: 'suspension', title: 'Suspension', icon: '〰️' },
  { id: 'comfort-safety', title: 'Safety & Seating', icon: '🛡️' },
  { id: 'assist', title: 'Driver Assistance', icon: '📷' },
  { id: 'lighting', title: 'Lighting', icon: '💡' },
  { id: 'comfort', title: 'Comfort', icon: '🧊' },
  { id: 'utility', title: 'Adventure & Cargo', icon: '🎒' },
];

const PART_ART = {
  structure: '<path d="M18 45 25 31 43 28 55 15h28l14 14 12 4 5 12z" fill="#37b9cb" stroke="#b8fff0" stroke-width="3" stroke-linejoin="round"/><path d="m47 28 11-10h20l8 10z" fill="#b6eff7" stroke="#f0ffff" stroke-width="2"/><circle cx="38" cy="46" r="9" fill="#14283a" stroke="#d9f8ff" stroke-width="4"/><circle cx="93" cy="46" r="9" fill="#14283a" stroke="#d9f8ff" stroke-width="4"/>',
  powertrain: '<path d="M26 25h55l8 8v21H30l-7-8z" fill="#ed7564" stroke="#ffd2a5" stroke-width="3"/><path d="M38 25v-8h10v8m18 0v-8h10v8" fill="#ffbf66" stroke="#a94d4c" stroke-width="2"/><circle cx="38" cy="38" r="4" fill="#fff0cb"/><circle cx="50" cy="38" r="4" fill="#fff0cb"/><circle cx="62" cy="38" r="4" fill="#fff0cb"/><circle cx="74" cy="38" r="4" fill="#fff0cb"/>',
  electrical: '<rect x="28" y="18" width="64" height="38" rx="8" fill="#f4b94f" stroke="#fff0b8" stroke-width="3"/><path d="M43 18v-6h12v6m18 0v-6h12v6" fill="#eafcff"/><path d="M59 24 48 40h11l-4 10 18-20H62l5-6z" fill="#fff"/>',
  fuel: '<path d="M25 23q0-7 8-7h50q8 0 8 8v24q0 8-8 8H33q-8 0-8-8z" fill="#8e79dc" stroke="#e0d8ff" stroke-width="3"/><path d="M42 16v-6h27v6m-20 17h23" fill="none" stroke="#f1edff" stroke-width="4" stroke-linecap="round"/>',
  cooling: '<rect x="35" y="12" width="50" height="44" rx="7" fill="#53bbd4" stroke="#d4fbff" stroke-width="3"/><path d="M46 19v30m10-30v30m10-30v30m10-30v30" stroke="#1d688a" stroke-width="3"/><path d="M24 24h9m-9 18h9m53-18h9m-9 18h9" stroke="#aaf6ee" stroke-width="3" stroke-linecap="round"/>',
  wheels: '<circle cx="42" cy="34" r="23" fill="#102031" stroke="#597489" stroke-width="5"/><circle cx="42" cy="34" r="12" fill="#b8d3dc" stroke="#e9fbff" stroke-width="3"/><circle cx="42" cy="34" r="4" fill="#44718a"/><circle cx="82" cy="34" r="23" fill="#102031" stroke="#597489" stroke-width="5"/><circle cx="82" cy="34" r="12" fill="#b8d3dc" stroke="#e9fbff" stroke-width="3"/><circle cx="82" cy="34" r="4" fill="#44718a"/>',
  steering: '<circle cx="60" cy="32" r="22" fill="none" stroke="#ffc45d" stroke-width="7"/><circle cx="60" cy="32" r="5" fill="#e7f7fb"/><path d="M60 37v15m-18-19 14 4m22-4-14 4" stroke="#e7f7fb" stroke-width="4" stroke-linecap="round"/>',
  brakes: '<circle cx="55" cy="34" r="22" fill="#8ca9b8" stroke="#e9f8ff" stroke-width="4"/><circle cx="55" cy="34" r="7" fill="#314c61"/><circle cx="55" cy="19" r="2" fill="#314c61"/><circle cx="68" cy="41" r="2" fill="#314c61"/><circle cx="42" cy="41" r="2" fill="#314c61"/><path d="M78 18h16v12H82l-4 8" fill="#f17a78" stroke="#ffd5b5" stroke-width="3"/>',
  suspension: '<path d="M60 10v6l-13 5 26 7-26 7 26 7-26 7 13 5v4" fill="none" stroke="#bf9cff" stroke-width="5" stroke-linejoin="round"/><path d="M43 10h34M43 57h34" stroke="#e8ddff" stroke-width="4" stroke-linecap="round"/>',
  'comfort-safety': '<path d="M39 12h29q8 0 8 8v12q0 5 9 9l8 4v8H38V39q-8-5-8-14 0-13 9-13z" fill="#5fcfa8" stroke="#d8ffed" stroke-width="3"/><path d="m58 22 8 8-8 8m0-8H45" fill="none" stroke="#effff8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
  assist: '<rect x="26" y="20" width="68" height="34" rx="9" fill="#667ee4" stroke="#dbe3ff" stroke-width="3"/><circle cx="60" cy="37" r="12" fill="#18283e" stroke="#85edeb" stroke-width="4"/><circle cx="60" cy="37" r="5" fill="#b9fbff"/><path d="M41 16h18" stroke="#ffd476" stroke-width="4" stroke-linecap="round"/>',
  lighting: '<path d="M32 17h35q10 0 10 10v14q0 10-10 10H32q-8 0-8-8V25q0-8 8-8z" fill="#f5d66e" stroke="#fff5bc" stroke-width="3"/><path d="M78 24 103 14M81 34h28M78 44l25 10" stroke="#ffe89a" stroke-width="4" stroke-linecap="round"/>',
  comfort: '<circle cx="60" cy="34" r="23" fill="#5fcbe0" stroke="#d5fbff" stroke-width="3"/><circle cx="60" cy="34" r="5" fill="#15364a"/><path d="M60 29c-14-21-20-4-5 3m10 2c24-7 12-20 0-6m-3 11c-10 23 7 22 7 4m-13-3c-22 3-12 19 2 7" fill="#dcfbff"/>',
  utility: '<path d="M25 24h70l-7 31H32z" fill="#d78a50" stroke="#ffe0ac" stroke-width="3"/><path d="M31 23v-8h58v8M42 31v16m18-16v16m18-16v16" fill="none" stroke="#fff0d1" stroke-width="3" stroke-linecap="round"/>',
};

Object.assign(PART_ART, {
  chassis: '<path d="M24 18h72v28H24z M35 18v28 M85 18v28 M24 27h72 M24 38h72" fill="none" stroke="#b8d9e5" stroke-width="5"/><path d="m35 18 50 28m0-28L35 46" stroke="#5d899b" stroke-width="3"/><path d="M14 24v16m92-16v16" stroke="#1b2d40" stroke-width="9"/>',
  gearbox: '<path d="M25 22h39l19 9v15L64 54H25z" fill="#a5b6c6" stroke="#effbff" stroke-width="3"/><path d="M14 36h11m58 0h22 M36 23v30m12-30v30m12-30v30" stroke="#51768c" stroke-width="4"/><path d="M45 22V11h15" fill="none" stroke="#e5eff6" stroke-width="4"/>',
  turbo: '<path d="M39 18h16v9M80 43h21v10" fill="none" stroke="#b9d4e0" stroke-width="9"/><circle cx="48" cy="37" r="20" fill="#93aebc" stroke="#eafcff" stroke-width="3"/><circle cx="77" cy="37" r="15" fill="#db8975" stroke="#ffe2c9" stroke-width="3"/><circle cx="48" cy="37" r="10" fill="#173749"/><path d="m48 27 3 10 7 4m-10-4-7 8m7-8-9-4" stroke="#bfedee" stroke-width="2"/>',
  exhaust: '<path d="M12 40h19l8-9h12m30 0h13l12 10" fill="none" stroke="#b7d3df" stroke-width="7"/><rect x="47" y="20" width="36" height="24" rx="10" fill="#769cab" stroke="#def6ff" stroke-width="3"/>',
  rack: '<path d="M13 37h94" stroke="#c8e0e9" stroke-width="5"/><rect x="42" y="29" width="37" height="16" rx="5" fill="#829ba9" stroke="#e7faff" stroke-width="2"/><path d="M32 29v16m5-16v16m44-16v16m5-16v16M63 29V15l11-5" stroke="#6c8e9f" stroke-width="4"/><circle cx="13" cy="37" r="5" fill="#ffca77"/><circle cx="107" cy="37" r="5" fill="#ffca77"/>',
  tire: '<circle cx="60" cy="32" r="25" fill="#142333" stroke="#648191" stroke-width="4"/><circle cx="60" cy="32" r="14" fill="#102030" stroke="#90adbb" stroke-width="3"/><path d="m39 17 5 5m-7 11 7 1m-1 15 5-5m28-27-5 5m12 11-7 1m1 15-5-5" stroke="#688396" stroke-width="3"/>',
  alloy: '<circle cx="60" cy="32" r="25" fill="#182838" stroke="#567082" stroke-width="4"/><circle cx="60" cy="32" r="19" fill="#9cbcc9" stroke="#effbff" stroke-width="2"/><path d="M60 14v36M42 32h36m-31-13 26 26m0-26L47 45" stroke="#294d66" stroke-width="4"/><circle cx="60" cy="32" r="6" fill="#d8f5ff"/>',
  seatbelt: '<rect x="32" y="10" width="13" height="18" rx="3" fill="#acbac7"/><path d="m39 21 38 30" stroke="#ddebf2" stroke-width="9"/><rect x="70" y="42" width="18" height="13" rx="3" fill="#ea6374" stroke="#ffcccf" stroke-width="2"/><path d="M76 46h6v5h-6z" fill="#522a3d"/>',
  airbag: '<path d="M24 49V30q0-9 9-9h10v28h20" fill="none" stroke="#82d6bb" stroke-width="6"/><circle cx="37" cy="14" r="7" fill="#b4d9e4"/><path d="m44 30 14 11" stroke="#b4d9e4" stroke-width="5"/><ellipse cx="75" cy="27" rx="19" ry="22" fill="#eef9ff" stroke="#9ac7da" stroke-width="3"/><path d="m95 43 10 8" stroke="#729fb4" stroke-width="5"/>',
  childlock: '<path d="M34 10h51v46H34z" fill="#466d87" stroke="#bbdeee" stroke-width="3"/><path d="M42 18h34v14H42z" fill="#a9e4ef"/><rect x="63" y="37" width="15" height="13" rx="2" fill="#ffd277"/><path d="M66 37v-5a5 5 0 0 1 10 0v5" fill="none" stroke="#ffd277" stroke-width="3"/>',
  abs: '<rect x="31" y="25" width="53" height="27" rx="4" fill="#a7beca" stroke="#eefaff" stroke-width="3"/><path d="M39 25V12h10v13m7 0V9h10v16m7 0V15h10v10" fill="none" stroke="#90c5d3" stroke-width="3"/><rect x="19" y="29" width="15" height="19" rx="5" fill="#294a61"/><rect x="62" y="32" width="15" height="12" fill="#253e55"/>',
  sensors: '<circle cx="31" cy="33" r="9" fill="#859fab" stroke="#e0f7ff" stroke-width="3"/><circle cx="67" cy="33" r="9" fill="#859fab" stroke="#e0f7ff" stroke-width="3"/><path d="M44 23q9 10 0 20m37-20q9 10 0 20m7-27q17 17 0 34" fill="none" stroke="#76dbdf" stroke-width="3"/>',
  screen: '<rect x="23" y="10" width="74" height="43" rx="5" fill="#284a64" stroke="#b7e9f1" stroke-width="3"/><rect x="30" y="17" width="60" height="28" rx="2" fill="#18324c"/><path d="M45 53v5h30v-5" fill="none" stroke="#b7e9f1" stroke-width="3"/><path d="M38 26h24m-24 10h37" stroke="#78d3dc" stroke-width="3"/>',
  navigation: '<rect x="24" y="10" width="72" height="44" rx="5" fill="#d7f1e8" stroke="#91c4d4" stroke-width="3"/><path d="M27 35h65M43 13v38m26-38v38" stroke="#9abec5" stroke-width="3"/><path d="m39 43 19-14 18 4" fill="none" stroke="#1377b8" stroke-width="4"/><path d="m79 18 9 17-18-4z" fill="#e66c71"/>',
  voice: '<rect x="47" y="10" width="26" height="28" rx="13" fill="#7bbad6" stroke="#d8f5ff" stroke-width="3"/><path d="M39 26v6a21 21 0 0 0 42 0v-6M60 53v7m-12 0h24" fill="none" stroke="#b9e2ec" stroke-width="3"/>',
  cruise: '<circle cx="60" cy="32" r="24" fill="#1b354a" stroke="#b9e9ed" stroke-width="3"/><path d="M43 39a18 18 0 0 1 34-2M60 32l12-11" fill="none" stroke="#82dcb8" stroke-width="4"/><circle cx="60" cy="32" r="4" fill="#fff2b5"/>',
  ac: '<rect x="29" y="20" width="44" height="29" rx="4" fill="#8bc9d8" stroke="#d8f9ff" stroke-width="3"/><path d="M38 25v19m9-19v19m9-19v19m9-19v19" stroke="#407890" stroke-width="2"/><path d="M72 35h15V19H70" fill="none" stroke="#c5e8ef" stroke-width="4"/><circle cx="92" cy="19" r="9" fill="#729eac" stroke="#d4f6ff" stroke-width="2"/>',
  sunroof: '<path d="M22 42 37 17h52l16 25z" fill="#3da0b5" stroke="#bdf6f1" stroke-width="3"/><path d="m44 22-8 15h49l-6-15z" fill="#9cd9ef" stroke="#e4ffff" stroke-width="2"/>',
  ambient: '<path d="M22 21q25 5 37 15h41M22 29q25 5 37 15h41" fill="none" stroke="#2f5368" stroke-width="7"/><path d="M22 24q25 5 37 15h41" fill="none" stroke="#88f2dc" stroke-width="3"/>',
  roofrack: '<path d="m22 43 12-25h53l13 25z M34 25h53M30 34h63M43 19l-7 24m23-24v24m14-24 8 24" fill="none" stroke="#bad4df" stroke-width="4"/>',
  bullbar: '<path d="M21 53V29q0-8 9-8h60q9 0 9 8v24M24 37h72M39 21V11h42v10" fill="none" stroke="#b8d3df" stroke-width="6" stroke-linejoin="round"/>',
  towhook: '<path d="M29 26h31v10H29z" fill="#b3d0dc" stroke="#eafaff" stroke-width="2"/><path d="M60 31h14a15 15 0 1 1-8 28" fill="none" stroke="#f2b56d" stroke-width="8" stroke-linecap="round"/>',
  watertank: '<rect x="30" y="17" width="57" height="38" rx="7" fill="#91cbd9" stroke="#e1faff" stroke-width="3"/><path d="M47 17v-7h18v7m22 26h11v9" fill="none" stroke="#d0edf4" stroke-width="4"/><path d="M59 25q-14 18 0 18t0-18" fill="#276eab"/>',
  tent: '<path d="M22 49 59 13l41 36z" fill="#e5b579" stroke="#ffebcd" stroke-width="3"/><path d="M59 13v36m0-26 18 26H43z" fill="#29536b" stroke="#ffe3b8" stroke-width="2"/><path d="M26 56h71" stroke="#a4c6d2" stroke-width="4"/>',
  cargo: '<path d="M25 39q0-17 17-21h37q18 5 18 21v12H25z" fill="#58889e" stroke="#d5f6fa" stroke-width="3"/><path d="M28 38h66m-52 13v7m38-7v7" stroke="#aacdd9" stroke-width="3"/>',
  lightbar: '<rect x="17" y="24" width="87" height="19" rx="4" fill="#36536a" stroke="#c1e2ec" stroke-width="3"/><path d="M24 29v9m11-9v9m11-9v9m11-9v9m11-9v9m11-9v9m11-9v9" stroke="#ffe69a" stroke-width="6"/>',
  dualbattery: '<rect x="14" y="23" width="42" height="29" rx="5" fill="#f4b94f" stroke="#fff0b8" stroke-width="2"/><rect x="66" y="23" width="42" height="29" rx="5" fill="#f4b94f" stroke="#fff0b8" stroke-width="2"/><path d="M24 23v-7h8v7m12 0v-7h8v7m23 0v-7h8v7m12 0v-7h8v7M53 18h17" stroke="#d8f6ff" stroke-width="3"/><path d="M33 30v15m-7-8h14m38 0h15" stroke="#fff" stroke-width="3"/>',
});

const PART_ART_BY_ID = {
  chassis_city_a: 'chassis', engine_i4_basic: 'powertrain', gearbox_manual_5: 'gearbox',
  battery_12v_basic: 'electrical', radiator_small: 'cooling', fuel_tank_40l: 'fuel',
  wheel_15_standard: 'wheels', brake_set_city: 'brakes', steering_rack_basic: 'rack',
  suspension_soft_city: 'suspension', headlights_basic: 'lighting', seatbelt_basic: 'seatbelt',
  air_conditioning_basic: 'ac', infotainment_basic: 'screen', parking_sensors: 'sensors',
  rear_camera: 'assist', sunroof: 'sunroof', alloy_wheels: 'alloy', tire_upgrade: 'tire',
  sport_brakes: 'brakes', performance_radiator: 'cooling', turbocharger: 'turbo', sport_exhaust: 'exhaust',
  racing_seat: 'comfort-safety', gps_navigation: 'navigation', voice_assistant: 'voice',
  roof_rack: 'roofrack', extra_fuel_cell: 'fuel', ambient_lights: 'ambient',
  child_lock_system: 'childlock', airbag_system: 'airbag', abs_module: 'abs',
  cruise_control: 'cruise', dual_climate_ac: 'ac', long_range_battery: 'electrical',
  offroad_suspension: 'suspension', bull_bar: 'bullbar', roof_lights: 'lightbar', offroad_tires: 'tire',
  tow_hook: 'towhook', navigation_plus: 'navigation', water_tank: 'watertank', spare_tire: 'tire',
  roof_tent: 'tent', trail_camera: 'assist', camp_lights: 'lighting', cargo_box: 'cargo',
  battery_12v_plus: 'electrical', battery_12v_touring: 'electrical', battery_dual_pack: 'dualbattery',
};

export function getPartArtType(partId) {
  return PART_ART_BY_ID[partId] || null;
}

function createPartArt(part) {
  const artType = getPartArtType(part.id);
  if (!artType) return null;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'part-art');
  svg.setAttribute('viewBox', '0 0 120 64');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', part.name + ' — simplified component illustration');
  svg.setAttribute('data-art-type', artType);
  svg.innerHTML = PART_ART[artType];
  return svg;
}

export function renderParts(parts, installedIds, onToggle, mission) {
  const grid = document.getElementById('partsGrid');
  grid.replaceChildren();
  const requiredIds = new Set(mission?.requiredParts || []);

  const guide = document.createElement('p');
  guide.className = 'parts-build-guide';
  guide.innerHTML = 'Start with every <strong>Required</strong> part for this level. The other cards are system options and upgrades.';
  grid.appendChild(guide);

  const systems = [...SYSTEMS];
  const knownSystems = new Set(systems.map(system => system.id));
  for (const category of new Set(parts.map(part => part.category))) {
    if (!knownSystems.has(category)) systems.push({ id: category, title: category.replace(/-/g, ' '), icon: '🔧' });
  }

  systems.forEach(system => {
    const systemParts = parts
      .filter(part => part.category === system.id)
      .sort((first, second) => Number(requiredIds.has(second.id)) - Number(requiredIds.has(first.id)) || first.name.localeCompare(second.name));
    if (!systemParts.length) return;

    const requiredCount = systemParts.filter(part => requiredIds.has(part.id)).length;
    const section = document.createElement('section');
    section.className = 'part-system-group';

    const heading = document.createElement('div');
    heading.className = 'part-system-heading';
    heading.innerHTML = '<span class="part-system-icon" aria-hidden="true">' + system.icon + '</span><div class="part-system-title"><h4>' + system.title + '</h4><span>' + (requiredCount ? requiredCount + ' required · ' + (systemParts.length - requiredCount) + ' options' : systemParts.length + ' options') + '</span></div>';

    const cards = document.createElement('div');
    cards.className = 'parts-grid part-system-cards';
    systemParts.forEach(part => {
      const installed = installedIds.has(part.id);
      const required = requiredIds.has(part.id);
      const article = document.createElement('article');
      article.className = 'part-card ' + (installed ? 'installed' : '');

      const copy = document.createElement('div');
      copy.className = 'part-card-copy';
      const art = createPartArt(part);
      const status = document.createElement('span');
      status.className = 'part-requirement ' + (required ? 'required' : 'optional');
      status.textContent = required ? 'Required' : 'Option';
      const name = document.createElement('h4');
      name.textContent = part.name;
      copy.append(status, name);

      const meta = document.createElement('div');
      meta.className = 'part-meta';
      [
        'Cost ' + part.cost,
        part.massKg + ' kg',
        'Reliability ' + part.reliability,
      ].forEach(value => {
        const detail = document.createElement('span');
        detail.textContent = value;
        meta.appendChild(detail);
      });

      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-pressed', String(installed));
      button.setAttribute('aria-label', (installed ? 'Remove ' : 'Install ') + part.name);
      button.textContent = installed ? 'Remove' : 'Install';
      button.addEventListener('click', () => onToggle(part.id));

      if (art) article.appendChild(art);
      article.append(copy, meta, button);
      cards.appendChild(article);
    });

    section.append(heading, cards);
    grid.appendChild(section);
  });
}