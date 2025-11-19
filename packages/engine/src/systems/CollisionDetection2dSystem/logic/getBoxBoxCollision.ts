import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import type { Collision } from '#/types';
import getBoxAxes from './getBoxAxes';
import projectVertices from './projectVertices';

/**
 * Determines the collision information between two box-shaped colliders.
 * @param entityA - The first entity with a box collider.
 * @param entityB - The second entity with a box collider.
 * @returns An object containing collision information, including whether a collision occurred, the collision normal, and the overlap distance.
 */
export default function getBoxBoxCollision(entityA: Entity, entityB: Entity): Collision {
  const colliderA = entityA.getComponent<Collider2dComponent>('Collider2d');
  const colliderB = entityB.getComponent<Collider2dComponent>('Collider2d');
  const transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
  const transformB = entityB.getComponent<Transform2dComponent>('Transform2d');

  if (colliderA.shape.type !== 'box' || colliderB.shape.type !== 'box') {
    return { isColliding: false };
  }

  const verticesA = colliderA.worldVertices;
  const verticesB = colliderB.worldVertices;

  if (!verticesA || !verticesB) {
    return { isColliding: false };
  }

  // SAT (Separating Axis Theorem) implementation

  // Get the axes to test (normals of all edges)
  const axes = [
    ...getBoxAxes(verticesA),
    ...getBoxAxes(verticesB),
  ];

  let minOverlap = Infinity;
  let smallestAxis: Vector2d | null = null; // Minimum Translation Vector (MTV) axis

  // Check for separation on each axis
  for (const axis of axes) {
    const projectionA = projectVertices({ vertices: verticesA, axis });
    const projectionB = projectVertices({ vertices: verticesB, axis });

    // If there's a gap, there's no collision
    if (projectionA.max < projectionB.min || projectionB.max < projectionA.min) {
      return { isColliding: false };
    }

    // Calculate overlap on this axis
    const overlap = Math.min(projectionA.max, projectionB.max) - Math.max(projectionA.min, projectionB.min);

    // Update minimum overlap and corresponding axis
    if (overlap < minOverlap) {
      minOverlap = overlap;
      smallestAxis = axis;
    }
  }

  if (smallestAxis === null) {
    throw new Error('Collision detected but no separating axis found');
  }

  // Ensure the MTV (normal) always points from B to A
  const centerDelta = transformA.position.subtract(transformB.position);
  if (Vector2d.dotProduct(centerDelta, smallestAxis) < 0) {
    smallestAxis = smallestAxis.multiply(-1);
  }

  return {
    isColliding: true,
    normal: smallestAxis,
    overlap: minOverlap,
  };
}
