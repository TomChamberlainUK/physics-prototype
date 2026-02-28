import { describe, expect, it } from 'vitest';
import { Vector2d } from '#src/maths/index.js';
import { isPointInConvexPolygon } from '#src/systems/CollisionDetection2dSystem/logic/index.js';

describe('isPointInConvexPolygon', () => {
  const polygonVertices = [
    new Vector2d({ x: 0, y: 0 }),
    new Vector2d({ x: 4, y: 0 }),
    new Vector2d({ x: 4, y: 4 }),
    new Vector2d({ x: 0, y: 4 }),
  ];

  describe('When passed a point inside the polygon', () => {
    it('should return true', () => {
      const point = new Vector2d({ x: 2, y: 2 });
      const result = isPointInConvexPolygon({ point, polygonVertices });
      expect(result).toBe(true);
    });
  });

  describe('When passed a point on the edge of the polygon', () => {
    it('should return true', () => {
      const point = new Vector2d({ x: 4, y: 2 });
      const result = isPointInConvexPolygon({ point, polygonVertices });
      expect(result).toBe(true);
    });
  });

  describe('When passed a point outside the polygon', () => {
    it('should return false', () => {
      const point = new Vector2d({ x: 5, y: 5 });
      const result = isPointInConvexPolygon({ point, polygonVertices });
      expect(result).toBe(false);
    });
  });
});
