import { describe, expect, it } from 'vitest';
import { computeTangentImpulseMagnitude } from '#/systems/CollisionImpulseResolution2dSystem/logic';

describe('computeTangentImpulseMagnitude', () => {
  it('Should compute the correct tangent impulse magnitude', () => {
    const effectiveMass = 2;
    const velocity = 4;

    const tangentImpulseMagnitude = computeTangentImpulseMagnitude({
      effectiveMass,
      velocity,
    });

    // -velocity / effectiveMass
    expect(tangentImpulseMagnitude).toBeCloseTo(-2);
  });
});
