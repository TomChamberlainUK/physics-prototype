import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import type { AABB } from '#/types';
import computeBoxAABB from './computeBoxAABB';
import getCircleAABB from './getCircleAABB';

/**
 * Computes and returns the axis-aligned bounding box (AABB) for a given entity.
 * @param entity - The entity for which to compute the AABB, see {@link Entity}.
 * @returns The computed AABB or null if the entity lacks required components, see {@link AABB}.
 */
export default function computeAABB(entity: Entity): AABB | null {
  if (!entity.hasComponents(['Collider2d', 'Transform2d'])) {
    return null;
  }

  const collider = entity.getComponent<Collider2dComponent>('Collider2d');
  const transform = entity.getComponent<Transform2dComponent>('Transform2d');

  switch (collider.shape.type) {
    case 'box': {
      return computeBoxAABB({
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
