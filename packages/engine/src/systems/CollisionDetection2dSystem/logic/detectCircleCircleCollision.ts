import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import type { Collision } from '#/types';

/**
 * Detects a collision between two circle-shaped colliders using pythagorean theorem.
 * @param entityA - The first entity with a circle collider.
 * @param entityB - The second entity with a circle collider.
 * @returns An object containing collision information, including whether a collision occurred, the collision normal, the overlap distance, and contact points.
 */
export default function detectCircleCircleCollision(entityA: Entity, entityB: Entity): Collision {
  const colliderA = entityA.getComponent<Collider2dComponent>('Collider2d');
  const transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
  const colliderB = entityB.getComponent<Collider2dComponent>('Collider2d');
  const transformB = entityB.getComponent<Transform2dComponent>('Transform2d');

  if (colliderA.shape.type === 'circle' && colliderB.shape.type === 'circle') {
    const delta = transformA.position.subtract(transformB.position);
    const totalRadius = colliderA.shape.radius + colliderB.shape.radius;

    const distanceSquared = delta.getLengthSquared();
    const totalRadiusSquared = totalRadius * totalRadius;

    if (distanceSquared < totalRadiusSquared) {
      const distance = Math.sqrt(distanceSquared);
      const overlap = totalRadius - distance;
      const normal = distance === 0
        ? new Vector2d({ x: 1, y: 0 })
        : delta.getUnit();

      // Calculate contact points on the surface of each circle
      let contactPointA = transformA.position.subtract(normal.multiply(colliderA.shape.radius));
      let contactPointB = transformB.position.add(normal.multiply(colliderB.shape.radius));

      // Clamp the contact points to the edges of the circles in case of deep overlap
      const contactPointAToCircleB = contactPointA.subtract(transformB.position);
      if (contactPointAToCircleB.getLengthSquared() > colliderB.shape.radius * colliderB.shape.radius) {
        contactPointA = transformB.position.add(contactPointAToCircleB.getUnit().multiply(colliderB.shape.radius));
      }
      const contactPointBToCircleA = contactPointB.subtract(transformA.position);
      if (contactPointBToCircleA.getLengthSquared() > colliderA.shape.radius * colliderA.shape.radius) {
        contactPointB = transformA.position.add(contactPointBToCircleA.getUnit().multiply(colliderA.shape.radius));
      }

      return {
        isColliding: true,
        contactManifold: {
          normal,
          overlap,
          contactPoints: [contactPointA, contactPointB],
        },
      };
    }
  }

  return {
    isColliding: false,
  };
}
