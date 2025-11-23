import { describe, expect, it } from 'vitest';
import Vector2d from '#/maths/Vector2d';
import { getClosestPointOnEdgeOfBox } from '#/systems/CollisionDetection2dSystem/logic';

describe('getClosestPointOnEdgeOfBox', () => {
  const vertices: Vector2d[] = [
    new Vector2d({ x: -1, y: -1 }),
    new Vector2d({ x: 1, y: -1 }),
    new Vector2d({ x: 1, y: 1 }),
    new Vector2d({ x: -1, y: 1 }),
  ];

  describe('When provided a point closest to a vertex', () => {
    it('Should return the vertex as the closest point', () => {
      const point = new Vector2d({ x: -2, y: -2 });
      const closestPoint = getClosestPointOnEdgeOfBox({ boxVertices: vertices, point });
      expect(closestPoint).toEqual(new Vector2d({ x: -1, y: -1 }));
    });
  });

  describe('When provided a point closest to an edge', () => {
    it('Should return the correct closest point on the edge', () => {
      const point = new Vector2d({ x: 0, y: -2 });
      const closestPoint = getClosestPointOnEdgeOfBox({ boxVertices: vertices, point });
      expect(closestPoint).toEqual(new Vector2d({ x: 0, y: -1 }));
    });
  });

  describe('When provided a point inside the box', () => {
    it('Should return the closest point', () => {
      const point = new Vector2d({ x: 0.1, y: 0 });
      const closestPoint = getClosestPointOnEdgeOfBox({ boxVertices: vertices, point });
      expect(closestPoint).toEqual(new Vector2d({ x: 1, y: 0 }));
    });
  });
});
