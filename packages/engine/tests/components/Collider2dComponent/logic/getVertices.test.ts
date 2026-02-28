import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { getVertices } from '#src/components/Collider2dComponent/logic/index.js';
import * as getBoxVerticesModule from '#src/components/Collider2dComponent/logic/getBoxVertices.js';
import { Vector2d } from '#src/maths/index.js';
import type { Shape } from '#src/types/index.js';

describe('getVertices', () => {
  let shape: Shape;

  describe('When passed a box shape', () => {
    const width = 10;
    const height = 5;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    let getBoxVerticesSpy: MockInstance<typeof getBoxVerticesModule.default>;

    beforeEach(() => {
      shape = {
        type: 'box',
        width,
        height,
      };
      getBoxVerticesSpy = vi.spyOn(getBoxVerticesModule, 'default');
    });

    it('Should return its vertices', () => {
      const expectedVertices = [
        new Vector2d({ x: -halfWidth, y: -halfHeight }),
        new Vector2d({ x: halfWidth, y: -halfHeight }),
        new Vector2d({ x: halfWidth, y: halfHeight }),
        new Vector2d({ x: -halfWidth, y: halfHeight }),
      ];
      getBoxVerticesSpy.mockReturnValue(expectedVertices);
      const vertices = getVertices(shape);
      expect(getBoxVerticesSpy).toHaveBeenCalledWith({
        width,
        height,
      });
      expect(vertices).toEqual(expectedVertices);
    });
  });

  describe('When passed a circle shape', () => {
    beforeEach(() => {
      shape = {
        type: 'circle',
        radius: 5,
      };
    });

    it('Should return null', () => {
      const vertices = getVertices(shape);
      expect(vertices).toBeNull();
    });
  });
});
