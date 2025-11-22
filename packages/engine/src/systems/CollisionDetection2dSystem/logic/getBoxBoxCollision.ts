import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import type { Collision } from '#/types';
import getBoxAxes from './getBoxAxes';
import getSegmentIntersection from './getSegmentIntersection';
import isPointInConvexPolygon from './isPointInConvexPolygon';
import projectVertices from './projectVertices';

/**
 * Determines the collision information between two box-shaped colliders using Separating Axis Theorem (SAT).
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

  // Project all vertices onto the MTV and collect those inside the overlap region
  const projectionA = projectVertices({ vertices: verticesA, axis: smallestAxis });
  const projectionB = projectVertices({ vertices: verticesB, axis: smallestAxis });

  // Get the min and max of the overlap region
  const overlapMin = Math.max(projectionA.min, projectionB.min);
  const overlapMax = Math.min(projectionA.max, projectionB.max);
  const epsilon = 1e-6;

  // Collect vertices from both polygons that lie within the overlap region on the smallest axis
  const overlappingPoints = new Map<string, Vector2d>();
  for (const vertex of verticesA) {
    const projection = Vector2d.dotProduct(vertex, smallestAxis);
    if (
      projection >= overlapMin - epsilon
      && projection <= overlapMax + epsilon
      && isPointInConvexPolygon({ point: vertex, polygonVertices: verticesB })
    ) {
      overlappingPoints.set(`x: ${vertex.x}; y: ${vertex.y}`, vertex);
    }
  }
  for (const vertex of verticesB) {
    const projection = Vector2d.dotProduct(vertex, smallestAxis);
    if (
      projection >= overlapMin - epsilon
      && projection <= overlapMax + epsilon
      && isPointInConvexPolygon({ point: vertex, polygonVertices: verticesA })
    ) {
      overlappingPoints.set(`x: ${vertex.x}; y: ${vertex.y}`, vertex);
    }
  }

  // Collect contact points from edges intersecting the overlap region
  for (let i = 0; i < verticesA.length; i++) {
    const segmentAStart = verticesA[i];
    const segmentAEnd = verticesA[(i + 1) % verticesA.length];
    if (!segmentAStart || !segmentAEnd) {
      throw new Error('Undefined vertex in box collider');
    }
    for (let j = 0; j < verticesB.length; j++) {
      const segmentBStart = verticesB[j];
      const segmentBEnd = verticesB[(j + 1) % verticesB.length];
      if (!segmentBStart || !segmentBEnd) {
        throw new Error('Undefined vertex in box collider');
      }
      const intersection = getSegmentIntersection({ segmentAStart, segmentAEnd, segmentBStart, segmentBEnd });
      if (intersection) {
        overlappingPoints.set(`x: ${intersection.x}; y: ${intersection.y}`, intersection);
      }
    }
  }

  return {
    isColliding: true,
    normal: smallestAxis,
    overlap: minOverlap,
    contactPoints: Array.from(overlappingPoints.values()),
  };
}
