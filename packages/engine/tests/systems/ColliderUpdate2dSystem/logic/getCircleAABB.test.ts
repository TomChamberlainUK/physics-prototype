import { getCircleAABB } from '#/systems/ColliderUpdate2dSystem/logic';
import { describe, expect, it } from 'vitest';

describe('getCircleAABB', () => {
  it('Should return the min and max points of the AABB for a circle', () => {
    const radius = 16;
    const position = { x: 32, y: 32 };
    const aabb = getCircleAABB({ radius, position });
    expect(aabb).toEqual({
      min: { x: position.x - radius, y: position.y - radius },
      max: { x: position.x + radius, y: position.y + radius },
    });
  });
});
