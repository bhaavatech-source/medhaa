import { describe, expect, it } from 'vitest';
import { VehicleSim } from '../../public/games-static/build-your-car/js/simulation/VehicleSim.js';
import { CompatibilityEngine } from '../../public/games-static/build-your-car/js/rules/CompatibilityEngine.js';
import { ScoreEngine } from '../../public/games-static/build-your-car/js/rules/ScoreEngine.js';
import parts from '../../public/games-static/build-your-car/data/parts.json';
import missions from '../../public/games-static/build-your-car/data/missions.json';

function run(ids, step = 0, mission = missions[0]) {
  return new VehicleSim().run({
    mission, installedParts: parts.filter(part => ids.includes(part.id)), step,
    compatibilityEngine: new CompatibilityEngine(), scoreEngine: new ScoreEngine(),
  });
}

describe('car test simulation', () => {
  const healthy = [...missions[0].requiredParts, 'performance_radiator'];

  it('uses all installed cooling, electrical and brake contributions', () => {
    const result = run([...healthy, 'long_range_battery', 'sport_brakes']);
    expect(result.sim.heatMargin).toBe(result.metrics.totalCooling - result.metrics.totalHeatLoad);
    expect(result.sim.batteryReserve).toBe(Math.min(100, result.metrics.totalBattery));
    expect(result.sim.brakeMargin).toBe(result.metrics.totalBrakeForce - missions[0].targets.minBrakeForce);
    expect(result.canDrive).toBe(true);
  });

  it('does not drain the 12V battery or overheat a cooled build just because time passes', () => {
    const first = run(healthy);
    const last = run(healthy, 20);
    expect(last.sim.batteryReserve).toBe(first.sim.batteryReserve);
    expect(last.sim.temperature).toBe(first.sim.temperature);
    expect(last.sim.stall).toBe(false);
    expect(last.sim.speed).toBe(0);
  });

  it('starts slowly, cruises, brakes gradually and finishes at rest', () => {
    const frames = Array.from({ length: 20 }, (_, step) => run(healthy, step).sim);
    expect(frames[0].speed).toBe(0);
    for (let step = 1; step <= 7; step++) expect(frames[step].speed).toBeGreaterThan(frames[step - 1].speed);
    expect(frames[1].speed).toBeLessThan(frames[7].speed / 10);
    for (let step = 8; step <= 12; step++) expect(frames[step].speed).toBe(frames[7].speed);
    for (let step = 13; step <= 19; step++) expect(frames[step].speed).toBeLessThan(frames[step - 1].speed);
    expect(frames[19].speed).toBe(0);
    expect(frames[19].phase).toBe('stopped');
    expect(frames.every(frame => !frame.stall)).toBe(true);
  });

  it('cannot drive a gearbox-only powertrain or a car without its fuel tank', () => {
    for (const ids of [
      [...healthy.filter(id => id !== 'engine_i4_basic'), 'gearbox_manual_5'],
      healthy.filter(id => id !== 'fuel_tank_40l'),
    ]) {
      const result = run(ids);
      expect(result.canDrive).toBe(false);
      expect(result.sim.speed).toBe(0);
      expect(result.sim.stopReasons.length).toBeGreaterThan(0);
    }
  });

  it('reports cooling faults and zero speed on an undercooled build', () => {
    const result = run(missions[0].requiredParts);
    expect(result.sim.stall).toBe(true);
    expect(result.sim.speed).toBe(0);
    expect(result.sim.stopReasons).toContain('Cooling capacity is below the build heat load.');
  });

  it('reports a passing brake margin for a build that passes its mission brake check', () => {
    const result = run([...healthy, 'gearbox_manual_5']);
    expect(result.failures.some(failure => failure.id === 'brakes_undersized')).toBe(false);
    expect(result.sim.brakeMargin).toBe(4);
  });

  it('identifies the missing fuel tank rather than implying petrol has run out', () => {
    const result = run(healthy.filter(id => id !== 'fuel_tank_40l'));
    expect(result.sim.stopReasons).toContain('Missing required parts: fuel tank 40l.');
  });
});