import { getCircleMomentOfInertia } from '#/systems/RigidBodyUpdate2dSystem/logic';
import { describe, expect, it } from 'vitest';

describe('getCircleMomentOfInertia', () => {
  it('Should calculate the moment of inertia for a circle', () => {
    const mass = 5; // kg
    const radius = 1; // m

    const momentOfInertia = getCircleMomentOfInertia({ mass, radius });

    const expectedMomentOfInertia = (1 / 2) * mass * radius * radius;

    expect(momentOfInertia).toEqual(expectedMomentOfInertia);
  });
});
