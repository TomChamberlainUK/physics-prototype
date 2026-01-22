import { Vector2d } from '#/maths';
import { findClosestBoxVertex } from '#/systems/CollisionDetection2dSystem/logic';
import { describe, expect, it } from 'vitest';

describe('findClosestBoxVertex', () => {
  it('Should find the closest vertex of a box to a given point', () => {
    const vectorA = new Vector2d({ x: 0, y: 0 });
    const vectorB = new Vector2d({ x: 2, y: 0 });
    const vectorC = new Vector2d({ x: 2, y: 2 });
    const vectorD = new Vector2d({ x: 0, y: 2 });
    const boxVertices = [
      vectorA,
      vectorB,
      vectorC,
      vectorD,
    ];
    const point = new Vector2d({ x: 3, y: 3 });

    const closestVertex = findClosestBoxVertex({ vertices: boxVertices, point });

    const expectedClosestVertex = vectorC;

    expect(closestVertex).toBe(expectedClosestVertex);
  });
});
