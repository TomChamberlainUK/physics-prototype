import type { AABB } from '#/types';

/**
 * Determines whether two axis-aligned bounding boxes (AABBs) overlap.
 * @param a - The first AABB.
 * @param b - The second AABB.
 * @returns True if the AABBs overlap, otherwise false.
 */
export default function getAABBOverlap(a: AABB, b: AABB) {
  return (
    a.max.x > b.min.x
    && a.min.x < b.max.x
    && a.max.y > b.min.y
    && a.min.y < b.max.y
  );
}
