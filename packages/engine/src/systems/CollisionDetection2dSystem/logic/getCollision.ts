import type { Collider2dComponent } from '#/components';
import type Entity from '#/Entity';
import getBoxBoxCollision from './getBoxBoxCollision';
import getBoxCircleCollision from './getBoxCircleCollision';
import getCircleCircleCollision from './getCircleCircleCollision';

export default function getCollision(entityA: Entity, entityB: Entity) {
  const colliderA = entityA.getComponent<Collider2dComponent>('Collider2d');
  const colliderB = entityB.getComponent<Collider2dComponent>('Collider2d');

  switch (colliderA.shape.type) {
    case 'box':
      switch (colliderB.shape.type) {
        case 'box':
          return getBoxBoxCollision(entityA, entityB);
        case 'circle':
          return getBoxCircleCollision(entityA, entityB);
      }
    case 'circle':
      switch (colliderB.shape.type) {
        case 'circle':
          return getCircleCircleCollision(entityA, entityB);
        case 'box':
          return getBoxCircleCollision(entityA, entityB);
      }
  }

  return {
    isColliding: false,
  };
}
