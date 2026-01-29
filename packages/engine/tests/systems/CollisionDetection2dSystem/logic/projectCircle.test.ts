import { Vector2d } from '#/maths';
import { projectCircle } from '#/systems/CollisionDetection2dSystem/logic';
import { describe, expect, it } from 'vitest';

describe('projectCircle', () => {
  it('Should return correct min and max projections for a circle onto an axis', () => {
    const position = new Vector2d({ x: 1, y: 2 });
    const radius = 5;
    const axis = new Vector2d({ x: 1, y: 0 });

    const { min, max } = projectCircle({ position, radius, axis });

    const expectedCenterProjection = Vector2d.dotProduct(position, axis);
    const expectedMin = expectedCenterProjection - radius;
    const expectedMax = expectedCenterProjection + radius;

    expect(min).toBe(expectedMin);
    expect(max).toBe(expectedMax);
  });
});
