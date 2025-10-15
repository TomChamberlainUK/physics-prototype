import type { AABB } from '#/types';

export default function getAABBOverlap(a: AABB, b: AABB) {
  return (
    a.max.x > b.min.x
    && a.min.x < b.max.x
    && a.max.y > b.min.y
    && a.min.y < b.max.y
  );
}
