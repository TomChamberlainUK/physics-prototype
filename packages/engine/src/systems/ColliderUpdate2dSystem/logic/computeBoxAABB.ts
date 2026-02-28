import { Matrix2d, Vector2d } from '#src/maths/index.js';
import type { AABB } from '#src/types/index.js';

/**
 * Properties required to compute the AABB for a box.
 */
type Properties = {
  /** The width of the box. */
  width: number;
  /** The height of the box. */
  height: number;
  /** The position of the box's center. */
  position: Vector2d;
  /** The rotation of the box in radians. */
  rotation: number;
};

/**
 * Computes and returns the axis-aligned bounding box (AABB) for a box.
 * @param properties - The width, height, position, and rotation of the box, see {@link Properties}.
 * @returns The computed AABB, see {@link AABB}.
 */
export default function computeBoxAABB({ width, height, position, rotation }: Properties): AABB {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const translationMatrix = Matrix2d.translation(position);
  const rotationMatrix = Matrix2d.rotation(rotation);
  const transformMatrix = Matrix2d.multiply(translationMatrix, rotationMatrix);

  // Corners of the box in local space
  const localCorners = [
    new Vector2d({ x: -halfWidth, y: -halfHeight }),
    new Vector2d({ x: halfWidth, y: -halfHeight }),
    new Vector2d({ x: halfWidth, y: halfHeight }),
    new Vector2d({ x: -halfWidth, y: halfHeight }),
  ];

  // Corners of the box in world space after rotation and translation
  const worldCorners = localCorners.map(corner => transformMatrix.transformPoint(corner));

  const xs = worldCorners.map(corner => corner.x);
  const ys = worldCorners.map(corner => corner.y);

  return {
    min: {
      x: Math.min(...xs),
      y: Math.min(...ys),
    },
    max: {
      x: Math.max(...xs),
      y: Math.max(...ys),
    },
  };
}
