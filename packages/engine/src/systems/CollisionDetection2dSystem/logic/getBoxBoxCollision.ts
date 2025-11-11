import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import type { Collision } from '#/types';

/**
 * Determines the collision information between two box-shaped colliders.
 * @param entityA - The first entity with a box collider.
 * @param entityB - The second entity with a box collider.
 * @returns An object containing collision information, including whether a collision occurred, the collision normal, and the overlap distance.
 */
export default function getBoxBoxCollision(entityA: Entity, entityB: Entity): Collision {
  const colliderA = entityA.getComponent<Collider2dComponent>('Collider2d');
  const transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
  const colliderB = entityB.getComponent<Collider2dComponent>('Collider2d');
  const transformB = entityB.getComponent<Transform2dComponent>('Transform2d');

  if (colliderA.shape.type === 'box' && colliderB.shape.type === 'box') {
    const halfWidthA = colliderA.shape.width / 2;
    const halfHeightA = colliderA.shape.height / 2;
    const halfWidthB = colliderB.shape.width / 2;
    const halfHeightB = colliderB.shape.height / 2;

    const delta = transformA.position.subtract(transformB.position);

    const overlapX = halfWidthA + halfWidthB - Math.abs(delta.x);
    const overlapY = halfHeightA + halfHeightB - Math.abs(delta.y);

    if (overlapX > 0 && overlapY > 0) {
      if (overlapX < overlapY) {
        const overlap = overlapX;
        const normal = new Vector2d({
          x: delta.x < 0
            ? -1
            : 1,
          y: 0,
        });

        return {
          isColliding: true,
          normal,
          overlap,
        };
      }
      else {
        const overlap = overlapY;
        const normal = new Vector2d({
          x: 0,
          y: delta.y < 0
            ? -1
            : 1,
        });

        return {
          isColliding: true,
          normal,
          overlap,
        };
      }
    }
  }

  return {
    isColliding: false,
  };
}
