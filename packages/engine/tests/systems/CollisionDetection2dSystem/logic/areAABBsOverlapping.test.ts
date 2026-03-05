import { areAABBsOverlapping } from '#src/systems/CollisionDetection2dSystem/logic/index.js';
import { describe, expect, it } from 'vitest';

describe('areAABBsOverlapping', () => {
  describe('When passed two AABBs that don\'t overlap', () => {
    it('Should return false', () => {
      const a = {
        min: { x: 0, y: 0 },
        max: { x: 1, y: 1 },
      };
      const b = {
        min: { x: 2, y: 2 },
        max: { x: 3, y: 3 },
      };
      const result = areAABBsOverlapping(a, b);
      expect(result).toBe(false);
    });
  });

  describe('When passed two AABBs that overlap', () => {
    it('Should return true', () => {
      const a = {
        min: { x: 0, y: 0 },
        max: { x: 1, y: 1 },
      };
      const b = {
        min: { x: 0.5, y: 0.5 },
        max: { x: 1.5, y: 1.5 },
      };
      const result = areAABBsOverlapping(a, b);
      expect(result).toBe(true);
    });
  });
});
