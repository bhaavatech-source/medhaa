import { describe, expect, it, vi } from 'vitest';
import { getPartArtType, renderParts } from '../../public/games-static/build-your-car/js/ui/BuildScreen.js';
import parts from '../../public/games-static/build-your-car/data/parts.json';

describe('car component illustrations', () => {
  it('maps every catalogue part explicitly without a generic fallback', () => {
    for (const part of parts) expect(getPartArtType(part.id)).not.toBeNull();
    expect(getPartArtType('unknown-part')).toBeNull();
  });

  it.each([
    ['chassis_city_a', 'chassis'],
    ['gearbox_manual_5', 'gearbox'],
    ['turbocharger', 'turbo'],
    ['sport_exhaust', 'exhaust'],
    ['steering_rack_basic', 'rack'],
    ['seatbelt_basic', 'seatbelt'],
    ['airbag_system', 'airbag'],
    ['abs_module', 'abs'],
    ['infotainment_basic', 'screen'],
    ['parking_sensors', 'sensors'],
    ['water_tank', 'watertank'],
    ['battery_dual_pack', 'dualbattery'],
  ])('uses component-specific artwork for %s', (partId, artType) => {
    expect(getPartArtType(partId)).toBe(artType);
  });

  it('renders an identified illustration and working control for every card', () => {
    document.body.innerHTML = '<div id="partsGrid"></div>';
    const onToggle = vi.fn();
    renderParts(parts, new Set(), onToggle, { requiredParts: ['gearbox_manual_5'] });
    const cards = [...document.querySelectorAll('.part-card')];
    expect(cards).toHaveLength(parts.length);
    for (const card of cards) {
      const name = card.querySelector('h4').textContent;
      const part = parts.find(item => item.name === name);
      const art = card.querySelector('svg');
      expect(art.getAttribute('aria-label')).toContain(part.name);
      expect(art.getAttribute('data-art-type')).toBe(getPartArtType(part.id));
      expect(art.children.length).toBeGreaterThan(0);
      if (part.id === 'engine_i4_basic') expect(art.querySelectorAll('circle')).toHaveLength(4);
      expect(card.textContent).toContain('Cost ' + part.cost);
      card.querySelector('button').click();
      expect(onToggle).toHaveBeenLastCalledWith(part.id);
    }
  });
});