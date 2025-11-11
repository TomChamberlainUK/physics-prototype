import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import type { Collision } from '#/types';

/**
 * Determines the collision information between two circle-shaped colliders.
 * @param entityA - The first entity with a circle collider.
 * @param entityB - The second entity with a circle collider.
 * @returns An object containing collision information, including whether a collision occurred, the collision normal, and the overlap distance.
 */
export default function getCircleCircleCollision(entityA: Entity, entityB: Entity): Collision {
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
      const contactPoint = transformA.position.subtract(normal.multiply(colliderA.shape.radius));

      return {
        isColliding: true,
        normal,
        overlap,
        contactPoint,
      };
    }
  }

  return {
    isColliding: false,
  };
}
