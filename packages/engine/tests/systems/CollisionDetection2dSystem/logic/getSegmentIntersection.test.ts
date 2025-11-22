import { Vector2d } from '#/maths';
import { getSegmentIntersection } from '#/systems/CollisionDetection2dSystem/logic';
import { describe, expect, it } from 'vitest';

describe('getSegmentIntersection', () => {
  describe('When passed two segments that intersect', () => {
    it('Should return the intersection point', () => {
      const intersection = getSegmentIntersection({
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
      const intersection = getSegmentIntersection({
        segmentAStart: new Vector2d({ x: -2, y: 0 }),
        segmentAEnd: new Vector2d({ x: 2, y: 0 }),
        segmentBStart: new Vector2d({ x: 4, y: -2 }),
        segmentBEnd: new Vector2d({ x: 4, y: 2 }),
      });
      expect(intersection).toBeNull();
    });
  });
});
