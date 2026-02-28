import { Vector2d } from '#src/maths/index.js';
import { computeSegmentIntersection } from '#src/systems/CollisionDetection2dSystem/logic/index.js';
import { describe, expect, it } from 'vitest';

describe('computeSegmentIntersection', () => {
  describe('When passed two segments that intersect', () => {
    it('Should return the intersection point', () => {
      const intersection = computeSegmentIntersection({
        segmentAStart: new Vector2d({ x: -2, y: 0 }),
        segmentAEnd: new Vector2d({ x: 2, y: 0 }),
        segmentBStart: new Vector2d({ x: 0, y: -2 }),
        segmentBEnd: new Vector2d({ x: 0, y: 2 }),
      });
      const expectedIntersection = new Vector2d({ x: 0, y: 0 });
      expect(intersection).toEqual(expectedIntersection);
    });
  });

  describe('When passed two segments that do not intersect', () => {
    it('Should return null', () => {
      const intersection = computeSegmentIntersection({
        segmentAStart: new Vector2d({ x: -2, y: 0 }),
        segmentAEnd: new Vector2d({ x: 2, y: 0 }),
        segmentBStart: new Vector2d({ x: 4, y: -2 }),
        segmentBEnd: new Vector2d({ x: 4, y: 2 }),
      });
      expect(intersection).toBeNull();
    });
  });
});
