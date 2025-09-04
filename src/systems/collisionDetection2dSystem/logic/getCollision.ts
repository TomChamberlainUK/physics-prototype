import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';

export default function getCollision(entityA: Entity, entityB: Entity) {
  const colliderA = entityA.getComponent<Collider2dComponent>('Collider2d');
  const transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
  const colliderB = entityB.getComponent<Collider2dComponent>('Collider2d');
  const transformB = entityB.getComponent<Transform2dComponent>('Transform2d');

  const difference = transformA.position.subtract(transformB.position);
  const distance = difference.getLength();
  const totalRadius = colliderA.shape.radius + colliderB.shape.radius;

  if (distance < totalRadius) {
    return {
      isColliding: true,
      normal: difference.getUnit(),
      overlap: totalRadius - distance
    };
  }

  return {
    isColliding: false
  };
}
