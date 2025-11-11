import { getBoxAABB } from '#/systems/AABBUpdate2dSystem/logic';
import { describe, expect, it } from 'vitest';

describe('getBoxAABB', () => {
  it('Should return the min and max points of the AABB for a box', () => {
    const width = 32;
    const height = 16;
    const position = { x: 64, y: 64 };
    const aabb = getBoxAABB({ width, height, position });
    expect(aabb).toEqual({
      min: {
        x: position.x - width / 2,
        y: position.y - height / 2,
      },
      max: {
        x: position.x + width / 2,
        y: position.y + height / 2,
      },
    });
  });
});
