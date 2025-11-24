import { describe, expect, it } from 'vitest';
import isPointNearConvexPolygon from './isPointNearConvexPolygon';
import Vector2d from '#/maths/Vector2d';

describe('isPointNearConvexPolygon', () => {
  const polygonVertices = [
    new Vector2d({ x: 0, y: 0 }),
    new Vector2d({ x: 4, y: 0 }),
    new Vector2d({ x: 4, y: 4 }),
    new Vector2d({ x: 0, y: 4 }),
  ];

  describe('When passed a point inside the polygon', () => {
    it('should return true', () => {
      const point = new Vector2d({ x: 2, y: 2 });
      const result = isPointNearConvexPolygon({ point, polygonVertices });
      expect(result).toBe(true);
    });
  });

  describe('When passed a point on the edge of the polygon', () => {
    it('should return true', () => {
      const point = new Vector2d({ x: 4, y: 2 });
      const result = isPointNearConvexPolygon({ point, polygonVertices });
      expect(result).toBe(true);
    });
  });

  describe('When passed a point very close to the edge of the polygon', () => {
    it('should return true', () => {
      const point = new Vector2d({ x: 4 + Number.EPSILON, y: 2 });
      const result = isPointNearConvexPolygon({ point, polygonVertices });
      expect(result).toBe(true);
    });
  });

  describe('When passed a point outside the polygon', () => {
    it('should return false', () => {
      const point = new Vector2d({ x: 5, y: 5 });
      const result = isPointNearConvexPolygon({ point, polygonVertices });
      expect(result).toBe(false);
    });
  });
});
