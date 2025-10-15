import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { getAABB } from '#/systems/AABBUpdate2dSystem/logic';
import { describe, expect, it } from 'vitest';

describe('getAABB', () => {
  it.each([
    {
      shape: {
        type: 'box',
        width: 1,
        height: 1,
      },
      expected: {
        min: { x: -0.5, y: -0.5 },
        max: { x: 0.5, y: 0.5 },
      },
    },
    {
      shape: {
        type: 'circle',
        radius: 1,
      },
      expected: {
        min: { x: -1, y: -1 },
        max: { x: 1, y: 1 },
      },
    },
  ] as const)('Should return the min and max points of the AABB for a $shape.type', ({ shape, expected }) => {
    const entity = new Entity();
    entity.addComponents([
      new Transform2dComponent(),
      new Collider2dComponent({
        shape,
      }),
    ]);
    const aabb = getAABB(entity);
    expect(aabb).toEqual(expected);
  });
});
