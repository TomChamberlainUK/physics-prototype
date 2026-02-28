import { describe, expect, it } from 'vitest';
import { clampTangentImpulseMagnitude } from '#src/systems/CollisionImpulseResolution2dSystem/logic/index.js';

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
