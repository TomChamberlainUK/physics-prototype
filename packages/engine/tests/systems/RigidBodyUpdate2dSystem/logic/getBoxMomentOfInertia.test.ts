import { getBoxMomentOfInertia } from '#/systems/RigidBodyUpdate2dSystem/logic';
import { describe, expect, it } from 'vitest';

describe('getBoxMomentOfInertia', () => {
  it('Should calculate the moment of inertia for a box', () => {
    const mass = 10; // kg
    const width = 2; // m
    const height = 3; // m

    const momentOfInertia = getBoxMomentOfInertia({ mass, width, height });

    const expectedMomentOfInertia = (1 / 12) * mass * (width * width + height * height);

    expect(momentOfInertia).toEqual(expectedMomentOfInertia); // kg·m²
  });
});
