import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import type { Collision } from '#/types';
import computeBoxAxes from './computeBoxAxes';
import getClosestBoxVertex from './getClosestBoxVertex';
import getClosestPointOnEdgeOfBox from './getClosestPointOnEdgeOfBox';
import isPointInConvexPolygon from './isPointInConvexPolygon';
import projectCircle from './projectCircle';
import projectVertices from './projectVertices';

/**
 * Determines the collision information between a box-shaped collider and a circle-shaped collider using Separating Axis Theorem (SAT).
 * @param entityA - The first entity with a box or circle collider.
 * @param entityB - The second entity with a box or circle collider.
 * @returns An object containing collision information, including whether a collision occurred, the collision normal, the overlap distance, and contact points.
 */
export default function getBoxCircleCollision(entityA: Entity, entityB: Entity): Collision {
  const colliderA = entityA.getComponent<Collider2dComponent>('Collider2d');
  const transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
  const colliderB = entityB.getComponent<Collider2dComponent>('Collider2d');
  const transformB = entityB.getComponent<Transform2dComponent>('Transform2d');

  // Identify which is box and which is circle
  let boxVertices: Vector2d[] | null;
  let circlePosition: Vector2d;
  let circleRadius: number;

  if (colliderA.shape.type === 'box' && colliderB.shape.type === 'circle') {
    boxVertices = colliderA.worldVertices;
    circlePosition = transformB.position;
    circleRadius = colliderB.shape.radius;
  }
  else if (colliderA.shape.type === 'circle' && colliderB.shape.type === 'box') {
    boxVertices = colliderB.worldVertices;
    circlePosition = transformA.position;
    circleRadius = colliderA.shape.radius;
  }
  else {
    return { isColliding: false };
  }

  if (!boxVertices) {
    return { isColliding: false };
  }

  // Get the axes to test (normals of box edges and circle-to-box axis)
  const closestBoxVertex = getClosestBoxVertex({ vertices: boxVertices, point: circlePosition });
  const circleToBoxAxis = circlePosition.subtract(closestBoxVertex).getUnit();
  const axes = [
    ...computeBoxAxes(boxVertices),
    circleToBoxAxis,
  ];

  let minOverlap = Infinity;
  let smallestAxis: Vector2d | null = null; // Minimum Translation Vector (MTV) axis

  // Check for separation on each axis
  for (const axis of axes) {
    const projectionBox = projectVertices({ vertices: boxVertices, axis });
    const projectionCircle = projectCircle({ position: circlePosition, radius: circleRadius, axis });

    // If there's a gap, there's no collision
    if (projectionBox.max < projectionCircle.min || projectionCircle.max < projectionBox.min) {
      return { isColliding: false };
    }

    // Calculate overlap on this axis
    const overlap = Math.min(projectionBox.max, projectionCircle.max) - Math.max(projectionBox.min, projectionCircle.min);

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
  if (smallestAxis && Vector2d.dotProduct(centerDelta, smallestAxis) < 0) {
    smallestAxis = smallestAxis.multiply(-1);
  }

  // Determine contact points
  const contactPoints: Vector2d[] = [];

  // Add the closest point on the box as a contact point, clamped to the circle's edge if needed
  let closestPointOnBox = getClosestPointOnEdgeOfBox({ boxVertices, point: circlePosition });
  const closestPointOnBoxToCircle = closestPointOnBox.subtract(circlePosition);
  if (closestPointOnBoxToCircle.getLengthSquared() > circleRadius * circleRadius) {
    // Clamp to circle's edge
    closestPointOnBox = circlePosition.add(closestPointOnBoxToCircle.getUnit().multiply(circleRadius));
  }
  contactPoints.push(closestPointOnBox);

  // If the circle center is inside the box, add it as a contact point
  if (isPointInConvexPolygon({ point: circlePosition, polygonVertices: boxVertices })) {
    contactPoints.push(circlePosition);
  }

  const normal = smallestAxis;
  const overlap = minOverlap;

  return {
    isColliding: true,
    contactManifold: {
      normal,
      overlap,
      contactPoints,
    },
  };
}
