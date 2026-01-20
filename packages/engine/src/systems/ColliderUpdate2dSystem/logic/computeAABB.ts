import type Entity from '#/Entity';
import type { Collider2dComponent, Transform2dComponent } from '#/components';
import getBoxAABB from './getBoxAABB';
import getCircleAABB from './getCircleAABB';

/**
 * Computes and returns the axis-aligned bounding box (AABB) for a given entity.
 * @param entity - The entity for which to compute the AABB.
 * @returns The computed AABB or null if the entity lacks required components.
 */
export default function computeAABB(entity: Entity) {
  if (!entity.hasComponents(['Collider2d', 'Transform2d'])) {
    return null;
  }

  const collider = entity.getComponent<Collider2dComponent>('Collider2d');
  const transform = entity.getComponent<Transform2dComponent>('Transform2d');

  switch (collider.shape.type) {
    case 'box': {
      return getBoxAABB({
        width: collider.shape.width,
        height: collider.shape.height,
        position: transform.position,
        rotation: transform.rotation,
      });
    }
    case 'circle': {
      return getCircleAABB({
        radius: collider.shape.radius,
        position: transform.position,
      });
    }
  }
}
