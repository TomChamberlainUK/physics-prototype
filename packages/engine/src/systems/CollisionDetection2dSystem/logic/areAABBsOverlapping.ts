import type { AABB } from '#src/types/index.js';

/**
 * Determines whether two axis-aligned bounding boxes (AABBs) overlap.
 * @param a - The first AABB, see {@link AABB}.
 * @param b - The second AABB, see {@link AABB}.
 * @returns True if the AABBs overlap, otherwise false.
 */
export default function areAABBsOverlapping(a: AABB, b: AABB) {
  return (
    a.max.x > b.min.x
    && a.min.x < b.max.x
    && a.max.y > b.min.y
    && a.min.y < b.max.y
  );
}
