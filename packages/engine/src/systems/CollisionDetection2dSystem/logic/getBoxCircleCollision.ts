import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import { Vector2d } from '#/maths';
import type { BoxShape, CircleShape } from '#/types';

export default function getBoxCircleCollision(entityA: Entity, entityB: Entity) {
  const colliderA = entityA.getComponent<Collider2dComponent>('Collider2d');
  const transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
  const colliderB = entityB.getComponent<Collider2dComponent>('Collider2d');
  const transformB = entityB.getComponent<Transform2dComponent>('Transform2d');

  let boxCollider: Collider2dComponent;
  let boxTransform: Transform2dComponent;
  let circleCollider: Collider2dComponent;
  let circleTransform: Transform2dComponent;
  let delta: Vector2d;

  if (colliderA.shape.type === 'box' && colliderB.shape.type === 'circle') {
    boxCollider = colliderA;
    boxTransform = transformA;
    circleCollider = colliderB;
    circleTransform = transformB;
    delta = boxTransform.position.subtract(circleTransform.position);
  } else if (colliderA.shape.type === 'circle' && colliderB.shape.type === 'box') {
    boxCollider = colliderB;
    boxTransform = transformB;
    circleCollider = colliderA;
    circleTransform = transformA;
    delta = circleTransform.position.subtract(boxTransform.position);
  } else {
    return { isColliding: false };
  }

  const boxShape = boxCollider.shape as BoxShape;
  const circleShape = circleCollider.shape as CircleShape;

  const halfWidth = boxShape.width / 2;
  const halfHeight = boxShape.height / 2;

  const closestPointOnBox = new Vector2d({
    x: Math.max(-halfWidth, Math.min(delta.x, halfWidth)),
    y: Math.max(-halfHeight, Math.min(delta.y, halfHeight))
  });

  const deltaToClosestPointOnBox = delta.subtract(closestPointOnBox);

  const distanceSquared = deltaToClosestPointOnBox.getLengthSquared();
  const radiusSquared = circleShape.radius * circleShape.radius;

  if (distanceSquared < radiusSquared) {
    const distance = Math.sqrt(distanceSquared);
    const overlap = circleShape.radius - distance;

    let normal: Vector2d;
    if (distance === 0) {
      const distanceToNearestVerticalSide = Math.min(
        Math.abs(delta.x - halfWidth),
        Math.abs(delta.x + halfWidth)
      );
      const distanceToNearestHorizontalSide = Math.min(
        Math.abs(delta.y - halfHeight),
        Math.abs(delta.y + halfHeight)
      );
      if (distanceToNearestVerticalSide < distanceToNearestHorizontalSide) {
        normal = new Vector2d({
          x: delta.x > 0
            ? 1
            : -1,
          y: 0,
        });
      } else {
        normal = new Vector2d({
          x: 0,
          y: delta.y > 0
            ? 1
            : -1,
        });
      }
    } else {
      normal = deltaToClosestPointOnBox.getUnit();
    }

    return {
      isColliding: true,
      normal,
      overlap
    };
  }

  return {
    isColliding: false
  };
}