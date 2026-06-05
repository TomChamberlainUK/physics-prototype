import { describe, expect, it } from 'vitest';
import { Vector2d } from '#/maths/index.js';
import { computeCircleAABB } from '#/systems/ColliderUpdate2dSystem/logic/index.js';

describe('computeCircleAABB', () => {
  it('Should return the min and max points of the AABB for a circle', () => {
    const radius = 16;
    const position = new Vector2d({ x: 32, y: 32 });
    const aabb = computeCircleAABB({ radius, position });
    expect(aabb).toEqual({
      min: { x: position.x - radius, y: position.y - radius },
      max: { x: position.x + radius, y: position.y + radius },
    });
  });
});
