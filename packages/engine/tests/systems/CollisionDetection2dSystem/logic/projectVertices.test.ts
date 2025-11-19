import { describe, expect, it } from 'vitest';
import { projectVertices } from '#/systems/CollisionDetection2dSystem/logic';
import { Vector2d } from '#/maths';

describe('projectVertices', () => {
  describe('When passed valid vertices and an axis', () => {
    it('Should return the correct min and max projections', () => {
      const vertices = [
        new Vector2d({ x: 1, y: 2 }),
        new Vector2d({ x: 3, y: 4 }),
        new Vector2d({ x: -1, y: -2 }),
      ];
      const axis = new Vector2d({ x: 1, y: 0 });

      const { min, max } = projectVertices({ vertices, axis });

      const expectedProjections = vertices.map(vertex => Vector2d.dotProduct(vertex, axis));
      const expectedMin = Math.min(...expectedProjections);
      const expectedMax = Math.max(...expectedProjections);

      expect(min).toBe(expectedMin);
      expect(max).toBe(expectedMax);
    });
  });

  describe('When passed an empty array of vertices', () => {
    it('Should throw an error', () => {
      const vertices: Vector2d[] = [];
      const axis = new Vector2d({ x: 1, y: 0 });

      expect(() => {
        projectVertices({ vertices, axis });
      }).toThrow('No vertices to project');
    });
  });
});
