import type { Collider2dComponent, Transform2dComponent } from '#src/components/index.js';
import type { AABB } from '#src/types/index.js';
import computeBoxAABB from './computeBoxAABB.js';
import computeCircleAABB from './computeCircleAABB.js';

/**
 * The components required to compute the AABB.
 */
type Properties = {
  /** The Collider2d component of the entity. */
  collider: Collider2dComponent;
  /** The Transform2d component of the entity. */
  transform: Transform2dComponent;
};

/**
 * The output of the computeAABB function.
 */
type Output = AABB | null;

/**
 * Computes and returns the axis-aligned bounding box (AABB) for a given entity.
 * @param properties - An object containing the Collider2d and Transform2d components, see {@link Properties}.
 * @returns The computed AABB, or null if the collider shape is not recognised, see {@link Output}.
 */
export default function computeAABB({ collider, transform }: Properties): Output {
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
      return computeCircleAABB({
        radius: collider.shape.radius,
        position: transform.position,
      });
    }
    default: {
      return null;
    }
  }
}
