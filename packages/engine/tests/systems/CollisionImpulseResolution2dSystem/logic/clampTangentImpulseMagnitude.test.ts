import { clampTangentImpulseMagnitude } from '#/systems/CollisionImpulseResolution2dSystem/logic';
import { describe, expect, it } from 'vitest';

describe('clampTangentImpulseMagnitude', () => {
  it('Should clamp the tangent impulse magnitude within the maximum allowable tangent impulse', () => {
    const tangentImpulseMagnitude = 5;
    const maxTangentImpulse = 3;

    const clampedTangentImpulseMagnitude = clampTangentImpulseMagnitude({
      tangentImpulseMagnitude,
      maxTangentImpulse,
    });

    // Clamped to maxTangentImpulse
    expect(clampedTangentImpulseMagnitude).toBe(3);
  });

  it('Should clamp the tangent impulse magnitude within the negative maximum allowable tangent impulse', () => {
    const tangentImpulseMagnitude = -5;
    const maxTangentImpulse = 3;

    const clampedTangentImpulseMagnitude = clampTangentImpulseMagnitude({
      tangentImpulseMagnitude,
      maxTangentImpulse,
    });

    // Clamped to -maxTangentImpulse
    expect(clampedTangentImpulseMagnitude).toBe(-3);
  });

  it('Should return the original tangent impulse magnitude if within bounds', () => {
    const tangentImpulseMagnitude = 2;
    const maxTangentImpulse = 3;

    const clampedTangentImpulseMagnitude = clampTangentImpulseMagnitude({
      tangentImpulseMagnitude,
      maxTangentImpulse,
    });

    // Within bounds, should remain unchanged
    expect(clampedTangentImpulseMagnitude).toBe(2);
  });
});
