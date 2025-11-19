import { describe, expect, it } from 'vitest';
import { getBoxAxes } from '#/systems/CollisionDetection2dSystem/logic';
import { Vector2d } from '#/maths';

describe('getBoxAxes', () => {
  describe('When passed 4 valid box vertices', () => {
    it('Should return their 2 axes', () => {
      const vertexA = new Vector2d({ x: 0, y: 0 });
      const vertexB = new Vector2d({ x: 2, y: 0 });
      const vertexC = new Vector2d({ x: 2, y: 2 });
      const vertexD = new Vector2d({ x: 0, y: 2 });

      const axes = getBoxAxes([
        vertexA,
        vertexB,
        vertexC,
        vertexD,
      ]);

      const expectedAxisAB = vertexB.subtract(vertexA).getNormal().getUnit(); // Upward normal of edge AB
      const expectedAxisBC = vertexC.subtract(vertexB).getNormal().getUnit(); // Rightward normal of edge BC

      const actualAxisAB = axes[0];
      const actualAxisBC = axes[1];

      if (!actualAxisAB || !actualAxisBC) {
        throw new Error('Returned axes are undefined');
      }

      expect(axes.length).toBe(2);
      expect(actualAxisAB).toEqual(expectedAxisAB);
      expect(actualAxisAB).toEqual(expectedAxisAB);
      expect(actualAxisBC).toEqual(expectedAxisBC);
      expect(actualAxisBC).toEqual(expectedAxisBC);
    });
  });

  describe('When not passed 4 vertices', () => {
    it('Should throw an error', () => {
      const vertexA = new Vector2d({ x: 0, y: 0 });
      const vertexB = new Vector2d({ x: 2, y: 0 });
      const vertexC = new Vector2d({ x: 2, y: 2 });

      expect(() => {
        getBoxAxes([
          vertexA,
          vertexB,
          vertexC,
        ]);
      }).toThrow('getBoxAxes requires exactly 4 vertices.');
    });
  });

  describe('When passed undefined vertices', () => {
    it('Should throw an error', () => {
      const vertexA = new Vector2d({ x: 0, y: 0 });
      const vertexB = undefined;
      const vertexC = new Vector2d({ x: 2, y: 2 });
      const vertexD = new Vector2d({ x: 0, y: 2 });

      expect(() => {
        getBoxAxes([
          vertexA,
          vertexB,
          vertexC,
          vertexD,
        ] as unknown as Vector2d[]);
      }).toThrow('Vertices must be defined Vector2d objects.');
    });
  });
});
