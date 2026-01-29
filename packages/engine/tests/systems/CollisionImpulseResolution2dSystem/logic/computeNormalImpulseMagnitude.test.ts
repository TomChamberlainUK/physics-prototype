import { describe, expect, it } from 'vitest';
import { computeNormalImpulseMagnitude } from '#/systems/CollisionImpulseResolution2dSystem/logic';

describe('computeNormalImpulseMagnitude', () => {
  it('Should compute the correct impulse magnitude', () => {
    const effectiveMass = 2;
    const restitution = 0.5;
    const velocity = 5;

    const impulseMagnitude = computeNormalImpulseMagnitude({
      effectiveMass,
      restitution,
      velocity,
    });

    // -(1 + restitution) * velocity / effectiveMass
    const expectedImpulseMagnitude = -3.75;

    expect(impulseMagnitude).toBeCloseTo(expectedImpulseMagnitude);
  });
});
