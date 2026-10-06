export class VehicleSim {
  run({ mission, installedParts, compatibilityEngine, scoreEngine, step = 0, history = [] }) {
    const evaluation = compatibilityEngine.evaluate({ mission, installedParts });
    const sim = this.simulateFrame({ mission, installedParts, metrics: evaluation.metrics, step, history, failures: evaluation.failures });
    const scores = scoreEngine.calculate({ mission, metrics: evaluation.metrics, failures: evaluation.failures, sim });
    return { ...evaluation, sim, scores, canDrive: !sim.stall };
  }

  simulateFrame({ mission, installedParts, metrics, step, history, failures }) {
    const engine = installedParts.find(p => p.id === 'engine_i4_basic');
    const weight = 780 + installedParts.reduce((sum, p) => sum + (p.massKg || 0), 0);
    const power = engine ? 100 + Math.round(engine.cost / 20) : 0;
    const cooling = metrics.totalCooling;
    const heatLoad = metrics.totalHeatLoad;
    const heatMargin = cooling - heatLoad;
    const batteryReserve = Math.max(0, Math.min(100, metrics.totalBattery));
    const brakeMargin = metrics.totalBrakeForce - mission.targets.minBrakeForce;
    const temperature = Math.min(150, 70 + Math.max(0, heatLoad - cooling) * (2 + step * 0.5));
    const stopReasons = [];
    if (!engine) stopReasons.push('Install the engine; a gearbox or exhaust cannot power the car.');
    failures.filter(failure => failure.id !== 'budget_exceeded').forEach(failure => {
      if (failure.id === 'missing_required_part') {
        const missingParts = failure.details.map(id => id.replace(/_/g, ' '));
        stopReasons.push('Missing required parts: ' + missingParts.join(', ') + '.');
      }
      if (failure.id === 'engine_overheating') stopReasons.push('Cooling capacity is below the build heat load.');
      if (failure.id === 'battery_weak') stopReasons.push('Electrical reserve is below the mission requirement.');
      if (failure.id === 'brakes_undersized') stopReasons.push('Brake capacity is below the mission safety requirement.');
    });
    if (temperature > 118) stopReasons.push('Engine temperature is too high.');
    const stall = stopReasons.length > 0;
    const cruiseSpeed = Math.min(120, Math.round(power / 2));
    const smoothStep = progress => progress * progress * (3 - 2 * progress);
    const acceleration = smoothStep(Math.max(0, Math.min(1, step / 7)));
    const braking = smoothStep(Math.max(0, Math.min(1, (step - 12) / 7)));
    const speed = stall ? 0 : Math.round(cruiseSpeed * acceleration * (1 - braking));
    const phase = stall ? 'fault' : step >= 19 ? 'stopped' : step > 12 ? 'braking' : step >= 7 ? 'cruising' : 'accelerating';
    const driveability = Math.max(0, Math.min(100, 45 + (engine ? 20 : -25) + Math.max(-20, heatMargin) + Math.min(20, brakeMargin / 2)));
    return { step, speed, phase, temperature, batteryReserve, brakeMargin, heatMargin, weight, stall, stopReasons, terrain: mission?.id?.includes('hill') ? 'hill' : 'city', roadGrip: mission?.id?.includes('hill') ? 0.86 : 0.92 };
  }
}