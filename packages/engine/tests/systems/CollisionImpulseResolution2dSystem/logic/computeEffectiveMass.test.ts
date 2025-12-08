import computeEffectiveMass from '#/systems/CollisionImpulseResolution2dSystem/logic/computeEffectiveMass';
import { describe, expect, it } from 'vitest';

describe('computeEffectiveMass', () => {
  it('Should return the effective mass at a contact point between two rigid bodies', () => {
    const inverseMomentOfInertiaA = 0.2;
    const inverseMomentOfInertiaB = 0.4;
    const torqueArmA = 1.5;
    const torqueArmB = 2.5;
    const totalInverseMass = 0.8;

    const effectiveMass = computeEffectiveMass({
      inverseMomentOfInertiaA,
      inverseMomentOfInertiaB,
      torqueArmA,
      torqueArmB,
      totalInverseMass,
    });

    const expectedEffectiveMass = totalInverseMass
      + (torqueArmA ** 2) * inverseMomentOfInertiaA
      + (torqueArmB ** 2) * inverseMomentOfInertiaB;

    expect(effectiveMass).toBeCloseTo(expectedEffectiveMass);
  });
});
