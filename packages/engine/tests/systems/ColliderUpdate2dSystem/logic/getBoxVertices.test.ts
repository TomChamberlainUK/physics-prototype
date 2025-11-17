import { describe, expect, it } from 'vitest';
import { getBoxVertices } from '#/systems/ColliderUpdate2dSystem/logic';

describe('getBoxVertices', () => {
  it('Should return vertices for a box', () => {
    const width = 4;
    const height = 2;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const expectedVertices = [
      { x: -halfWidth, y: -halfHeight },
      { x: halfWidth, y: -halfHeight },
      { x: halfWidth, y: halfHeight },
      { x: -halfWidth, y: halfHeight },
    ];
    const vertices = getBoxVertices({ width, height });
    expect(vertices).toEqual(expectedVertices);
  });
});
