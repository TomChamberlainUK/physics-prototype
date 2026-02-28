import type { Collider2dComponent, Transform2dComponent } from '#src/components/index.js';
import { Vector2d } from '#src/maths/index.js';
import type { Collision } from '#src/types/index.js';
import computeBoxAxes from './computeBoxAxes.js';
import computeSegmentIntersection from './computeSegmentIntersection.js';
import isPointInConvexPolygon from './isPointInConvexPolygon.js';
import projectVertices from './projectVertices.js';

/**
 * Properties required to detect a box-box collision.
 */
type Properties = {
  /** Collider component of box A */
  colliderA: Collider2dComponent;
  /** Collider component of box B */
  colliderB: Collider2dComponent;
  /** Transform component of box A */
  transformA: Transform2dComponent;
  /** Transform component of box B */
  transformB: Transform2dComponent;
};

/**
 * Detects a collision between two box-shaped colliders using Separating Axis Theorem (SAT).
 * @param properties - An object containing the collider and transform components of the two boxes, see {@link Properties}.
 * @returns An object containing whether a collision occurred, its normal, the overlap distance, and contact points, see {@link Collision}.
 */
export default function detectBoxBoxCollision({
  colliderA,
  colliderB,
  transformA,
  transformB,
}: Properties): Collision {
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
    ...computeBoxAxes(verticesA),
    ...computeBoxAxes(verticesB),
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
      const intersection = computeSegmentIntersection({ segmentAStart, segmentAEnd, segmentBStart, segmentBEnd });
      if (intersection) {
        overlappingPoints.set(`x: ${intersection.x}; y: ${intersection.y}`, intersection);
      }
    }
  }

  const normal = smallestAxis;
  const overlap = minOverlap;
  let contactPoints = Array.from(overlappingPoints.values());

  // Reduce contact points to 2 most significant points:
  // - The deepest penetrating point
  // - The point farthest along the collision normal from the deepest point
  if (contactPoints.length > 2) {
    // Project each contact point onto the normal
    const projections = contactPoints.map(point => Vector2d.dotProduct(point, normal));
    // Find indices of min and max projection
    const minIndex = projections.indexOf(Math.min(...projections));
    const maxIndex = projections.indexOf(Math.max(...projections));
    // Set contact points to these two points
    contactPoints = [contactPoints[minIndex]!, contactPoints[maxIndex]!];
  }

  // Fallback: If no contact points found, use the center of the overlap region projected onto the collision normal
  if (contactPoints.length === 0) {
    // Project the center of box A onto the collision normal, then move by half the overlap
    const fallbackPoint = transformA.position.add(normal.multiply(overlap / 2));
    contactPoints = [fallbackPoint];
  }

  return {
    isColliding: true,
    contactManifold: {
      normal,
      overlap,
      contactPoints,
    },
  };
}
