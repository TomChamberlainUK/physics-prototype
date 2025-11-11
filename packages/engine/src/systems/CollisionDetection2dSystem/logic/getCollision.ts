import type { Collider2dComponent } from '#/components';
import type Entity from '#/Entity';
import type { Collision } from '#/types';
import getBoxBoxCollision from './getBoxBoxCollision';
import getBoxCircleCollision from './getBoxCircleCollision';
import getCircleCircleCollision from './getCircleCircleCollision';

/**
 * Determines the collision information between two entities based on their collider shapes.
 * @param entityA - The first entity with a collider.
 * @param entityB - The second entity with a collider.
 * @returns An object containing collision information, including whether a collision occurred, the collision normal, and the overlap distance.
 */
export default function getCollision(entityA: Entity, entityB: Entity): Collision {
  const colliderA = entityA.getComponent<Collider2dComponent>('Collider2d');
  const colliderB = entityB.getComponent<Collider2dComponent>('Collider2d');

  switch (colliderA.shape.type) {
    case 'box':
      switch (colliderB.shape.type) {
        case 'box':
          return getBoxBoxCollision(entityA, entityB);
        case 'circle':
          return getBoxCircleCollision(entityA, entityB);
        default:
          return {
            isColliding: false,
          };
      }
    case 'circle':
      switch (colliderB.shape.type) {
        case 'circle':
          return getCircleCircleCollision(entityA, entityB);
        case 'box':
          return getBoxCircleCollision(entityA, entityB);
        default:
          return {
            isColliding: false,
          };
      }
  }
}
